import { ERR_NOTHING_TO_DO, ERR_NO_TARGET } from "../../utils/ConstantUtils";
import { Traveler } from "../../utils/Traveler";
import { CreepUtils } from "../../utils/CreepUtils";
import { Tasks } from "../../task/Tasks";
/**
 * @description A harveser is there to harvest ressource. Nothing more if he have a container to store energy.
 * If not, do the same work as a colonist.
 * This creep is able to perform several types of actions such as harvesting, upgrade and reload.
 *
 * A builder can do 3 type of task :
 * TODO
 *
 * when he has nothing to do, the creep lets himself die. Ideally, it should be produced only when it is needed: that is, when there is a need to upgrade something !
 * @version 1,0
 * @author kevin desmay
 */
export interface Repairman extends Creep {
  memory: RepairmanMemory;
}

export class RepairmanMemory implements CreepMemory {
  role: string = "repairmans";
  homeRoomName: string;

  /** Storage where the builder is linked */
  storageId?: Id<StructureStorage>;
  /** Position of the storage */
  _storagePos?: RoomPosition;

  /** Creep's target to harvest energy */
  targetSourceId: Id<Source> | undefined;
  /** Creep's target's to harvest position. Where is the task to do */
  _targetSourcePos: RoomPosition | undefined;
  /** Target's pos to do buildf energy. Where is the task to do */
  _targetSourceRoom: string | undefined;

  repairTargetId: Id<Structure> | undefined;
  _repairTargetPos: RoomPosition | undefined;
  _repairTargetName: string | undefined;

  _trav: any;
  _travel: any;

  canRepair: boolean;
  /**
   * Initialize a Builder.
   * @param currentRoom Room where the creep is actualy
   * @param storage Storage who are a reference to take energy for this creep
   * @param link Link structure who store energy and the creep can refill
   */
  constructor(currentRoom: Room, storage?: StructureStorage) {
    this.homeRoomName = currentRoom.name;
    this.canRepair = false;
    if (storage) {
      this.storageId = storage.id;
      this._storagePos = storage.pos;
    }
  }
}

const roleReparman = {
  run(creep: Repairman) {
    // Rechercher quoi réparer
    let analyseCPUStart = Game.cpu.getUsed();
    let homeRoom = Game.rooms[creep.memory.homeRoomName];
    let statutOfExecution: number = OK;
    // Can repair
    if (creep.memory.canRepair) {
      statutOfExecution = Tasks.repairSomething(creep, homeRoom);
      if (statutOfExecution != ERR_NO_TARGET && statutOfExecution != ERR_NOTHING_TO_DO) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }
      tryToSwitchMode(creep);
    }
    // refil
    else {
      // than, go to STORAGE
      statutOfExecution = Tasks.refillToStorage(creep, homeRoom);
      if (statutOfExecution != ERR_NO_TARGET && statutOfExecution !== ERR_NOTHING_TO_DO) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }

      // than, go to HARVEST
      statutOfExecution = Tasks.harvestSomething(creep, homeRoom);
      if (statutOfExecution != ERR_NO_TARGET && statutOfExecution !== ERR_NOTHING_TO_DO) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }
    }

    return OK;
  }
};

/**
 * @description Check and act if the creep can switch his working mode.
 * Modify in memory the parameter `canbuild` of the creep.
 * @param creep Creep who try to change his settings
 */
function tryToSwitchMode(creep: Repairman) {
  // Can continue to do this job ?
  if (creep.memory.canRepair) {
    // try to enter harvest mode
    if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
      creep.memory.canRepair = false;
    }
  } else {
    // try to enter build mode
    if (creep.store.getFreeCapacity() === 0) {
      creep.memory.canRepair = true;
    }
  }
}
export default roleReparman;
