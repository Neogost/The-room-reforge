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
export interface Reservist extends Creep {
  memory: ReservistMemory;
}

export class ReservistMemory implements CreepMemory {
  role: string = "reservist";
  homeRoomName: string;
  /** Where the creep have to go to work */
  workingStation: string;

  /** Creep's target to harvest energy */
  targetSourceId: Id<Source> | undefined;
  /** Creep's target's to harvest position. Where is the task to do */
  _targetSourcePos: RoomPosition | undefined;

  /** Target to do build something */
  targetBuildId: Id<ConstructionSite> | undefined;
  /** Target's pos to do buildf energy. Where is the task to do */
  _targetBuildPos: RoomPosition | undefined;

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

const roleReservist = {
  run(creep: Reservist) {}
};

export default roleReservist;
