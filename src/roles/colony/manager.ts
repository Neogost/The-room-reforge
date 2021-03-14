import { Tasks } from "../../task/Tasks";
import { ERR_NO_TARGET, ERR_NOTHING_TO_DO } from "../../utils/ConstantUtils";
import { CreepUtils } from "../../utils/CreepUtils";

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
export interface Manager extends Creep {
  memory: ManagerMemory;
}

export class ManagerMemory implements CreepMemory {
  role: string = "manager";
  homeRoomName: string;

  /** Storage where the builder is linked */
  storageId?: Id<StructureStorage>;
  /** Position of the storage */
  _storagePos?: RoomPosition;

  /** Target to do transfert of energy */
  targetTransfertId: Id<Structure> | undefined;
  /** Target's pos to do transfert of energy. Where is the task to do */
  _targetTransferPos: RoomPosition | undefined;
  /** Target's pos to do buildf energy. Where is the task to do */
  _targetTransferRoom: string | undefined;

  /** The creep are ready to build something */
  canMove: boolean;

  _trav: any;
  _travel: any;

  /**
   * Initialize a Builder.
   * @param currentRoom Room where the creep is actualy
   * @param storage Storage who are a reference to take energy for this creep
   */
  constructor(currentRoom: Room, storage?: StructureStorage) {
    this.homeRoomName = currentRoom.name;
    this.canMove = true;
    if (storage) {
      this.storageId = storage.id;
      this._storagePos = storage.pos;
    }
  }
}

const roleManager = {
  run(creep: Manager) {
    // Récupère de l'énergie dans le storage

    let analyseCPUStart = Game.cpu.getUsed();

    let canMove = creep.memory.canMove;
    let statutOfExecution: number = OK;

    let roomHome = Game.rooms[creep.memory.homeRoomName];
    if (canMove) {
      statutOfExecution = Tasks.refillToStorage(creep, roomHome);
      if (statutOfExecution != ERR_NO_TARGET && statutOfExecution !== ERR_NOTHING_TO_DO) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }
    } else {
      Tasks.transfertToEssentialStructure(creep, roomHome);
      if (statutOfExecution != ERR_NO_TARGET && statutOfExecution !== ERR_NOTHING_TO_DO) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }
    }
    return statutOfExecution;
  }
};

/**
 * @description Check and act if the creep can switch his working mode.
 * Modify in memory the parameter `canbuild` of the creep.
 * @param creep Creep who try to change his settings
 */
function tryToSwitchMode(creep: Manager) {
  // Can continue to do this job ?
  if (creep.memory.canMove) {
    // try to enter build mode
    if (creep.store.getFreeCapacity() === 0) {
      creep.memory.canMove = false;
    }
  } else {
    // try to enter harvest mode
    if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
      creep.memory.canMove = true;
    }
  }
}
export default roleManager;
