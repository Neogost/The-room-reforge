import { Builder } from "../roles/colony/builider";
import { Colonist } from "../roles/colony/colonist";
import { Harvester } from "../roles/colony/harvester";
import { ERR_NOTHING_TO_DO } from "../utils/ConstantUtils";
import { CreepUtils } from "../utils/CreepUtils";
import { Traveler } from "../utils/Traveler";

/**
 * @author Neogost
 * Perform the action to harvest a resource.
 * @version 1.0
 */
export class TaskBuild {
  public static doTask(creep: Colonist | Harvester | Builder, room: Room): number {
    return this.buildSomething(creep, room);
  }
  /**
   * @description Check and execute the task `build`. If the creep can do something in the room, he will take the first thing and build it.
   * @param creep Creep who do the task
   * @param room Room where the creep do something
   * @returns statut of the execution. OK(0) il all is good, else error code.
   */
  private static buildSomething(creep: Colonist | Harvester | Builder, room: Room): number {
    if (!creep.memory.targetBuildId) {
      // NOTE : Réfléchir, le colon a t'il besoin d'etre intélligent et de choisir les batiments prioritaire ?
      let constructionsSites: ConstructionSiteMemoryMap<ConstructionSiteOptions> = room.memory.constructionsSites;
      // Take first element
      let constructionSiteToWork =
        constructionsSites != null
          ? room.memory.constructionsSites[Object.keys(room.memory.constructionsSites)[0]]
          : null;
      if (!constructionSiteToWork) {
        return ERR_NOTHING_TO_DO;
      }

      creep.memory.targetBuildId = constructionSiteToWork.id;
      creep.memory._targetBuildPos = constructionSiteToWork.pos;
      creep.memory._targetBuildRoom = constructionSiteToWork.roomName;
    }

    let target: ConstructionSite | null = Game.getObjectById(creep.memory.targetBuildId!);

    // If target do not exist, may be the creep can't see the room. Than, if the creep is not in the workstation
    // move to it.
    if (!target && !CreepUtils.inTheRightRoom(creep, creep.memory._targetBuildRoom) && creep.memory._targetBuildPos) {
      let pos = new RoomPosition(
        creep.memory._targetBuildPos.x,
        creep.memory._targetBuildPos.y,
        creep.memory._targetBuildPos.roomName
      );
      return Traveler.travelTo(creep, pos);
    }

    // If target does't exist or the id is not a `ConstructionSite` reset memory.
    if (!target) {
      // Check if the constructions site exist in memory
      // delete it because it doesn't exist now
      if (creep.memory.targetBuildId && room.memory.constructionsSites[creep.memory.targetBuildId]) {
        delete room.memory.constructionsSites[creep.memory.targetBuildId];
      }
      creep.memory.targetBuildId = undefined;
      creep.memory._targetBuildPos = undefined;
      creep.memory._targetBuildRoom = undefined;
      return ERR_INVALID_TARGET;
    }

    if (creep.pos.inRangeTo(target.pos, 3)) {
      return creep.build(target as ConstructionSite);
    } else {
      return Traveler.travelTo(creep, target.pos);
    }
  }
}
