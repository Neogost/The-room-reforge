import { Upgrader } from "../roles/colony/upgrader";
import { ERR_NO_TARGET } from "../utils/ConstantUtils";
import { Traveler } from "../utils/Traveler";

/**
 * @author Neogost
 * Perform the action to harvest a resource.
 * @version 1.0
 */
export class TaskRefillToLink {
  public static doTask(creep: Upgrader, room: Room): number {
    return this.refill(creep, room);
  }

  private static refill(creep: Upgrader, room: Room): number {
    // Check if there are a link available
    if (creep.memory.linkId) {
      let link = Game.getObjectById(creep.memory.linkId);
      // There is some energy in the link ?
      if (link && link.store[RESOURCE_ENERGY] != 0) {
        // try to use it
        if (creep.pos.isNearTo(link)) {
          return creep.withdraw(link, RESOURCE_ENERGY);
        } else {
          return Traveler.travelTo(creep, link.pos);
        }
      }
      return ERR_INVALID_TARGET;
    }
    return ERR_NO_TARGET;
  }
}
