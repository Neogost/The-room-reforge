import { CreepUtils } from "../../utils/CreepUtils";
import { Tasks } from "../../task/Tasks";

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
  workingStation: string | undefined;

  /** Creep's target to harvest energy */
  targetSourceId: Id<Source> | undefined;
  /** Creep's target's to harvest position. Where is the task to do */
  _targetSourcePos: RoomPosition | undefined;
  /** Target's pos to do buildf energy. Where is the task to do */
  _targetSourceRoom: string | undefined;

  /** Target to do transfert of energy */
  targetTransfertId: Id<Structure> | undefined;
  /** Target's pos to do transfert of energy. Where is the task to do */
  _targetTransferPos: RoomPosition | undefined;
  /** Target's pos to do buildf energy. Where is the task to do */
  _targetTransferRoom: string | undefined;

  /** Target to do build something */
  targetBuildId: Id<ConstructionSite> | undefined;
  /** Target's pos to do buildf energy. Where is the task to do */
  _targetBuildPos: RoomPosition | undefined;
  /** Target's pos to do buildf energy. Where is the task to do */
  _targetBuildRoom: string | undefined;

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
    this.canBuild = false;
  }
}

const roleColonist = {
  run(creep: Colonist) {
    let analyseCPUStart = Game.cpu.getUsed();
    let buildMode = creep.memory.canBuild;
    let statutOfExecution: number = OK;

    let room = Game.rooms[creep.memory.homeRoomName];
    // Time to build something.
    if (buildMode) {
      // need help, transfert energy to essential structure
      statutOfExecution = Tasks.transfertToEssentialStructure(creep, room);
      if (CreepUtils.canDoSomething(statutOfExecution)) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }

      // Inspect if the controller need to be upgrade
      statutOfExecution = Tasks.upgradeController(creep, room.controller);
      if (CreepUtils.canDoSomething(statutOfExecution)) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }

      // no urgence, can build something in the room
      statutOfExecution = Tasks.buildSomething(creep, room);
      if (CreepUtils.canDoSomething(statutOfExecution)) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }

      statutOfExecution = Tasks.transfertToStorage(creep, room);
      if (CreepUtils.canDoSomething(statutOfExecution)) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }
      // in all other case, try to switch mode
      tryToSwitchMode(creep);
    }
    // Time to harvest,
    else {
      // find a target and harvest it
      statutOfExecution = Tasks.harvestSomething(creep, room);

      // try to witch mode
      tryToSwitchMode(creep);
    }

    CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
    return statutOfExecution;
  }
};

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
    }
  } else {
    // try to enter build mode
    if (creep.store.getFreeCapacity() === 0) {
      creep.memory.canBuild = true;
    }
  }
}

export default roleColonist;
