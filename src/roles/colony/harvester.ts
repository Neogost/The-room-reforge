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
    if (canHarverst) {
      // Harvest pre selected source
      statutOfExecution = Tasks.harvest(creep);
      if (CreepUtils.canDoSomething(statutOfExecution)) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }
    }
    // drop mode
    else {
      // Find container
      statutOfExecution = Tasks.transfertToContainer(creep);
      if (CreepUtils.canDoSomething(statutOfExecution)) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }
      // than, go to STORAGE
      statutOfExecution = Tasks.transfertToStorage(creep, roomHome);
      if (CreepUtils.canDoSomething(statutOfExecution)) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }

      // than do to TRANSFERT somthing
      statutOfExecution = Tasks.transfertToEssentialStructure(creep, roomHome);
      if (CreepUtils.canDoSomething(statutOfExecution)) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }

      // than do to BUILD somthing
      statutOfExecution = Tasks.buildSomething(creep, roomHome);
      if (CreepUtils.canDoSomething(statutOfExecution)) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }

      // no urgence, can build something in the room
      statutOfExecution = Tasks.upgradeController(creep, roomHome.controller);
      if (CreepUtils.canDoSomething(statutOfExecution)) {
        tryToSwitchMode(creep);
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return OK;
      }
    }
    tryToSwitchMode(creep);
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
