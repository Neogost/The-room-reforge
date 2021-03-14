import { List } from "lodash";

/**
 * @author neoogst
 * Help to use the entity `RoomPosition`
 *
 * @version 1.0
 */
export class RoomPositionUtils {
  /**
   * @description List all RoomPosition in front of a roomPosition.
   * @param pos Room position who are scanned
   * @returns list of `RoomPosition` in front of the `roomPosition` in parameter
   */
  public static getNearByPositions(pos: RoomPosition): Array<RoomPosition> {
    let positions = [];

    let startX = pos.x - 1 || 1;
    let startY = pos.y - 1 || 1;

    for (let x: number = startX; x <= pos.x + 1 && x < 49; x++) {
      for (let y: number = startY; y <= pos.y + 1 && y < 49; y++) {
        if (x !== pos.x || y !== pos.y) {
          positions.push(new RoomPosition(x, y, pos.roomName));
        }
      }
    }

    return positions;
  }
  /**
   * @description Analyse RoomPosition in front of a roomPosition and identify if a creep can walk on.
   * @param roomPosition Room position who are scanned
   * @returns List of `RoomPosition` who are walkable for a creep
   */
  public static getOpenPositions(roomPosition: RoomPosition): Array<RoomPosition> {
    // Listes des cellules proches
    let nearbyPositions = this.getNearByPositions(roomPosition);

    // Récupération du typede terrain
    let terrain = Game.map.getRoomTerrain(roomPosition.roomName);

    // On récupère que les cellules ou l'on peu marcher dessus
    let walkablePositions: List<RoomPosition> = _.filter(nearbyPositions, function (pos) {
      return terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL;
    });

    // On retire les cellules utilisé par des creeps
    let freePositions = _.filter(walkablePositions, function (pos) {
      return !pos.lookFor(LOOK_CREEPS).length;
    });
    return freePositions;
  }
}
