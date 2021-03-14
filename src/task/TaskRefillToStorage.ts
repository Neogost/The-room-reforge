import { Repairman } from "../roles/colony/repairman";
import { Harvester } from "../roles/colony/harvester";
import { CreepUtils } from "../utils/CreepUtils";
import { Traveler } from "../utils/Traveler";
import { ERR_NOTHING_TO_DO, ERR_NO_TARGET } from "../utils/ConstantUtils";
import { Builder } from "../roles/colony/builider";
import { Carrier } from "../roles/colony/carrier";
import { Upgrader } from "../roles/colony/upgrader";
import { Manager } from "../roles/colony/manager";
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
