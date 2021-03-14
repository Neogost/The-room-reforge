import { Tasks } from "../../task/Tasks";
import {
  ERR_NOTHING_TO_DO,
  ERR_NO_WORKING_STATION,
  CONTROLER_TYPE,
  SOURCE_TYPE,
  ERR_NO_TARGET
} from "../../utils/ConstantUtils";
import { CreepUtils } from "../../utils/CreepUtils";
import { Traveler } from "../../utils/Traveler";
/**
 * @description A upgrader is there to upgrade the structure controller of the colony.
 * This creep is able to perform several types of actions such as harvesting, upgrade and reload.
 *
 * A builder can do 3 type of task :
 * - Harvest energy : when there are no room storage resources available. He leaves to recover energy in order to continue to carry out his main activity
 * - Upgrade : When the creep can upgrade the controller, it do it. It's this primary functionnality
 * - Reload: when it has no more resources, it will refuel in priority in the storage so as not to have to take harvest time.
 *
 * when he has nothing to do, the creep lets himself die. Ideally, it should be produced only when it is needed: that is, when there is a need to upgrade something !
 * @version 1,0
 * @author kevin desmay
 */
export interface Upgrader extends Creep {
  memory: UpgraderMemory;
}

export class UpgraderMemory implements CreepMemory {
  role: string = "upgrader";
  homeRoomName: string;
  /** Where the creep have to go to work */
  workingStation: string;

  /** Storage where the builder is linked */
  storageId?: Id<StructureStorage>;
  /** Position of the storage */
  _storagePos?: RoomPosition;

  /** where the upgrader is linked */
  linkId?: Id<StructureLink>;
  /** Position of the link */
  _linkPos?: RoomPosition;

  /** Creep's target to harvest energy */
  targetSourceId: Id<Source> | undefined;
  /** Creep's target's to harvest position. Where is the task to do */
  _targetSourcePos: RoomPosition | undefined;
  /** Target's pos to do buildf energy. Where is the task to do */
  _targetSourceRoom: string | undefined;

  /** The creep are ready to upgrade the controller */
  canUpgrade: boolean;

  _trav: any;
  _travel: any;

  /**
   * Initialize a Builder.
   * @param currentRoom Room where the creep is actualy
   * @param storage Storage who are a reference to take energy for this creep
   * @param link Link structure who store energy and the creep can refill
   */
  constructor(currentRoom: Room, storage?: StructureStorage, link?: StructureLink | null) {
    this.homeRoomName = currentRoom.name;
    this.workingStation = currentRoom.name;
    this.canUpgrade = false;
    if (storage) {
      this.storageId = storage.id;
      this._storagePos = storage.pos;
    }
    if (link) {
      this.linkId = link.id;
      this._linkPos = link.pos;
    }
  }
}

const roleUpgrader = {
  run(creep: Upgrader) {
    let analyseCPUStart = Game.cpu.getUsed();

    let canUpgrade = creep.memory.canUpgrade;
    let statutOfExecution: number = OK;

    let roomHome = Game.rooms[creep.memory.homeRoomName];
    if (canUpgrade) {
      statutOfExecution = Tasks.upgradeController(creep, roomHome.controller);
      if (statutOfExecution != ERR_NO_TARGET && statutOfExecution !== ERR_NOTHING_TO_DO) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }
      tryToSwitchMode(creep);
    }
    // Refill
    else {
      // Check if there are a link available
      if (creep.memory.linkId) {
        let link = Game.getObjectById(creep.memory.linkId);
        // There is some energy in the link ?
        if (link && link.store[RESOURCE_ENERGY] != 0) {
          // try to use it
          if (creep.pos.isNearTo(link)) {
            tryToSwitchMode(creep);
            CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
            statutOfExecution = creep.withdraw(link, RESOURCE_ENERGY);
          } else {
            CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
            return Traveler.travelTo(creep, link.pos);
          }
        }
      }
      // than, go to STORAGE
      statutOfExecution = Tasks.refillToStorage(creep, roomHome);
      if (statutOfExecution != ERR_NO_TARGET && statutOfExecution !== ERR_NOTHING_TO_DO) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }

      // find a target and harvest it
      statutOfExecution = Tasks.harvestSomething(creep, roomHome);
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
function tryToSwitchMode(creep: Upgrader) {
  // Can continue to do this job ?
  if (creep.memory.canUpgrade) {
    // try to enter harvest mode
    if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
      creep.memory.canUpgrade = false;
    }
  } else {
    // try to enter build mode
    if (creep.store.getFreeCapacity() === 0) {
      creep.memory.canUpgrade = true;
    }
  }
}
export default roleUpgrader;
