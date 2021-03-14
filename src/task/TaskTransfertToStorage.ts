import { Carrier } from "../roles/colony/carrier";
import { Colonist } from "../roles/colony/colonist";
import { Harvester } from "../roles/colony/harvester";
import { ERR_NO_TARGET } from "../utils/ConstantUtils";
import { Traveler } from "../utils/Traveler";

/**
 * @author Neogost
 * Perform the action to harvest a resource.
 * @version 1.0
 */
export class TaskTransfertToStorage {
  public static doTask(creep: Colonist | Harvester | Carrier, room: Room): number {
    return this.transferToStorage(creep, room);
  }
  static transferToStorage(creep: any, room: Room): number {
    let storage = room.storage;
    if (!storage) {
      return ERR_NO_TARGET;
    }

    if (creep.pos.isNearTo(storage.pos)) {
      return creep.transfer(storage, RESOURCE_ENERGY);
    } else {
      return Traveler.travelTo(creep, storage.pos);
    }
  }
}
