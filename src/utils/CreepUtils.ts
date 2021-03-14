import { Builder } from "../roles/colony/builider";
import { Colonist } from "../roles/colony/colonist";
import { Logger } from "./Logger";
import { Traveler } from "./Traveler";
import { ERR_NOTHING_TO_DO } from "./ConstantUtils";
import { Upgrader } from "../roles/colony/upgrader";
import { Harvester } from "../roles/colony/harvester";
import { Repairman } from "../roles/colony/repairman";
import { Carrier } from "../roles/colony/carrier";

/**
 * @author neogost
 * Help to use the entity `Creep`
 *
 * @version 1.0
 */
export class CreepUtils {
  /**
   * Verify if the creep can work. Check if the body of the creep containt `WORK` element.
   * @version 1.0
   * @param creep Creep to verify
   * @returns true if the creep can work, else false
   */
  public static canWork(creep: Creep): boolean {
    return !_.isEmpty(_.filter(creep.body, (element) => element.type === WORK));
  }

  public static canStore(creep: Creep): boolean {
    return creep.store.getFreeCapacity() > 0;
  }

  /**
   * @description Calcul and log the amount of CPU used betwen a start value and when this function is call
   * @param creep Creep who do something
   * @param start Value of the cpu used at the start of the programme
   */
  public static calculateCPUUsed(creep: Creep, start: number) {
    let end = Game.cpu.getUsed();
    Logger.debug(creep.name + " exection use : " + (end - start));
  }

  public static inTheRightRoom(
    creep: Colonist | Harvester | Upgrader | Builder | Repairman | Carrier,
    targetedRoom: string | undefined
  ): boolean {
    return creep.room.name === targetedRoom;
  }
}
