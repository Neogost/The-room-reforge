import { PATTERN_ORIGIN_ROOM, PATTERN_TARGET_ROOM } from "../utils/ConstantUtils";
import { Logger } from "../utils/Logger";

/**
 * @description Manages the actions linked to the sheet has action destinations linked to scouting.
 * @author kevin desmay
 * @version 1.0
 */
export class FlagScouted {
  /**
   * @description Execution all case who are linked to the scouting.
   * @param flag Flag to execution action
   */
  public static execute(flag: Flag) {
    let resultOK = false;
    switch (flag.secondaryColor) {
      case COLOR_GREEN:
        resultOK = this.addScoutedRoom(flag.name);
        break;
      default:
        break;
    }
    if (resultOK) {
      Logger.info("Action done on flag " + flag.name + " remove it now ");
      flag.remove();
    } else {
      Logger.warning("flag '" + flag.name + "' haven't the right pattern, nothing to do with it");
    }
  }

  /**
   * @description Add a targeted room to a home room who will be scouted when needed.
   * @param flagName Name of the flag
   * @returns true if the action is correct, else false
   */
  private static addScoutedRoom(flagName: string): boolean {
    let result = false;
    // Extract value from the flag name
    let roomHome = flagName.match(PATTERN_ORIGIN_ROOM);
    let targetRoomName = flagName.match(PATTERN_TARGET_ROOM);

    // Check if information are in the right pattern
    if (roomHome && targetRoomName) {
      let room = Game.rooms[roomHome.toString()];
      if (room && room.memory.scouted) {
        _.set(room.memory, ["scouted", targetRoomName.toString()], {
          roomName: targetRoomName.toString()
        } as ScoutOptions);
        result = true;
      }
    }
    return result;
  }
}
