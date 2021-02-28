import { Logger } from "../Logger";
import { NO_FULL_SCAN_DONE } from "../ConstantUtils";

/**
 * @author kevin desmay
 * @description Utility class to scan Creep from a room
 * @version 1.0
 */
export class RoomCreepUtils {
  /**
   * @description Scan a room and his linkedroom to update the memmory of the room
   * Delete creep if they are not existing more or add/update it.
   *
   * @param scannedRoom Room who are scanned
   * @returns Execution code :
   *  - OK (0) : Scan execution is good
   *  - NO_FULL_SCAN_DONE (-1004) : Scan execution is not complete, some element disturb the scan. Scan is part-executued
   *  - NO_FULL_SCAN_DONE_LINKED (-1008) : Scan execution is not complete on a linked room, some element disturb the scan. Scan is part-executued
   */
  public static scanHostile(scannedRoom: Room): number {
    // Vérifie si les donnes en mémoire existe toujours dans cette salle

    // Recherche des unitée ne m'appartemant pas

    //

    return -1;
  }

  /**
   * Delete information in a room
   * @param room Room who are scanned
   */
  public static delete(room: Room) {
    delete room.memory.creeps;
  }
}
