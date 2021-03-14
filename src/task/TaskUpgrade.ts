import { Colonist } from "../roles/colony/colonist";
import { CREEP_COLONIST, ERR_NOTHING_TO_DO } from "../utils/ConstantUtils";
import { CreepUtils } from "../utils/CreepUtils";
import { Traveler } from "../utils/Traveler";
import { Upgrader } from "../roles/colony/upgrader";
import { Harvester } from "../roles/colony/harvester";
/**
 * @author Neogost
 * Perform the action to harvest a resource.
 * @version 1.0
 */
export class TaskUpgrade {
  public static doTask(creep: Colonist | Upgrader | Harvester, controller: StructureController | undefined): number {
    return this.upgradeConstroller(creep, controller);
  }
  /**
   * @description Control and execute action to upgrade the controler of the room if needed.
   * The colonist check if the `setting.conlinsation.levelToMaintain` is under the level of acceptance
   * @param creep Creep who do the task
   * @param controller Controller to upgrade if needed
   * @returns statut of the execution. OK(0) if all is good
   */
  private static upgradeConstroller(
    creep: Colonist | Upgrader | Harvester,
    controller: StructureController | undefined
  ): number {
    if (
      creep.memory.role !== CREEP_COLONIST ||
      (creep.memory.role === CREEP_COLONIST && this.canUpgradeController(controller))
    ) {
      let controllerPosition: RoomPosition = controller!.pos;

      // Upgrade the controller
      if (creep.pos.inRangeTo(controllerPosition, 3)) {
        return creep.upgradeController(controller!);
      }
      // Move to upgrade
      else {
        return Traveler.travelTo(creep, controllerPosition);
      }
    }
    return ERR_NOTHING_TO_DO;
  }

  /**
   * @description Check if the controller in the room can be upgrade by a colonist
   * @param controller Controller in the room
   * @returns true if creep have to up the controller, else false
   */
  private static canUpgradeController(controller: StructureController | undefined): boolean {
    let levelToMaintainController = Memory.settings.colonisation.levelToMaintain;
    return !!controller && !!controller.my && controller.level < levelToMaintainController;
  }
}
