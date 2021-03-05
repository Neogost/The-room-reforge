import { Logger } from "../Logger";
import { NO_FULL_SCAN_DONE, NO_FULL_SCAN_DONE_LINKED } from "../ConstantUtils";
import { List } from "lodash";

/**
 * @author kevin desmay
 * @description Utility class to scan structure from a room.
 * @version 1.0
 */
export class RoomStructureUtils {
  /**
   * @description Scan a room and his linkedroom to update the memmory of it.
   * Delete structure if they are not existing more or add/update it.
   *
   * @param scannedRoom Room who are scanned
   * @returns Execution code :
   *  - OK (0) : Scan execution is good
   *  - NO_FULL_SCAN_DONE (-1004) : Scan execution is not complete, some element disturb the scan. Scan is part-executued
   *  - NO_FULL_SCAN_DONE_LINKED (-1008) : Scan execution is not complete on a linked room, some element disturb the scan. Scan is part-executued
   */
  public static scan(scannedRoom: Room): number {
    Logger.info("Scan Structure room : " + scannedRoom.name);
    let AnalyseCPUStart = Game.cpu.getUsed();
    let statut: number = OK;

    // Control existance of the structure
    // Does it already exist ?
    _.forEach(scannedRoom.memory.structures, (structure: StructureOptions, id?: string) => {
      statut = this.verify(scannedRoom, structure, id);
    });

    // Scan room's structure and add or update them in memory
    let structureInScannedRoom: List<Structure> = scannedRoom.find(FIND_STRUCTURES);
    this.saveUpdateAllStructures(scannedRoom, structureInScannedRoom);

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
        let structureInLinkedRoom: List<Structure> = linkedRoom.find(FIND_STRUCTURES);
        this.saveUpdateAllStructures(linkedRoom, structureInLinkedRoom);
      } else {
        statut = NO_FULL_SCAN_DONE_LINKED;
        Logger.warning(scannedRoom.name + " : Cannot scan linked room : " + linkedRoomName);
      }
    });

    let AnalyseCPUEnd = Game.cpu.getUsed();
    Logger.debug(scannedRoom.name + "Scan Structure : " + (AnalyseCPUEnd - AnalyseCPUStart));
    return statut;
  }

  /**
   * @description Save or update the different ‘Structure‘ in a room
   * @param scannedRoom Room who are scanned
   * @param structures Structure find to add or update in the ‘scannedRoom‘
   */
  private static saveUpdateAllStructures(scannedRoom: Room, structures: List<Structure>) {
    _.forEach(structures, (structure: Structure) => {
      this.saveOrUpdate(scannedRoom, structure);
    });
  }

  /**
   * @description Save or update a structure in a scanned room
   * @param scannedRoom Room who are scanned
   * @param structure Structure to add or update
   */
  private static saveOrUpdate(scannedRoom: Room, structure: Structure<StructureConstant>) {
    // Check if already exit in memory
    let data = _.get(scannedRoom.memory["structures"], structure.id, undefined);

    // Structure need to be repaired ?
    let needToBeRepair = structure.hits <= structure.hitsMax * Memory.settings.repairIndicator;
    // NOTE : Cette méthode gère la sauvegarde de l'entité StructureOption
    // FIXME : Récupération de l'owner d'une structure
    // Add in memory
    if (data === undefined) {
      _.set(scannedRoom.memory, ["structures", structure.id], {
        roomName: structure.room.name,
        type: structure.structureType,
        owner: "",
        needRepair: needToBeRepair
      } as StructureOptions);
    }
    // Update memory
    else {
      _.set(scannedRoom.memory["structures"], structure.id, {
        roomName: structure.room.name,
        owner: "",
        type: structure.structureType,
        needRepair: needToBeRepair,
        lastSpawn: scannedRoom.memory["structures"][structure.id].lastSpawn
      } as StructureOptions);
    }
  }

  /**
   * @description Check if a strcture exist in a ‘scannedRoom‘. If not, delete it form memory
   * @param scannedRoom Room who are scanned
   * @param structure Strucutre to verify
   * @param id Id of the structure to verify
   * @returns Execution code :
   * - OK (0) : Scan execution is good
   * - NO_FULL_SCAN_DONE (-1004) : Scan execution is not complete, some element disturb the scan. Scan is part-executed
   */
  private static verify(scannedRoom: Room, structure: StructureOptions, id: string | undefined): number {
    let roomAvailable: Room = Game.rooms[structure.roomName];
    if (roomAvailable) {
      if (id && !Game.getObjectById(id)) {
        Logger.debug(scannedRoom.name + " : verify Structure, delete : " + id);
        delete scannedRoom.memory.structures[id];
      } else {
        // Object exist, do nothing
      }
    } else {
      Logger.warning("Can't execute full scan on room : " + scannedRoom.name);
      return NO_FULL_SCAN_DONE;
    }
    return OK;
  }
}
