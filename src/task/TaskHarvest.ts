import { ERR_NO_TARGET, ERR_NO_AVAILABLE_CAPACITY, TRAVELER_MOVE } from "../utils/ConstantUtils";
import { CreepUtils } from "../utils/CreepUtils";
import { Traveler } from "../utils/Traveler";

/**
 * @author Neogost
 * Perform the action to harvest a resource.
 * @version 1.0
 */
export class TaskHarvest {
  /**
   * Harverst a target of type `SOURCE`, `MINERAL` or `DEPOSIT`. Verify if the `creep` can do it and do it.
   * @param creep creep who execute the task
   * @param target target of the task.
   * @param targetRoomName target room name
   * @returns statut of the task :
   *    - -1000 : Target invalid
   *    - -12 : No body part of `WORK`
   */
  public static doTask(creep: Creep, targetId: string): number {
    // Can't do anything without body part `WORK`
    if (!CreepUtils.canWork(creep)) {
      return ERR_NO_BODYPART;
    }
    // Can't hold anything
    if (!CreepUtils.canStore(creep)) {
      return ERR_NO_AVAILABLE_CAPACITY;
    }

    let target: Source | Deposit | Mineral | null = Game.getObjectById(targetId);
    // No target find in the room
    if (!target) {
      return ERR_NO_TARGET;
    }

    if (target.pos.isNearTo(creep.pos)) {
      return creep.harvest(target);
    } else {
      return Traveler.travelTo(creep, target.pos);
    }
  }
}
