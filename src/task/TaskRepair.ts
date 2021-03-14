import { Repairman } from "../roles/colony/repairman";
import { ERR_NOTHING_TO_DO } from "../utils/ConstantUtils";
import { CreepUtils } from "../utils/CreepUtils";
import { Traveler } from "../utils/Traveler";
/**
 * @author Neogost
 * Perform the action to harvest a resource.
 * @version 1.0
 */
export class TaskRepair {
  public static doTask(creep: Repairman, room: Room): number {
    return this.repairSomething(creep, room);
  }

  private static repairSomething(creep: Repairman, room: Room): number {
    // If the creep haven't target, find it
    if (!creep.memory.repairTargetId) {
      let structuresToRepair = _.filter(room.memory.structures, function (s) {
        return s.needRepair;
      });
      // Get the first structure to repair
      let structure = structuresToRepair[0];
      if (!structure) {
        return ERR_NOTHING_TO_DO;
      }

      creep.memory.repairTargetId = structure.id;
      creep.memory._repairTargetPos = structure.pos;
      creep.memory._repairTargetName = structure.roomName;
    }

    let target = Game.getObjectById(creep.memory.repairTargetId);

    // If target do not exist, may be the creep can't see the room. Than, if the creep is not in the workstation
    // move to it.
    if (!target && CreepUtils.inTheRightRoom(creep, creep.memory._repairTargetName) && creep.memory._repairTargetPos) {
      let pos = new RoomPosition(
        creep.memory._repairTargetPos.x,
        creep.memory._repairTargetPos.y,
        creep.memory._repairTargetPos.roomName
      );
      return Traveler.travelTo(creep, pos);
    }

    // if target does't exist, reset target.
    if (!target || target.hits === target.hitsMax) {
      if (target && target.hits === target.hitsMax) {
        room.memory.structures[target.id].needRepair = false;
      }
      creep.memory.repairTargetId = undefined;
      creep.memory._repairTargetPos = undefined;
      creep.memory._repairTargetName = undefined;
      return ERR_INVALID_TARGET;
    }

    if (creep.pos.inRangeTo(target.pos, 3)) {
      return creep.repair(target);
    } else {
      return Traveler.travelTo(creep, target.pos);
    }
  }
}
