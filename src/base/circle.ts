import { Logger } from "../utils/Logger";
/**
 * Class who execute the task for build a circle base.
 * Each level of the RCL unlock element
 */
export class BaseCircle {
  /** Center of the base */
  center: RoomPosition;
  /** Room where the base is build */
  room: Room;

  level1: Map<String, RoomPosition> = new Map();

  level2: Map<String, RoomPosition> = new Map();
  level3: Map<String, RoomPosition> = new Map();
  level4: Map<String, RoomPosition> = new Map();
  level5: Map<String, RoomPosition> = new Map();
  level6: Map<String, RoomPosition> = new Map();
  level7: Map<String, RoomPosition> = new Map();
  level8: Map<String, RoomPosition> = new Map();

  constructor(center: RoomPosition, room: Room) {
    this.center = center;
    this.room = room;
    this.initMap();
  }

  private initMap() {
    this.level1.set(STRUCTURE_SPAWN + ".1", new RoomPosition(this.center.x - 1, this.center.y + 1, this.room.name));

    this.level2.set(STRUCTURE_EXTENSION + ".1", new RoomPosition(this.center.x + 1, this.center.y + 3, this.room.name));
    this.level2.set(STRUCTURE_EXTENSION + ".2", new RoomPosition(this.center.x + 2, this.center.y + 2, this.room.name));
    this.level2.set(STRUCTURE_EXTENSION + ".3", new RoomPosition(this.center.x + 2, this.center.y + 3, this.room.name));
    this.level2.set(STRUCTURE_EXTENSION + ".4", new RoomPosition(this.center.x + 2, this.center.y + 4, this.room.name));
    this.level2.set(STRUCTURE_EXTENSION + ".5", new RoomPosition(this.center.x + 3, this.center.y + 4, this.room.name));
    this.level2.set(STRUCTURE_ROAD + ".1", new RoomPosition(this.center.x - 2, this.center.y + 1, this.room.name));
    this.level2.set(STRUCTURE_ROAD + ".2", new RoomPosition(this.center.x - 1, this.center.y + 2, this.room.name));
    this.level2.set(STRUCTURE_ROAD + ".3", new RoomPosition(this.center.x, this.center.y + 3, this.room.name));
    this.level2.set(STRUCTURE_ROAD + ".4", new RoomPosition(this.center.x + 1, this.center.y + 2, this.room.name));
    this.level2.set(STRUCTURE_ROAD + ".5", new RoomPosition(this.center.x + 1, this.center.y + 4, this.room.name));
    this.level2.set(STRUCTURE_ROAD + ".6", new RoomPosition(this.center.x + 2, this.center.y + 1, this.room.name));
    this.level2.set(STRUCTURE_ROAD + ".7", new RoomPosition(this.center.x + 2, this.center.y + 5, this.room.name));
    this.level2.set(STRUCTURE_ROAD + ".8", new RoomPosition(this.center.x + 3, this.center.y, this.room.name));
    this.level2.set(STRUCTURE_ROAD + ".9", new RoomPosition(this.center.x + 3, this.center.y + 5, this.room.name));
    this.level2.set(STRUCTURE_ROAD + ".10", new RoomPosition(this.center.x + 4, this.center.y + 4, this.room.name));

    this.level3.set(STRUCTURE_EXTENSION + ".1", new RoomPosition(this.center.x + 3, this.center.y + 1, this.room.name));
    this.level3.set(STRUCTURE_EXTENSION + ".2", new RoomPosition(this.center.x + 3, this.center.y + 2, this.room.name));
    this.level3.set(STRUCTURE_EXTENSION + ".3", new RoomPosition(this.center.x + 3, this.center.y + 3, this.room.name));
    this.level3.set(STRUCTURE_EXTENSION + ".4", new RoomPosition(this.center.x + 4, this.center.y + 2, this.room.name));
    this.level3.set(STRUCTURE_EXTENSION + ".5", new RoomPosition(this.center.x + 4, this.center.y + 3, this.room.name));
    this.level3.set(STRUCTURE_ROAD + ".1", new RoomPosition(this.center.x + 5, this.center.y + 3, this.room.name));
    this.level3.set(STRUCTURE_ROAD + ".2", new RoomPosition(this.center.x + 6, this.center.y + 2, this.room.name));
    this.level3.set(STRUCTURE_TOWER + ".1", new RoomPosition(this.center.x, this.center.y + 2, this.room.name));

    this.level4.set(STRUCTURE_STORAGE + ".1", new RoomPosition(this.center.x - 2, this.center.y, this.room.name));
    this.level4.set(STRUCTURE_EXTENSION + ".1", new RoomPosition(this.center.x + 4, this.center.y - 2, this.room.name));
    this.level4.set(STRUCTURE_EXTENSION + ".2", new RoomPosition(this.center.x + 4, this.center.y, this.room.name));
    this.level4.set(STRUCTURE_EXTENSION + ".3", new RoomPosition(this.center.x + 4, this.center.y + 1, this.room.name));
    this.level4.set(STRUCTURE_EXTENSION + ".4", new RoomPosition(this.center.x + 5, this.center.y, this.room.name));
    this.level4.set(STRUCTURE_EXTENSION + ".5", new RoomPosition(this.center.x + 5, this.center.y + 1, this.room.name));
    this.level4.set(STRUCTURE_EXTENSION + ".6", new RoomPosition(this.center.x + 5, this.center.y + 2, this.room.name));
    this.level4.set(STRUCTURE_EXTENSION + ".7", new RoomPosition(this.center.x + 5, this.center.y - 1, this.room.name));
    this.level4.set(STRUCTURE_EXTENSION + ".8", new RoomPosition(this.center.x + 3, this.center.y - 1, this.room.name));
    this.level4.set(STRUCTURE_EXTENSION + ".9", new RoomPosition(this.center.x + 3, this.center.y - 2, this.room.name));
    this.level4.set(
      STRUCTURE_EXTENSION + ".10",
      new RoomPosition(this.center.x + 2, this.center.y - 2, this.room.name)
    );
    this.level4.set(STRUCTURE_ROAD + ".1", new RoomPosition(this.center.x + 3, this.center.y, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".2", new RoomPosition(this.center.x + 6, this.center.y, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".3", new RoomPosition(this.center.x + 6, this.center.y + 1, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".4", new RoomPosition(this.center.x + 6, this.center.y - 1, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".5", new RoomPosition(this.center.x + 6, this.center.y - 2, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".6", new RoomPosition(this.center.x + 6, this.center.y - 3, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".7", new RoomPosition(this.center.x + 7, this.center.y - 4, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".8", new RoomPosition(this.center.x + 4, this.center.y - 1, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".9", new RoomPosition(this.center.x + 5, this.center.y - 2, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".10", new RoomPosition(this.center.x + 2, this.center.y - 1, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".11", new RoomPosition(this.center.x + 1, this.center.y - 2, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".12", new RoomPosition(this.center.x, this.center.y - 3, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".13", new RoomPosition(this.center.x - 1, this.center.y - 4, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".14", new RoomPosition(this.center.x - 2, this.center.y - 5, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".15", new RoomPosition(this.center.x - 3, this.center.y - 6, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".16", new RoomPosition(this.center.x - 4, this.center.y - 7, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".17", new RoomPosition(this.center.x - 2, this.center.y - 6, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".18", new RoomPosition(this.center.x - 1, this.center.y - 6, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".19", new RoomPosition(this.center.x, this.center.y - 6, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".20", new RoomPosition(this.center.x + 1, this.center.y - 6, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".21", new RoomPosition(this.center.x + 2, this.center.y - 6, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".22", new RoomPosition(this.center.x + 3, this.center.y - 5, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".23", new RoomPosition(this.center.x + 4, this.center.y - 4, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".24", new RoomPosition(this.center.x - 1, this.center.y - 2, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".25", new RoomPosition(this.center.x - 2, this.center.y - 1, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".26", new RoomPosition(this.center.x - 3, this.center.y, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".27", new RoomPosition(this.center.x - 4, this.center.y + 1, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".28", new RoomPosition(this.center.x - 5, this.center.y + 2, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".29", new RoomPosition(this.center.x - 6, this.center.y + 3, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".30", new RoomPosition(this.center.x - 7, this.center.y + 4, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".31", new RoomPosition(this.center.x - 6, this.center.y + 2, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".32", new RoomPosition(this.center.x - 6, this.center.y + 1, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".33", new RoomPosition(this.center.x - 6, this.center.y, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".34", new RoomPosition(this.center.x - 6, this.center.y - 1, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".35", new RoomPosition(this.center.x - 6, this.center.y - 2, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".36", new RoomPosition(this.center.x - 5, this.center.y - 3, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".37", new RoomPosition(this.center.x - 4, this.center.y - 4, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".38", new RoomPosition(this.center.x - 3, this.center.y - 5, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".39", new RoomPosition(this.center.x - 5, this.center.y + 3, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".40", new RoomPosition(this.center.x - 4, this.center.y + 4, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".41", new RoomPosition(this.center.x - 3, this.center.y + 5, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".42", new RoomPosition(this.center.x - 2, this.center.y + 6, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".43", new RoomPosition(this.center.x - 1, this.center.y + 6, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".44", new RoomPosition(this.center.x, this.center.y + 6, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".45", new RoomPosition(this.center.x + 1, this.center.y + 6, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".46", new RoomPosition(this.center.x + 2, this.center.y + 6, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".47", new RoomPosition(this.center.x + 3, this.center.y + 6, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".48", new RoomPosition(this.center.x + 5, this.center.y - 3, this.room.name));
    this.level4.set(STRUCTURE_ROAD + ".49", new RoomPosition(this.center.x + 4, this.center.y + 7, this.room.name));

    this.level5.set(STRUCTURE_TOWER + ".1", new RoomPosition(this.center.x, this.center.y + 2, this.room.name));
    this.level5.set(STRUCTURE_LINK + ".1", new RoomPosition(this.center.x, this.center.y + 2, this.room.name));
    this.level5.set(STRUCTURE_EXTENSION + ".1", new RoomPosition(this.center.x - 1, this.center.y - 1, this.room.name));
    this.level5.set(STRUCTURE_EXTENSION + ".2", new RoomPosition(this.center.x + 1, this.center.y - 5, this.room.name));
    this.level5.set(STRUCTURE_EXTENSION + ".3", new RoomPosition(this.center.x + 1, this.center.y - 4, this.room.name));
    this.level5.set(STRUCTURE_EXTENSION + ".4", new RoomPosition(this.center.x + 1, this.center.y - 3, this.room.name));
    this.level5.set(STRUCTURE_EXTENSION + ".5", new RoomPosition(this.center.x + 2, this.center.y - 5, this.room.name));
    this.level5.set(STRUCTURE_EXTENSION + ".6", new RoomPosition(this.center.x + 2, this.center.y - 4, this.room.name));
    this.level5.set(STRUCTURE_EXTENSION + ".7", new RoomPosition(this.center.x + 2, this.center.y - 3, this.room.name));
    this.level5.set(STRUCTURE_EXTENSION + ".8", new RoomPosition(this.center.x + 3, this.center.y - 4, this.room.name));
    this.level5.set(STRUCTURE_EXTENSION + ".9", new RoomPosition(this.center.x + 3, this.center.y - 3, this.room.name));
    this.level5.set(
      STRUCTURE_EXTENSION + ".10",
      new RoomPosition(this.center.x + 4, this.center.y - 3, this.room.name)
    );

    this.level6.set(STRUCTURE_TOWER + ".1", new RoomPosition(this.center.x, this.center.y - 2, this.room.name));
    this.level6.set(STRUCTURE_EXTENSION + ".1", new RoomPosition(this.center.x, this.center.y - 5, this.room.name));
    this.level6.set(STRUCTURE_EXTENSION + ".2", new RoomPosition(this.center.x - 1, this.center.y - 3, this.room.name));
    this.level6.set(STRUCTURE_EXTENSION + ".3", new RoomPosition(this.center.x - 1, this.center.y - 5, this.room.name));
    this.level6.set(STRUCTURE_EXTENSION + ".4", new RoomPosition(this.center.x - 2, this.center.y - 4, this.room.name));
    this.level6.set(STRUCTURE_EXTENSION + ".5", new RoomPosition(this.center.x - 2, this.center.y - 3, this.room.name));
    this.level6.set(STRUCTURE_EXTENSION + ".6", new RoomPosition(this.center.x - 2, this.center.y - 2, this.room.name));
    this.level6.set(STRUCTURE_EXTENSION + ".7", new RoomPosition(this.center.x - 3, this.center.y - 4, this.room.name));
    this.level6.set(STRUCTURE_EXTENSION + ".8", new RoomPosition(this.center.x - 3, this.center.y - 3, this.room.name));
    this.level6.set(STRUCTURE_EXTENSION + ".9", new RoomPosition(this.center.x - 3, this.center.y - 2, this.room.name));
    this.level6.set(
      STRUCTURE_EXTENSION + ".10",
      new RoomPosition(this.center.x - 3, this.center.y - 1, this.room.name)
    );

    this.level7.set(STRUCTURE_EXTENSION + ".1", new RoomPosition(this.center.x - 3, this.center.y + 1, this.room.name));
    this.level7.set(STRUCTURE_EXTENSION + ".2", new RoomPosition(this.center.x - 4, this.center.y - 3, this.room.name));
    this.level7.set(STRUCTURE_EXTENSION + ".3", new RoomPosition(this.center.x - 4, this.center.y - 2, this.room.name));
    this.level7.set(STRUCTURE_EXTENSION + ".4", new RoomPosition(this.center.x - 4, this.center.y - 1, this.room.name));
    this.level7.set(STRUCTURE_EXTENSION + ".5", new RoomPosition(this.center.x - 4, this.center.y - 0, this.room.name));
    this.level7.set(STRUCTURE_EXTENSION + ".6", new RoomPosition(this.center.x - 4, this.center.y + 2, this.room.name));
    this.level7.set(STRUCTURE_EXTENSION + ".7", new RoomPosition(this.center.x - 5, this.center.y - 2, this.room.name));
    this.level7.set(STRUCTURE_EXTENSION + ".8", new RoomPosition(this.center.x - 5, this.center.y - 1, this.room.name));
    this.level7.set(STRUCTURE_EXTENSION + ".9", new RoomPosition(this.center.x - 5, this.center.y - 0, this.room.name));
    this.level7.set(
      STRUCTURE_EXTENSION + ".10",
      new RoomPosition(this.center.x - 5, this.center.y + 1, this.room.name)
    );

    this.level8.set(STRUCTURE_EXTENSION + ".1", new RoomPosition(this.center.x - 2, this.center.y + 2, this.room.name));
    this.level8.set(STRUCTURE_EXTENSION + ".2", new RoomPosition(this.center.x - 3, this.center.y + 2, this.room.name));
    this.level8.set(STRUCTURE_EXTENSION + ".3", new RoomPosition(this.center.x - 1, this.center.y + 3, this.room.name));
    this.level8.set(STRUCTURE_EXTENSION + ".4", new RoomPosition(this.center.x - 2, this.center.y + 3, this.room.name));
    this.level8.set(STRUCTURE_EXTENSION + ".5", new RoomPosition(this.center.x - 3, this.center.y + 3, this.room.name));
    this.level8.set(STRUCTURE_EXTENSION + ".6", new RoomPosition(this.center.x - 4, this.center.y + 3, this.room.name));
    this.level8.set(STRUCTURE_EXTENSION + ".7", new RoomPosition(this.center.x - 0, this.center.y + 4, this.room.name));
    this.level8.set(STRUCTURE_EXTENSION + ".8", new RoomPosition(this.center.x - 1, this.center.y + 4, this.room.name));
    this.level8.set(STRUCTURE_EXTENSION + ".9", new RoomPosition(this.center.x - 2, this.center.y + 4, this.room.name));
    this.level8.set(
      STRUCTURE_EXTENSION + ".10",
      new RoomPosition(this.center.x - 3, this.center.y + 4, this.room.name)
    );
  }
  /**
   * Build a level of the base structure
   * @param level Level of base to build
   */
  public buildBase(level: number): number {
    let statut: number = OK;
    switch (level) {
      case 1:
        statut = this.buildLevel(this.level1);
        break;
      case 2:
        statut = this.buildLevel(this.level2);
        break;
      case 3:
        statut = this.buildLevel(this.level3);
        break;
      case 4:
        statut = this.buildLevel(this.level4);
        break;
      case 5:
        statut = this.buildLevel(this.level5);
        break;
      case 6:
        statut = this.buildLevel(this.level6);
        break;
      case 7:
        statut = this.buildLevel(this.level7);
        break;
      case 8:
        statut = this.buildLevel(this.level8);
        break;
    }
    return statut;
  }

  private buildLevel(map: Map<String, RoomPosition>): number {
    let statut: number = OK;
    map.forEach((value, key) => {
      let type = key.split(".");
      this.room.createConstructionSite(value, type[0] as StructureConstant);
    });
    return statut;
  }
}
