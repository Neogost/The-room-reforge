import { Logger } from "../Logger";
import { NO_FULL_SCAN_DONE, NO_FULL_SCAN_DONE_LINKED } from "../ConstantUtils";
import { List } from "lodash";

/**
 * @author kevin desmay
 * @description Utility class to scan construction site from a room.
 * @version 1.0
 */
export class RoomConstructionSiteUtils {
  /**
   * @description Scan a room and his linkedroom to update the memmory of it.
   * Delete construction site if they are not existing more or add/update it.
   *
   * @param scannedRoom Room who are scanned
   * @returns Execution code :
   *  - OK (0) : Scan execution is good
   *  - NO_FULL_SCAN_DONE (-1004) : Scan execution is not complete, some element disturb the scan. Scan is part-executued
   *  - NO_FULL_SCAN_DONE_LINKED (-1008) : Scan execution is not complete on a linked room, some element disturb the scan. Scan is part-executued
   */
  public static scan(scannedRoom: Room): number {
    Logger.info("Scan Constructions site room : " + scannedRoom.name);
    let AnalyseCPUStart = Game.cpu.getUsed();
    let statut: number = OK;

    // Control existance of the structure
    // Does it already exist ?
    _.forEach(scannedRoom.memory.constructionsSites, (structure: ConstructionSiteOptions, id?: string) => {
      statut = this.verify(scannedRoom, structure, id);
    });
    // Scan room's construction site and add or update them in memory
    let csInScannedRoom: List<ConstructionSite> = scannedRoom.find(FIND_CONSTRUCTION_SITES);
    this.saveUpdateAllConstructionSites(scannedRoom, csInScannedRoom);

    // Scan linked room's
    // TODO : Doit pouvoir etre utilisé de facon récursive
    _.forEach(scannedRoom.memory.linked, (roomLinked: LinkedRoomOptions, linkedRoomName?: string) => {
      let linkedRoom: Room | null = null;
      if (linkedRoomName) {
        linkedRoom = Game.rooms[linkedRoomName];
      }
      // If room is available
      if (linkedRoom) {
        // Scan structure in the linked room
        let csInLinkedRoom: List<ConstructionSite> = linkedRoom.find(FIND_CONSTRUCTION_SITES);
        this.saveUpdateAllConstructionSites(scannedRoom, csInLinkedRoom);
      } else {
        statut = NO_FULL_SCAN_DONE_LINKED;
        Logger.warning(scannedRoom.name + " : Cannot scan linked room : " + linkedRoomName);
      }
    });
    let AnalyseCPUEnd = Game.cpu.getUsed();
    Logger.debug(scannedRoom.name + "Scan Construction Site execution use : " + (AnalyseCPUEnd - AnalyseCPUStart));
    return statut;
  }

  /**
   * @description Save or update the different ‘ConstructionSite‘ in a room
   * @param scannedRoom Room who are scanned
   * @param csList Construction site list find to add or update in the ‘scannedRoom‘
   */
  private static saveUpdateAllConstructionSites(scannedRoom: Room, csList: List<ConstructionSite>) {
    _.forEach(csList, (cs: ConstructionSite) => {
      this.saveOrUpdate(scannedRoom, cs);
    });
  }
  /**
   * @description Save or update a constructions site in a scanned room
   * @param scannedRoom Room who are scanned
   * @param cs Construction site to add or update
   */
  private static saveOrUpdate(scannedRoom: Room, cs: ConstructionSite) {
    // Check if already exit in memory
    let data = _.get(scannedRoom.memory["constructionsSites"], cs.id, undefined);

    // NOTE : Cette méthode gère la sauvegarde de l'entité ConstructionSiteOption
    // Add in memory
    if (data === undefined) {
      _.set(scannedRoom.memory, ["constructionsSites", cs.id], {
        id: cs.id,
        roomName: cs.room?.name,
        type: cs.structureType,
        owner: cs.owner.username,
        progress: cs.progress,
        progressTotal: cs.progressTotal,
        pos: cs.pos
      } as ConstructionSiteOptions);
    }
    // Update memory
    else {
      _.set(scannedRoom.memory["constructionsSites"], cs.id, {
        id: cs.id,
        roomName: cs.room?.name,
        owner: cs.owner.username,
        type: cs.structureType,
        progress: cs.progress,
        progressTotal: cs.progressTotal,
        pos: cs.pos
      } as ConstructionSiteOptions);
    }
  }

  /**
   * @description Check if a construction site exist in a ‘scannedRoom‘. If not, delete it form memory
   * @param scannedRoom Room who are scanned
   * @param cs construction site to verify
   * @param id Id of the construction site to verify
   * @returns Execution code :
   * - OK (0) : Scan execution is good
   * - NO_FULL_SCAN_DONE (-1004) : Scan execution is not complete, some element disturb the scan. Scan is part-executed
   */
  private static verify(scannedRoom: Room, cs: ConstructionSiteOptions, id: string | undefined): number {
    let roomAvailable: Room = Game.rooms[cs.roomName];
    if (roomAvailable) {
      if (id && !Game.getObjectById(id)) {
        Logger.debug(scannedRoom.name + " : verify Construction Site, delete : " + id);
        delete scannedRoom.memory.constructionsSites[id];
      } else {
        // Object exist, do nothing
      }
    } else {
      Logger.warning("Can't execute full scan on room : " + scannedRoom.name);
      return NO_FULL_SCAN_DONE;
    }
    return OK;
  }

  /**
   * @description Delete a construction site in the room memory.
   *
   * @param room Room where the constructions site will be delete
   * @param id Id of the construction site to delete in memory
   * @returns statut of execution
   */
  public static deleteConstructionSite(room: Room, id: Id<ConstructionSite>): boolean {
    if (room.memory.constructionsSites[id]) {
      delete room.memory.constructionsSites[id];
      return true;
    }
    return false;
  }
}
