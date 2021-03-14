import { Tasks } from "../../task/Tasks";
import {
  CONSTRUCTION_SITE_TYPE,
  ERR_NOTHING_TO_DO,
  ERR_NO_TARGET,
  ERR_NO_WORKING_STATION,
  SOURCE_TYPE
} from "../../utils/ConstantUtils";
import { CreepUtils } from "../../utils/CreepUtils";
import { RoomConstructionSiteUtils } from "../../utils/room/RoomConstructionSiteUtils";
import { Traveler } from "../../utils/Traveler";

/**
 * @description A buildder is there to build structure in a colony.
 * This creep is able to perform several types of actions such as harvesting, crafting and reload.
 *
 * A builder can do 3 type of task :
 * - Harvest energy : when there are no room storage resources available. He leaves to recover energy in order to continue to carry out his main activity
 * - Build : when there are structures to build, the builder will concentrate on building them as quickly as possible.
 * - Reload: when it has no more resources, it will refuel in priority in the storage so as not to have to take harvest time.
 *
 * when he has nothing to do, the creep lets himself die. Ideally, it should be produced only when it is needed: that is, when there is a need to build something !
 * @version 1,0
 * @author kevin desmay
 */
export interface Builder extends Creep {
  memory: BuilderMemory;
}

export class BuilderMemory implements CreepMemory {
  role: string = "builder";
  homeRoomName: string;
  /** Where the creep have to go to work */
  workingStation: string;

  /** Creep's target to harvest energy */
  targetSourceId: Id<Source> | undefined;
  /** Creep's target's to harvest position. Where is the task to do */
  _targetSourcePos: RoomPosition | undefined;
  /** Target's pos to do buildf energy. Where is the task to do */
  _targetSourceRoom: string | undefined;

  /** Target to do build something */
  targetBuildId: Id<ConstructionSite> | undefined;
  /** Target's pos to do buildf energy. Where is the task to do */
  _targetBuildPos: RoomPosition | undefined;
  /** Target's pos to do buildf energy. Where is the task to do */
  _targetBuildRoom: string | undefined;

  /** Storage where the builder is linked */
  storageId?: Id<StructureStorage>;
  /** Position of the storage */
  _storagePos?: RoomPosition;

  /** The creep are ready to build something */
  canBuild: boolean;

  _trav: any;
  _travel: any;

  /**
   * Initialize a Builder.
   * @param currentRoom Room where the creep is actualy
   * @param storage Storage who are a reference to take energy for this creep
   */
  constructor(currentRoom: Room, storage?: StructureStorage) {
    this.homeRoomName = currentRoom.name;
    this.workingStation = currentRoom.name;
    this.canBuild = false;
    if (storage) {
      this.storageId = storage.id;
      this._storagePos = storage.pos;
    }
  }
}

const roleBuilder = {
  run(creep: Builder) {
    let analyseCPUStart = Game.cpu.getUsed();
    let buildMode = creep.memory.canBuild;
    let statutOfExecution: number = OK;

    // Find work in the master room
    let homeRoom = Game.rooms[creep.memory.homeRoomName];
    // Time to build something.
    if (buildMode) {
      // no urgence, can build something in the room
      statutOfExecution = Tasks.buildSomething(creep, homeRoom);
      if (statutOfExecution != ERR_NO_TARGET && statutOfExecution !== ERR_NOTHING_TO_DO) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }

      tryToSwitchMode(creep);
    }
    // Reload mode
    else {
      // than, go to STORAGE
      statutOfExecution = Tasks.refillToStorage(creep, homeRoom);
      if (statutOfExecution != ERR_NO_TARGET && statutOfExecution !== ERR_NOTHING_TO_DO) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }

      // TODO : take energy on the ground, try something who don't use a lot of CPU

      // find a target and harvest it // find a target and harvest it
      Tasks.harvestSomething(creep, homeRoom);
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
function tryToSwitchMode(creep: Builder) {
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
export default roleBuilder;
