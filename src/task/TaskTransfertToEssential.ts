import { List } from "lodash";
import { Colonist } from "../roles/colony/colonist";
import { ERR_NOTHING_TO_DO, ERR_NO_TARGET } from "../utils/ConstantUtils";
import { CreepUtils } from "../utils/CreepUtils";
import { Traveler } from "../utils/Traveler";
import { Harvester } from "../roles/colony/harvester";
import { Carrier } from "../roles/colony/carrier";

/**
 * @author Neogost
 * Perform the action to harvest a resource.
 * @version 1.0
 */
export class TaskTransfertToEssential {
  public static doTask(creep: Colonist | Harvester | Carrier, room: Room): number {
    return this.transfertEnergyToEssentialStructure(creep, room);
  }

  /**
   * @description The colonist try to tranfert energy to essential structure in a room.
   * An essential structure is a structure who need energy to product creep or important element for the room.
   * Actual essential structure :
   * - `StructureSpawn`
   * - `StructureExtension`
   * @param creep Creep who do try to transfert energy
   * @param room Room where the creep is
   * @returns statut of execution
   */
  private static transfertEnergyToEssentialStructure(creep: Colonist | Harvester | Carrier, room: Room): number {
    if (creep.memory.targetTransfertId) {
      let preselectedTarget = <StructureSpawn | StructureExtension | StructureTower>(
        Game.getObjectById(creep.memory.targetTransfertId)
      );
      if (preselectedTarget.store.getFreeCapacity() === 0) {
        creep.memory.targetTransfertId = undefined;
        creep.memory._targetTransferPos = undefined;
        creep.memory._targetTransferRoom = undefined;
      }
    }
    if (!creep.memory.targetTransfertId) {
      // get essential Structure who need energy
      let essentialStructure: Structure | null = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => {
          return (
            // Filter only this 3 type of building
            ((structure.structureType === STRUCTURE_EXTENSION ||
              structure.structureType === STRUCTURE_SPAWN ||
              structure.structureType === STRUCTURE_TOWER) &&
              // In case where the closest structure is an spawn or extension, check if structure is not full
              (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) !== 0) ||
            // For tower, only if it is half energy
            (structure.structureType === STRUCTURE_TOWER &&
              <number>structure.store.getFreeCapacity(RESOURCE_ENERGY) >=
                <number>structure.store.getCapacity(RESOURCE_ENERGY) / 2)
          );
        }
      });

      if (!essentialStructure) {
        return ERR_NOTHING_TO_DO;
      }

      creep.memory.targetTransfertId = essentialStructure.id;
      creep.memory._targetTransferPos = essentialStructure.pos;
      creep.memory._targetTransferRoom = room.name;
    }
    let target = <StructureSpawn | StructureExtension | StructureTower>(
      Game.getObjectById(creep.memory.targetTransfertId!)
    );
    // If target do not exist, may be the creep can't see the room. Than, if the creep is not in the workstation
    // move to it.
    if (
      !target &&
      !CreepUtils.inTheRightRoom(creep, creep.memory._targetTransferRoom) &&
      creep.memory._targetTransferPos
    ) {
      return Traveler.travelTo(creep, creep.memory._targetTransferPos);
    }
    // If target not exist when the creep is in the right room, reset target.
    if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      creep.memory.targetTransfertId = undefined;
      creep.memory._targetTransferPos = undefined;
      creep.memory._targetTransferRoom = undefined;
      return ERR_NO_TARGET;
    }
    if (creep.pos.isNearTo(target.pos)) {
      return creep.transfer(target, RESOURCE_ENERGY);
    } else {
      return Traveler.travelTo(creep, target.pos);
    }
  }
}
