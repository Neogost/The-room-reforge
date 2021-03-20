import { Harvester } from "../roles/colony/harvester";
import { ERR_NOTHING_TO_DO } from "../utils/ConstantUtils";
import { CreepUtils } from "../utils/CreepUtils";
import { Traveler } from "../utils/Traveler";

/**
 * @author Neogost
 * Perform the action to harvest a resource.
 * @version 1.0
 */
export class TaskHarvest {
  public static doTask(creep: Harvester): number {
    return this.buildSomething(creep);
  }
  private static buildSomething(creep: Harvester): number {
    let targetId = creep.memory.targetId;
    if (!targetId) {
      return ERR_NOTHING_TO_DO;
    }

    let target = Game.getObjectById(targetId);
    if (!target && !CreepUtils.inTheRightRoom(creep, creep.memory._targetRoom) && creep.memory._targetPos) {
      let pos = new RoomPosition(
        creep.memory._targetPos.x,
        creep.memory._targetPos.y,
        creep.memory._targetPos.roomName
      );
      return Traveler.travelTo(creep, pos);
    } else if (!target) {
      return ERR_NOTHING_TO_DO;
    }
    if (creep.pos.isNearTo(target.pos)) {
      return creep.harvest(target);
    } else {
      return Traveler.travelTo(creep, target.pos);
    }
  }
}
