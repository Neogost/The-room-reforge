import { CreepUtils } from "../../utils/CreepUtils";
import {
  ERR_NO_WORKING_STATION,
  ERR_NOTHING_TO_DO,
  STRUCTURE_TYPE,
  CONSTRUCTION_SITE_TYPE,
  ERR_NO_TARGET
} from "../../utils/ConstantUtils";
import { Traveler } from "../../utils/Traveler";
import { TaskTransfertToEssential } from "../../task/TaskTransfertToEssential";
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
export interface Harvester extends Creep {
  memory: HarvesterMemory;
}

export class HarvesterMemory implements CreepMemory {
  role: string = "harvester";
  homeRoomName: string;

  /** Storage where the builder is linked */
  storageId?: Id<StructureStorage>;
  /** Position of the storage */
  _storagePos?: RoomPosition;

  secondaryTargetId?: Id<ConstructionSite | Structure> | null;
  /** Creep's target's position. Where is the task to do */
  _secondaryTargetPos?: RoomPosition | null;

  /** Target to do transfert of energy */
  targetTransfertId: Id<Structure> | undefined;
  /** Target's pos to do transfert of energy. Where is the task to do */
  _targetTransferPos: RoomPosition | undefined;
  /** Target's pos to do buildf energy. Where is the task to do */
  _targetTransferRoom: string | undefined;

  /** Creep's target to do task */
  targetId: Id<Source> | null;
  /** Creep's target's position. Where is the task to do */
  _targetPos: RoomPosition | null;
  /** Target's pos to do buildf energy. Where is the task to do */
  _targetRoom: string | undefined;

  /** Target to do build something */
  targetBuildId: Id<ConstructionSite> | undefined;
  /** Target's pos to do buildf energy. Where is the task to do */
  _targetBuildPos: RoomPosition | undefined;
  /** Target's pos to do buildf energy. Where is the task to do */
  _targetBuildRoom: string | undefined;

  /** Creep's constainer to do task */
  containerId?: Id<StructureContainer> | null;
  /** Creep's target's position. Where is the task to do */
  _containerPos?: RoomPosition | null;
  /** Target's pos to do buildf energy. Where is the task to do */
  _containerRoom?: string | undefined;
  /** Type of target */

  /** The creep are ready to harvest energy */
  canHarvest: boolean;

  _trav: any;
  _travel: any;

  /**
   * Initialize a Builder.
   * @param currentRoom Room where the creep is actualy
   * @param storage Storage who are a reference to take energy for this creep
   * @param link Link structure who store energy and the creep can refill
   */
  constructor(
    currentRoom: Room,
    targetId: Id<Source>,
    targetPos: RoomPosition,
    targetRoomName: string,
    storage?: StructureStorage,
    container?: StructureContainer
  ) {
    this.homeRoomName = currentRoom.name;
    this.targetId = targetId;
    this._targetPos = targetPos;
    this._targetRoom = targetRoomName;
    this.canHarvest = true;
    if (storage) {
      this.storageId = storage.id;
      this._storagePos = storage.pos;
    }
    if (container) {
      this.containerId = container.id;
      this._containerPos = container.pos;
    }
  }
}

const roleHarvester = {
  run(creep: Harvester) {
    let analyseCPUStart = Game.cpu.getUsed();

    let canHarverst = creep.memory.canHarvest;
    let statutOfExecution: number = OK;

    let roomHome = Game.rooms[creep.memory.homeRoomName];
    let targetId = creep.memory.targetId;
    if (canHarverst) {
      if (!targetId) {
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return ERR_NOTHING_TO_DO;
      }

      let target = Game.getObjectById(targetId);
      if (!target && !CreepUtils.inTheRightRoom(creep, creep.memory._targetRoom) && creep.memory._targetPos) {
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        let pos = new RoomPosition(
          creep.memory._targetPos.x,
          creep.memory._targetPos.y,
          creep.memory._targetPos.roomName
        );
        return Traveler.travelTo(creep, pos);
      } else if (!target) {
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return ERR_NOTHING_TO_DO;
      }
      if (creep.pos.isNearTo(target.pos)) {
        creep.harvest(target);
      } else {
        Traveler.travelTo(creep, target.pos);
      }
      tryToSwitchMode(creep);
    }
    // drop mode
    else {
      // Find container
      if (!creep.memory.containerId) {
        let container = <StructureContainer>creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: function (s) {
            return s.structureType === STRUCTURE_CONTAINER;
          }
        });
        if (container) {
          creep.memory.containerId = container.id;
          creep.memory._containerPos = container.pos;
          creep.memory._containerRoom = container.room.name;
        }
      }

      // transfer to CONTAINER
      if (creep.memory.containerId) {
        let container = Game.getObjectById(creep.memory.containerId);
        if (container && container.store[RESOURCE_ENERGY] !== container.store.getCapacity()) {
          if (creep.pos.isNearTo(container.pos)) {
            tryToSwitchMode(creep);
            CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
            return creep.transfer(container, RESOURCE_ENERGY);
          } else {
            CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
            return Traveler.travelTo(creep, container.pos);
          }
        } else {
          creep.memory._containerRoom = undefined;
        }
      }

      // than, go to STORAGE
      statutOfExecution = Tasks.transfertToStorage(creep, roomHome);
      if (statutOfExecution != ERR_NO_TARGET && statutOfExecution !== ERR_NOTHING_TO_DO) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }

      // than do to TRANSFERT somthing
      statutOfExecution = Tasks.transfertToEssentialStructure(creep, roomHome);
      if (statutOfExecution != ERR_NO_TARGET && statutOfExecution !== ERR_NOTHING_TO_DO) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }

      // than do to BUILD somthing
      statutOfExecution = Tasks.buildSomething(creep, roomHome);
      if (statutOfExecution != ERR_NO_TARGET && statutOfExecution !== ERR_NOTHING_TO_DO) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }

      // no urgence, can build something in the room
      statutOfExecution = Tasks.upgradeController(creep, roomHome.controller);
      if (statutOfExecution != ERR_NO_TARGET && statutOfExecution !== ERR_NOTHING_TO_DO) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }
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
function tryToSwitchMode(creep: Harvester) {
  // Can continue to do this job ?
  if (creep.memory.canHarvest) {
    // try to enter build mode
    if (creep.store.getFreeCapacity() === 0) {
      creep.memory.canHarvest = false;
    }
  } else {
    // try to enter harvest mode
    if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
      creep.memory.canHarvest = true;
    }
  }
}
export default roleHarvester;
