import { Builder } from "../roles/colony/builider";
import { Manager } from "../roles/colony/manager";
import { Repairman } from "../roles/colony/repairman";
import { Upgrader } from "../roles/colony/upgrader";
import { ERR_NO_TARGET } from "../utils/ConstantUtils";
import { Traveler } from "../utils/Traveler";
/**
 * @author Neogost
 * Perform the action to harvest a resource.
 * @version 1.0
 */
export class TaskRefillToStorage {
  public static doTask(creep: Repairman | Builder | Upgrader | Manager, room: Room): number {
    return this.refill(creep, room);
  }

  private static refill(creep: Repairman | Builder | Upgrader | Manager, room: Room): number {
    // reload in storage
    if (creep.memory.storageId && creep.memory._storagePos) {
      let storage = room.storage;
      if (storage && storage.store[RESOURCE_ENERGY] != 0) {
        let pos = new RoomPosition(
          creep.memory._storagePos.x,
          creep.memory._storagePos.y,
          creep.memory._storagePos.roomName
        );
        if (creep.pos.isNearTo(pos)) {
          return creep.withdraw(storage, RESOURCE_ENERGY);
        } else {
          return Traveler.travelTo(creep, pos);
        }
      }
    }

    return ERR_NO_TARGET;
  }
}
