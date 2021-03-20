import { Carrier } from "../roles/colony/carrier";
import { Colonist } from "../roles/colony/colonist";
import { Harvester } from "../roles/colony/harvester";
import { ERR_NOTHING_TO_DO, ERR_NO_TARGET } from "../utils/ConstantUtils";
import { CreepUtils } from "../utils/CreepUtils";
import { Traveler } from "../utils/Traveler";

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
      // console.log(creep.name + " preselectedTarget");
      let preselectedTarget = <StructureSpawn | StructureExtension | StructureTower>(
        Game.getObjectById(creep.memory.targetTransfertId)
      );
      if (preselectedTarget.store[RESOURCE_ENERGY] === 0) {
        // console.log(creep.name + " reset target");
        creep.memory.targetTransfertId = undefined;
        creep.memory._targetTransferPos = undefined;
        creep.memory._targetTransferRoom = undefined;
      }
    }
    if (!creep.memory.targetTransfertId) {
      // console.log(creep.name + " Find new target");
      // get essential Structure who need energy
      let essentialStructure: Structure | null = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => {
          return (
            // Filter only this 3 type of building
            ((structure.structureType === STRUCTURE_EXTENSION ||
              structure.structureType === STRUCTURE_SPAWN ||
              structure.structureType === STRUCTURE_LINK ||
              structure.structureType === STRUCTURE_TOWER) &&
              // In case where the closest structure is an spawn or extension, check if structure is not full
              (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
              this.findStructureSpawnOrExtensionToTransfert(structure)) ||
            // For tower, only if it is half energy
            (structure.structureType === STRUCTURE_TOWER && this.findStructureTowerToTransfert(structure)) ||
            (structure.structureType === STRUCTURE_LINK && this.findStructureLinkToTransfert(room, structure))
          );
        }
      });

      if (!essentialStructure) {
        return ERR_NOTHING_TO_DO;
      }

      // console.log(creep.name + " Find  target find" + essentialStructure.id);
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
      // console.log(creep.name + " change room");
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
      // console.log(creep.name + " transfert");
      return creep.transfer(target, RESOURCE_ENERGY);
    } else {
      // console.log(creep.name + " move to target");
      return Traveler.travelTo(creep, target.pos);
    }
  }

  private static findStructureTowerToTransfert(structure: StructureTower): boolean {
    return (
      structure.structureType === STRUCTURE_TOWER &&
      <number>structure.store.getFreeCapacity(RESOURCE_ENERGY) >=
        <number>structure.store.getCapacity(RESOURCE_ENERGY) / 2
    );
  }

  private static findStructureLinkToTransfert(room: Room, structure: StructureLink): boolean {
    let result =
      room.memory.structures[structure.id] &&
      room.memory.structures[structure.id].linkOrigine &&
      structure.store.getFreeCapacity(RESOURCE_ENERGY) !== 0;
    return result ? true : false;
  }

  private static findStructureSpawnOrExtensionToTransfert(structure: StructureSpawn | StructureExtension): boolean {
    return structure.store.getFreeCapacity(RESOURCE_ENERGY) !== 0;
  }
}
