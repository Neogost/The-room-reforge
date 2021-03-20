import { Infantry } from "../roles/army/infantry";
import { Builder } from "../roles/colony/builider";
import { Carrier } from "../roles/colony/carrier";
import { Colonist } from "../roles/colony/colonist";
import { Harvester } from "../roles/colony/harvester";
import { Repairman } from "../roles/colony/repairman";
import { Upgrader } from "../roles/colony/upgrader";
import { ERR_NOTHING_TO_DO, ERR_NO_TARGET } from "./ConstantUtils";
import { Logger } from "./Logger";

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
    creep: Colonist | Harvester | Upgrader | Builder | Repairman | Carrier | Infantry,
    targetedRoom: string | undefined
  ): boolean {
    return creep.room.name === targetedRoom;
  }

  public static canDoSomething(statutOfExecution: number): boolean {
    return (
      statutOfExecution !== ERR_NO_TARGET &&
      statutOfExecution !== ERR_NOTHING_TO_DO &&
      statutOfExecution !== ERR_NO_TARGET
    );
  }
}
