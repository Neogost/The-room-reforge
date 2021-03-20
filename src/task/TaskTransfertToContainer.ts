import { Harvester } from "../roles/colony/harvester";
import { ERR_NOTHING_TO_DO } from "../utils/ConstantUtils";
import { Traveler } from "../utils/Traveler";

/**
 * @author Neogost
 * Perform the action to harvest a resource.
 * @version 1.0
 */
export class TaskTransfertToContainer {
  public static doTask(creep: Harvester): number {
    return this.transfertToContainer(creep);
  }
  static transfertToContainer(creep: any): number {
    if (!creep.memory.containerId) {
      let container = <StructureContainer>creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function (s: Structure) {
          return s.structureType === STRUCTURE_CONTAINER;
        }
      });
      if (container) {
        creep.memory.containerId = container.id;
        creep.memory._containerPos = container.pos;
        creep.memory._containerRoom = container.room.name;
      } else {
        return ERR_NOTHING_TO_DO;
      }
    }

    if (creep.memory.containerId) {
      let container = <StructureContainer>Game.getObjectById(creep.memory.containerId);
      if (container && container.store[RESOURCE_ENERGY] !== container.store.getCapacity()) {
        if (creep.pos.isNearTo(container.pos)) {
          return creep.transfer(container, RESOURCE_ENERGY);
        } else {
          return Traveler.travelTo(creep, container.pos);
        }
      } else {
        return ERR_NOTHING_TO_DO;
      }
    }

    return ERR_NOTHING_TO_DO;
  }
}
