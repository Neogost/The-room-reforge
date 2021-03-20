import { ERR_NO_TARGET, CREEP_MANAGER } from "../../utils/ConstantUtils";
import { Traveler } from "../../utils/Traveler";
import { CreepUtils } from "../../utils/CreepUtils";
import { Tasks } from "../../task/Tasks";
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
export interface Carrier extends Creep {
  memory: CarrierMemory;
}

export class CarrierMemory implements CreepMemory {
  role: string = "carrier";
  homeRoomName: string;

  /** Storage where the builder is linked */
  storageId?: Id<StructureStorage>;
  /** Position of the storage */
  _storagePos?: RoomPosition;

  /** Creep's constainer to do task */
  containerId?: Id<StructureContainer> | null;
  /** Creep's target's position. Where is the task to do */
  _containerPos?: RoomPosition | null;
  /** Target's pos to do buildf energy. Where is the task to do */
  _containerRoom?: string | undefined;

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
  constructor(
    currentRoom: Room,
    containerId: Id<StructureContainer>,
    containerPos: RoomPosition,
    containerRoomName: string,
    storage?: StructureStorage
  ) {
    this.homeRoomName = currentRoom.name;
    this.canMove = true;
    this.containerId = containerId;
    this._containerPos = containerPos;
    this._containerRoom = containerRoomName;
    if (storage) {
      this.storageId = storage.id;
      this._storagePos = storage.pos;
    }
  }
}

const roleCarrier = {
  run(creep: Carrier) {
    // can move to the container assigned

    let analyseCPUStart = Game.cpu.getUsed();

    let canMove = creep.memory.canMove;
    let statutOfExecution: number = OK;

    let roomHome = Game.rooms[creep.memory.homeRoomName];
    if (canMove) {
      // Go to container assigned
      let containerId = creep.memory.containerId;

      if (!containerId) {
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return ERR_NO_TARGET;
      }

      let container = Game.getObjectById(containerId);

      if (!container && !CreepUtils.inTheRightRoom(creep, creep.memory._containerRoom) && creep.memory._containerPos) {
        let pos = new RoomPosition(
          creep.memory._containerPos.x,
          creep.memory._containerPos.y,
          creep.memory._containerPos.roomName
        );
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return Traveler.travelTo(creep, pos);
      }
      if (!container) {
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return ERR_NO_TARGET;
      }
      if (container.store[RESOURCE_ENERGY] === 0) {
        let dropedRessources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 2);
        if (dropedRessources.length > 0) {
          let dropedRessource = dropedRessources[0];
          if (dropedRessource) {
            if (creep.pos.isNearTo(dropedRessource)) {
              tryToSwitchMode(creep);
              return creep.pickup(dropedRessource);
            } else {
              return Traveler.travelTo(creep, dropedRessource);
            }
          }
        }
      }
      if (creep.pos.isNearTo(container.pos)) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return creep.withdraw(container, RESOURCE_ENERGY);
      } else {
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return Traveler.travelTo(creep, container.pos);
      }
    } else {
      let managerAvailable = _.filter(Memory.creeps, function (c) {
        return c.role === CREEP_MANAGER;
      });
      // Refill the storage only if an manager do the job to transfert energy
      if (managerAvailable.length > 0) {
        statutOfExecution = Tasks.transfertToStorage(creep, roomHome);
        if (CreepUtils.canDoSomething(statutOfExecution)) {
          tryToSwitchMode(creep);
          CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
          return OK;
        }
      }

      statutOfExecution = Tasks.transfertToEssentialStructure(creep, roomHome);
      if (CreepUtils.canDoSomething(statutOfExecution)) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }

      statutOfExecution = Tasks.transfertToStorage(creep, roomHome);
      if (CreepUtils.canDoSomething(statutOfExecution)) {
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
function tryToSwitchMode(creep: Carrier) {
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
export default roleCarrier;
