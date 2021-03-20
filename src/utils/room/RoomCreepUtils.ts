import { List } from "lodash";
import { NO_FULL_SCAN_DONE } from "../ConstantUtils";
import { Logger } from "../Logger";

/**
 * @author kevin desmay
 * @description Utility class to scan hostile Creep from a room
 * @version 1.0
 */
export class RoomCreepUtils {
  /**
   * @description Scan a room to update the memmory of the room
   * Delete creep if they are not existing more or add/update it.
   *
   * @param scannedRoom Room who are scanned
   * @returns Execution code :
   *  - OK (0) : Scan execution is good
   *  - NO_FULL_SCAN_DONE (-1004) : Scan execution is not complete, some element disturb the scan. Scan is part-executued
   */
  public static scanHostile(scannedRoom: Room): number {
    Logger.info("Scan Hostile creeps : " + scannedRoom.name);
    let AnalyseCPUStart = Game.cpu.getUsed();
    let statut: number = OK;
    // Control existance of Creeps
    // Does it already exist ?
    _.forEach(scannedRoom.memory.creeps, (creep: HostileCreepOptions, id?: string) => {
      // look if the room is available
      statut = this.verify(scannedRoom, creep, id);
    });

    // Scan room's creeps and add or update them in memory
    let hostilesCreepsInScannedRoom = scannedRoom.find(FIND_HOSTILE_CREEPS);
    this.saveOrUpdateAll(scannedRoom, hostilesCreepsInScannedRoom);

    let AnalyseCPUEnd = Game.cpu.getUsed();
    Logger.debug(scannedRoom.name + "Scan Creep execution use : " + (AnalyseCPUEnd - AnalyseCPUStart));
    return statut;
  }

  /**
   * @description Check if a creep exist in a scannedRoom memory. If not, delete it.
   * @param scannedRoom Room who are scanned
   * @param creep Source to verify
   * @param id Id of the creep to verify
   * @returns Execution code :
   * - OK (0) : Scan execution is good
   * - NO_FULL_SCAN_DONE (-1004) : Scan execution is not complete, some element disturb the scan. Scan is part-executed
   */
  private static verify(scannedRoom: Room, creep: HostileCreepOptions, id: string | undefined): number {
    let roomAvailable: Room = Game.rooms[creep.roomName];
    if (roomAvailable) {
      if (id && !Game.getObjectById(id)) {
        Logger.debug(scannedRoom.name + " : verify Creep, delete : " + id);
        delete scannedRoom.memory.creeps[id];
      } else {
        // Object exist, do nothing
      }
    } else {
      // do nothing, just wait next scan
      Logger.warning("Can't execute full scan on room " + scannedRoom.name);
      return NO_FULL_SCAN_DONE;
    }
    return OK;
  }

  /**
   * @description Save or update the différent entity who are a hostile creep. It's meen, creep who are not mine
   * @param scannedRoom Room who are scanned
   * @param hostilesCreeps Hostile creeps find to add or update in the ‘scannedRoom‘
   */
  private static saveOrUpdateAll(scannedRoom: Room, hostilesCreeps: List<Creep>) {
    _.forEach(hostilesCreeps, (creep) => {
      this.saveOrUpdate(scannedRoom, creep);
    });
  }

  /**
   * @description Save or update a source in a scanned room
   * @param scannedRoom Room who are scanned
   * @param source Source to add or update
   * @returns Execution code
   */
  private static saveOrUpdate(scannedRoom: Room, hostileCreep: Creep) {
    // Check if already in memory
    let data = _.get(scannedRoom.memory["creeps"], hostileCreep.id, undefined);

    // Add hostile creep
    // NOTE : Cette méthode gère la sauvegarde de l'entité SourceOption
    if (data === undefined) {
      _.set(scannedRoom.memory, ["creeps", hostileCreep.id], {
        id: hostileCreep.id,
        roomName: hostileCreep.room!.name,
        effect: hostileCreep.effects,
        body: hostileCreep.body,
        hits: hostileCreep.hits,
        hitsMax: hostileCreep.hitsMax,
        owner: hostileCreep.owner.username
      } as HostileCreepOptions);
    }
    // Update hostile creep
    else {
      // update
      _.set(scannedRoom.memory["creeps"], hostileCreep.id, {
        id: hostileCreep.id,
        roomName: hostileCreep.room!.name,
        effect: hostileCreep.effects,
        body: hostileCreep.body,
        hits: hostileCreep.hits,
        hitsMax: hostileCreep.hitsMax,
        owner: hostileCreep.owner.username
      } as HostileCreepOptions);
    }
  }
}
