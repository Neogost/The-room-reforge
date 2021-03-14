import { FlagScouted } from "./FlagScouted";

/**
 * @description Handles actions related to the flag.
 * Allows the player to interact with the system by positioning flags of different colors to perform different actions.
 * - Each main color corresponds to a type of action.
 * - Secondary colors are used to define specific actions.
 *
 * /!\ Attention, each flag has its own operating system, go to the documentation of these for more explanation. By default, if the action is not understood, the flag is ignored.
 */
export class Flags {
  public static execute(flag: Flag) {
    switch (flag.color) {
      case COLOR_GREEN:
        FlagScouted.execute(flag);
        break;
      default:
        break;
    }
  }
}
