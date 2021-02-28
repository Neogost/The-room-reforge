import { Logger } from "../Logger";
import { NO_FULL_SCAN_DONE, NO_FULL_SCAN_DONE_LINKED } from "../ConstantUtils";
import { List } from "lodash";

/**
 * @author kevin desmay
 * @description Utility class to scan resource from a room. This utility analyse objet in a room with the following type :
 * - Source
 * - Mineral
 * - Deposit
 *
 * @version 1.0
 */
export class RoomSourceUtils {
  /**
   * @description Scan a room and his linkedroom to update the memmory of it.
   * Delete sources if they are not existing more or add/update it.
   *
   * @param scannedRoom Room who are scanned
   * @returns Execution code statut :
   *  - OK (0) : Scan execution is good
   *  - NO_FULL_SCAN_DONE (-1004) : Scan execution is not complete, some element disturb the scan. Scan is part-executued
   *  - NO_FULL_SCAN_DONE_LINKED (-1008) : Scan execution is not complete on a linked room, some element disturb the scan. Scan is part-executued
   */
  public static scan(scannedRoom: Room): number {
    Logger.info("Scan Sources : " + scannedRoom.name);
    let statut: number = OK;
    // Control existance of the source
    // Does it already exist ?
    _.forEach(scannedRoom.memory.sources, (source: SourcesOptions, id?: string) => {
      // look if the room is available
      statut = this.verify(scannedRoom, source, id);
    });

    // Scan room's sources/minerals/deposits and add or update them in memory
    let sourcesInScannedRoom = scannedRoom.find(FIND_SOURCES);
    let mineralsInScannedRoom = scannedRoom.find(FIND_MINERALS);
    let depositInScannedRoom = scannedRoom.find(FIND_DEPOSITS);
    this.saveOrUpdateAllResources(scannedRoom, sourcesInScannedRoom, mineralsInScannedRoom, depositInScannedRoom);

    // Scan linked room's source and add it in the scannedRoom memory.
    _.forEach(scannedRoom.memory.linked, (roomLinked: LinkedRoomOptions, linkedRoomName?: string) => {
      // get the room from the game
      let linkedRoom: Room | null = null;
      if (linkedRoomName) {
        linkedRoom = Game.rooms[linkedRoomName];
      }
      // TODO : Doit pouvoir etre utilisé de facon récursive
      // If room is available
      if (linkedRoom) {
        // Scan room's sources/minerals/deposits and add it in memory
        let sourcesInLinkedRoom: List<Source> = linkedRoom.find(FIND_SOURCES);
        let mineralsInLinkedRoom: List<Mineral> = linkedRoom.find(FIND_MINERALS);
        let depositInLinkedRoom: List<Deposit> = linkedRoom.find(FIND_DEPOSITS);
        this.saveOrUpdateAllResources(scannedRoom, sourcesInLinkedRoom, mineralsInLinkedRoom, depositInLinkedRoom);
      } else {
        statut = NO_FULL_SCAN_DONE_LINKED;
        Logger.warning(scannedRoom.name + " : Cannot scan linked room : " + linkedRoomName);
      }
    });
    return statut;
  }

  /**
   * @description Check if a source exist in a scannedRoom memory. If not, delete it.
   * @param scannedRoom Room who are scanned
   * @param source Source to verify
   * @param id Id of the source to verify
   * @returns Execution code :
   * - OK (0) : Scan execution is good
   * - NO_FULL_SCAN_DONe (-1004) : Scan execution is not complete, some element disturb the scan. Scan is part-executed
   */
  private static verify(scannedRoom: Room, source: SourcesOptions, id: string | undefined): number {
    let roomAvailable: Room = Game.rooms[source.roomName];
    if (roomAvailable) {
      Logger.info("room available : " + id);
      if (id && !Game.getObjectById(id)) {
        Logger.debug(scannedRoom.name + " : verifySources, delete : " + id);
        delete scannedRoom.memory.sources[id];
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
   * @description Save or update a source in a scanned room
   * @param scannedRoom Room who are scanned
   * @param source Source to add or update
   * @returns Execution code
   */
  private static saveOrUpdate(scannedRoom: Room, source: Source | Mineral | Deposit, type: string) {
    // Check if already in memory
    let data = _.get(scannedRoom.memory["sources"], source.id, undefined);

    // Add Source
    // NOTE : Cette méthode gère la sauvegarde de l'entité SourceOption
    if (data === undefined) {
      _.set(scannedRoom.memory, ["sources", source.id], {
        roomName: source.room!.name,
        type: type
      } as SourcesOptions);
    }
    // Update source
    else {
      // save other properties
      let lastSpawn = scannedRoom.memory["sources"][source.id as any].lastSpawn;
      // update
      _.set(scannedRoom.memory["sources"], source.id, {
        roomName: source.room!.name,
        type: type,
        lastSpawn: lastSpawn
      } as SourcesOptions);
    }
  }

  /**
   * @description Save or update the différent entity who are a "source". It's meen : ‘Source‘, ‘Mineral‘ and ‘Deposit‘
   * @param scannedRoom Room who are scanned
   * @param sources Sources find to add or update in the ‘scannedRoom‘
   * @param minerals Minerals find to add or update in the ‘scannedRoom‘
   * @param deposits Deposits find to add or upate in the ‘scannedRoom‘
   */
  private static saveOrUpdateAllResources(
    scannedRoom: Room,
    sources: List<Source>,
    minerals: List<Mineral>,
    deposits: List<Deposit>
  ) {
    if (minerals) {
      _.forEach(minerals, (mineral) => {
        this.saveOrUpdate(scannedRoom, mineral, "mineral");
      });
    }
    if (sources) {
      _.forEach(sources, (source) => {
        this.saveOrUpdate(scannedRoom, source, "source");
      });
    }
    if (deposits) {
      _.forEach(deposits, (deposit) => {
        this.saveOrUpdate(scannedRoom, deposit, "deposit");
      });
    }
  }
}
