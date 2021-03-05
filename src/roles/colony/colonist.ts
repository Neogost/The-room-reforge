import {
  CONSTRUCTION_SITE_TYPE,
  ERR_NOTHING_TO_DO,
  ERR_NO_TARGET,
  ERR_NO_WORKING_STATION,
  STRUCTURE_TYPE
} from "../../utils/ConstantUtils";
import { Traveler } from "../../utils/Traveler";
import { Logger } from "../../utils/Logger";
import { List, values } from "lodash";
import { unwatchFile } from "fs";
import { SOURCE_SOURCE_OPTION } from "../../utils/ConstantUtils";
import { RoomPositionUtils } from "../../utils/RoomPositionUtils";

/**
 * @description A colonist is there to help a new colonist take her place in the empire.
 * The settler is able to perform basic actions such as harvesting, building and maintaining a room. It is polivament and intended to disappear once the part is well installed.
 *
 * A colonist can do 3 type of task :
 * - Harvest energy : The first task assigned to him in order to be able to supply the colony with resources for its development
 * - Build : Second activity, allows to meet the infrastructure needs of the colony. However, prioritizes resource extraction over it
 * - Upgrade : Ancillary activity of the colon. Indispensable in the sense or without a controller, the colony is lost.
 * The colonist will therefore make sure to keep the room controller at a set level while waiting for Upgrader to take over.
 * This action is prioritized if the controller is below the safety level.
 *
 * He also performs resource movement tasks in order to supply production structures such as the spawner and extensions.
 *
 * If it has no activity, it stores its excess resources in a storage area and lets itself die.
 *
 * A colonist have to be affected to a working station (a room) to do something.
 * @version 1.0
 * @author kevin desmay
 */
export interface Colonist extends Creep {
  memory: ColonistMemory;
}

export class ColonistMemory implements CreepMemory {
  role: string = "colonist";
  homeRoomName: string;
  /** Where the creep have to go to work */
  workingStation: string;
  /** Creep's target to do task */
  targetId: Id<Structure | ConstructionSite | Source> | null;
  /** Creep's target's position. Where is the task to do */
  _targetPos: RoomPosition | null;
  /** Type of target */
  targetType: string | null;

  /** The creep are ready to build something */
  canBuild: boolean;

  _trav: any;
  _travel: any;

  /**
   * Initialize a Colonist.
   * @param currentRoom Room where the creep is actualy
   */
  constructor(currentRoom: Room) {
    this.homeRoomName = currentRoom.name;
    this.workingStation = currentRoom.name;
    this.targetId = null;
    this._targetPos = null;
    this.canBuild = false;
    this.targetType = null;
  }
}

const roleColonist = {
  run(creep: Colonist) {
    let AnalyseCPUStart = Game.cpu.getUsed();
    if (!creep.memory.workingStation) {
      // Haven't working station can't work.
      return ERR_NO_WORKING_STATION;
    }
    let buildMode = creep.memory.canBuild;
    let workingStation = creep.memory.workingStation;
    let statutOfExecution: number = OK;

    if (workingStation !== creep.room.name) {
      // travel to go at work, do nothing more
      let AnalyseCPUEnd = Game.cpu.getUsed();
      Logger.debug(creep.name + " exection use : " + (AnalyseCPUEnd - AnalyseCPUStart));
      return Traveler.travelTo(creep, new RoomPosition(25, 25, workingStation));
    }

    let room = Game.rooms[workingStation];
    // Time to build something.
    if (buildMode) {
      // need help, transfert energy to essential structure
      statutOfExecution = transfertEnergyToEssentialStructure(creep, room);
      if (statutOfExecution == OK) {
        tryToSwitchMode(creep);
        let AnalyseCPUEnd = Game.cpu.getUsed();
        Logger.debug(creep.name + " exection use : " + (AnalyseCPUEnd - AnalyseCPUStart));
        return OK;
      }

      // Inspect if the controller need to be upgrade
      statutOfExecution = upgradeConstroller(creep, room.controller);
      if (statutOfExecution == OK) {
        tryToSwitchMode(creep);
        let AnalyseCPUEnd = Game.cpu.getUsed();
        Logger.debug(creep.name + " exection use : " + (AnalyseCPUEnd - AnalyseCPUStart));
        return OK;
      }

      // no urgence, can build something in the room
      statutOfExecution = buildSomething(creep, room);
      if (statutOfExecution == OK) {
        tryToSwitchMode(creep);
        let AnalyseCPUEnd = Game.cpu.getUsed();
        Logger.debug(creep.name + " exection use : " + (AnalyseCPUEnd - AnalyseCPUStart));
        return OK;
      }

      // in all other case, try to switch mode
      tryToSwitchMode(creep);
    }
    // Time to harvest,
    else {
      // find a target and harvest it
      harvestEnergy(creep, room);

      // try to witch mode
      tryToSwitchMode(creep);
    }

    let AnalyseCPUEnd = Game.cpu.getUsed();
    Logger.debug(creep.name + " exection use : " + (AnalyseCPUEnd - AnalyseCPUStart));
    return statutOfExecution;
  }
};

/**
 * @description Control and execute action to upgrade the controler of the room if needed.
 * The colonist check if the `setting.conlinsation.levelToMaintain` is under the level of acceptance
 * @param creep Creep who do the task
 * @param controller Controller to upgrade if needed
 * @returns statut of the execution. OK(0) if all is good
 */
function upgradeConstroller(creep: Colonist, controller: StructureController | undefined): number {
  if (canUpgradeController(controller)) {
    let controllerPosition: RoomPosition = controller!.pos;

    // Upgrade the controller
    if (creep.pos.inRangeTo(controllerPosition, 3)) {
      return creep.upgradeController(controller!);
    }
    // Move to upgrade
    else {
      return Traveler.travelTo(creep, controllerPosition);
    }
  }
  return ERR_NOTHING_TO_DO;
}

/**
 * @description Check if the controller in the room can be upgrade by a colonist
 * @param controller Controller in the room
 * @returns true if creep have to up the controller, else false
 */
function canUpgradeController(controller: StructureController | undefined): boolean {
  let levelToMaintainController = Memory.settings.colonisation.levelToMaintain;
  return !!controller && !!controller.my && controller.level < levelToMaintainController;
}
/**
 * @description Check and execute the task `build`. If the creep can do something in the room, he will take the first thing and build it.
 * @param creep Creep who do the task
 * @param room Room where the creep do something
 * @returns statut of the execution. OK(0) il all is good, else error code.
 */
function buildSomething(creep: Colonist, room: Room): number {
  if (!creep.memory.targetId) {
    // NOTE : Réfléchir, le colon a t'il besoin d'etre intélligent et de choisir les batiments prioritaire ?
    let constructionsSites: ConstructionSiteMemoryMap<ConstructionSiteOptions> = room.memory.constructionsSites;
    // Take first element
    let constructionSiteToWork = constructionsSites != null ? constructionsSites[0] : null;
    if (!constructionSiteToWork) {
      return ERR_NOTHING_TO_DO;
    }
    setTargetInMemory(creep, constructionSiteToWork, CONSTRUCTION_SITE_TYPE);
  }

  let target: ConstructionSite | Structure | Source | null = Game.getObjectById(creep.memory.targetId!);
  // If target does't exist or the id is not a `ConstructionSite` reset memory.
  if (!target || target instanceof Structure) {
    // Check if the constructions site exist in memory
    // delete it because it doesn't exist now
    if (creep.memory.targetId && room.memory.constructionsSites[creep.memory.targetId]) {
      delete room.memory.constructionsSites[creep.memory.targetId];
    }
    resetTargetInMemory(creep);
    return ERR_INVALID_TARGET;
  }

  if (creep.pos.inRangeTo(target.pos, 3)) {
    return creep.build(target as ConstructionSite);
  } else {
    return Traveler.travelTo(creep, target.pos);
  }
}
/**
 * @description The colonist try to tranfert energy to essential structure in a room.
 * An essential structure is a structure who need energy to product creep or important element for the room.
 * Actual essential structure :
 * - `StructureSpawn`
 * - `StructureExtension`
 * @param creep Creep who do try to transfert energy
 * @param room Room where the creep is
 * @returns statut of execution
 */
function transfertEnergyToEssentialStructure(creep: Colonist, room: Room): number {
  if (!creep.memory.targetId || creep.memory.targetType !== STRUCTURE_TYPE) {
    // get essential Structure who need energy
    let essentialStructures: List<Structure> = room.find(FIND_MY_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN;
      }
    });
    // Filter stucture who don't need energy
    essentialStructures = _.filter(essentialStructures, function (structure: StructureSpawn | StructureExtension) {
      return structure.store.getFreeCapacity(RESOURCE_ENERGY) !== 0;
    });

    let essentialStructure = essentialStructures != null ? essentialStructures[0] : null;
    if (!essentialStructure) {
      return ERR_NOTHING_TO_DO;
    }
    setTargetInMemory(creep, essentialStructure, STRUCTURE_TYPE);
  }
  let target = <StructureSpawn | StructureExtension>Game.getObjectById(creep.memory.targetId!);
  if (!target || !(target instanceof Structure) || target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
    resetTargetInMemory(creep);
    return ERR_NO_TARGET;
  }
  if (creep.pos.isNearTo(target.pos)) {
    return creep.transfer(target, RESOURCE_ENERGY);
  } else {
    return Traveler.travelTo(creep, target.pos);
  }
}

/**
 * @description Check and act if the creep can switch his working mode.
 * Modify in memory the parameter `canbuild` of the creep.
 * @param creep Creep who try to change his settings
 */
function tryToSwitchMode(creep: Colonist) {
  // Can continue to do this job ?
  if (creep.memory.canBuild) {
    // try to enter harvest mode
    if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
      creep.memory.canBuild = false;
      resetTargetInMemory(creep);
    }
  } else {
    // try to enter build mode
    if (creep.store.getFreeCapacity() === 0) {
      creep.memory.canBuild = true;
      resetTargetInMemory(creep);
    }
  }
}

/**
 * @description find a source of energy in the room and harvest this target
 * @param creep creep who try to harverst a source of energy
 * @param room Room where the creep try to harverst
 * @returns statut of execution
 */
function harvestEnergy(creep: Colonist, room: Room): number {
  //  TO DO : result value
  let target: Source | Structure | ConstructionSite | undefined | null;
  // If a target is set in memory, take it
  if (creep.memory.targetId) {
    target = Game.getObjectById(creep.memory.targetId);
  }
  // if there are no sources or not available sources
  if (
    !target ||
    !(target instanceof Source) ||
    (!target.pos.getOpenPositions().length && !creep.pos.isNearTo(target))
  ) {
    resetTargetInMemory(creep);
    target = findEnergySource(creep, room);
  }

  // If source exit in a room available
  if (target) {
    // Close, harvest it
    if (creep.pos.isNearTo(target.pos)) {
      return creep.harvest(target);
    }
    // Not in range to harvest, move to it
    else {
      return Traveler.travelTo(creep, target);
    }
  } else {
    return ERR_NO_TARGET;
  }
}

/**
 * @description Find in the room the sources of energy who can be harvest.
 * @param creep Creep who try to find an energy sources
 * @param room Room where the creep try to find energy source
 * @returns Source of energy. If no one is find, return `undefined`
 */
function findEnergySource(creep: Colonist, room: Room): Source | undefined {
  let source: Source | Structure | ConstructionSite | undefined | null;
  // S'il y a une source en mémoire, on la récupère
  if (creep.memory.targetId) {
    source = Game.getObjectById(creep.memory.targetId);
  }
  if (!source || !(source instanceof Source)) {
    let sourcesInMemory = room.memory.sources;
    if (sourcesInMemory) {
      let sourceOptionFind = _.find(sourcesInMemory, function (s) {
        // On cherche s'il y a des places disponible autour de la source
        return s.type === SOURCE_SOURCE_OPTION && RoomPositionUtils.getOpenPositions(s.pos).length > 0;
      });
      source = <Source>Game.getObjectById(sourceOptionFind!.id);
    }
  }
  // On récupère les sources de la room du creep
  if (source) {
    // On sauvegarde la sources assigné
    creep.memory.targetId = source.id;
    // On retourne la source
    return source as Source;
  }
  return undefined;
}

/**
 * @description Reset the target in the creep memory.
 * @param creep Creep who see his memory modify
 */
function resetTargetInMemory(creep: Colonist) {
  creep.memory.targetId = null;
  creep.memory._targetPos = null;
  creep.memory.targetType = null;
}

/**
 * @description set the target in the creep memory.
 * @param creep Creep who see his memory modify
 * @param target Target to set in memory.
 */
function setTargetInMemory(creep: Colonist, target: ConstructionSiteOptions | Structure | Source, type: string) {
  creep.memory.targetId = target.id;
  creep.memory._targetPos = target.pos;
  creep.memory.targetType = type;
}

export default roleColonist;
