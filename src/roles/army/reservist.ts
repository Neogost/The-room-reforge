import { ERR_NO_TARGET } from "../../utils/ConstantUtils";
import { CreepUtils } from "../../utils/CreepUtils";
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
export interface Reservist extends Creep {
  memory: ReservistMemory;
}

export class ReservistMemory implements CreepMemory {
  role: string = "reservist";
  homeRoomName: string;

  /** Creep's target to harvest energy */
  targetController: Id<StructureController> | undefined;
  /** Creep's target's to harvest position. Where is the task to do */
  _targetControllerPos: RoomPosition | undefined;
  /** Creep's target's to harvest position. Where is the task to do */
  _targetControllerRoom: string | undefined;

  _trav: any;
  _travel: any;

  /**
   * Initialize a Builder.
   * @param currentRoom Room where the creep is actualy
   * @param storage Storage who are a reference to take energy for this creep
   */
  constructor(currentRoom: Room, controller: StructureController) {
    this.homeRoomName = currentRoom.name;
    this.targetController = controller.id;
    this._targetControllerPos = controller.pos;
    this._targetControllerRoom = controller.room.name;
  }
}

const roleReservist = {
  run(creep: Reservist) {
    let analyseCPUStart = Game.cpu.getUsed();
    if (creep.memory._targetControllerPos) {
      let pos = new RoomPosition(
        creep.memory._targetControllerPos.x,
        creep.memory._targetControllerPos.y,
        creep.memory._targetControllerPos.roomName
      );
      if (creep.pos.isNearTo(pos)) {
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);

        return creep.reserveController(creep.room!.controller!);
      } else {
        CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
        return Traveler.travelTo(creep, pos);
      }
    } else {
      CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
      return ERR_NO_TARGET;
    }
  }
};

export default roleReservist;
