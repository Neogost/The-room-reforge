import { Builder } from "../roles/colony/builider";
import { Colonist } from "../roles/colony/colonist";
import { Repairman } from "../roles/colony/repairman";
import { Upgrader } from "../roles/colony/upgrader";
import { ERR_NO_TARGET } from "../utils/ConstantUtils";
import { CreepUtils } from "../utils/CreepUtils";
import { Traveler } from "../utils/Traveler";

/**
 * @author Neogost
 * Perform the action to harvest a resource.
 * @version 1.0
 */
export class TaskHarvestSomething {
  /**
   * Harverst a target of type `SOURCE`, `MINERAL` or `DEPOSIT`. Verify if the `creep` can do it and do it.
   * @param creep creep who execute the task
   * @param target target of the task.
   * @param targetRoomName target room name
   * @returns statut of the task :
   *    - -1000 : Target invalid
   *    - -12 : No body part of `WORK`
   */
  public static doTask(creep: Colonist | Upgrader | Builder | Repairman, room: Room): number {
    return this.harvestEnergy(creep, room);
  }

  /**
   * @description find a source of energy in the room and harvest this target
   * @param creep creep who try to harverst a source of energy
   * @param room Room where the creep try to harverst
   * @returns statut of execution
   */
  private static harvestEnergy(creep: Colonist | Upgrader | Builder | Repairman, room: Room): number {
    //  TO DO : result value
    let target: Source | null | undefined;
    // If a target is set in memory, take it
    if (creep.memory.targetSourceId) {
      target = Game.getObjectById(creep.memory.targetSourceId);
    }

    // If target do not exist, may be the creep can't see the room. Than, if the creep is not in the workstation
    // move to it.
    if (!target && !CreepUtils.inTheRightRoom(creep, creep.memory._targetSourceRoom) && creep.memory._targetSourcePos) {
      return Traveler.travelTo(creep, creep.memory._targetSourcePos);
    }

    // if there are no sources or not available sources
    if (!target || (!target.pos.getOpenPositions().length && !creep.pos.isNearTo(target))) {
      creep.memory.targetSourceId = undefined;
      creep.memory._targetSourcePos = undefined;
      creep.memory._targetSourceRoom = undefined;
      target = this.findEnergySource(creep, room);
    }

    // If source exit in a room available
    if (target) {
      // Close, harvest it
      if (creep.pos.isNearTo(target.pos)) {
        return creep.harvest(target);
      }
      // Not in range to harvest, move to it
      else {
        return Traveler.travelTo(creep, target.pos);
      }
    } else {
      return ERR_NO_TARGET;
    }
  }

  /**
   * @description Find in the room the sources of energy who can be harvest.
   * @param creep Creep who try to find an energy sources
   * @param room Room where the creep try to find energy source
   * @returns Source of energy. If no one is find, return `undefined`
   */
  private static findEnergySource(creep: Colonist | Upgrader | Builder | Repairman, room: Room): Source | undefined {
    let source: Source | null | undefined;
    // S'il y a une source en mémoire, on la récupère
    if (creep.memory.targetSourceId) {
      source = Game.getObjectById(creep.memory.targetSourceId);
    }
    // FIXME : Etrange mais vrai. Le block ci-dessous prend 0,05PCU du à l'appel a la classe static RoomPositionUtils.
    // Cette même méthode appelé au travers d'un prototype prend 0,2CPU.
    if (!source) {
      let sources = creep.room.find(FIND_SOURCES);
      if (sources.length) {
        source = _.find(sources, function (s) {
          // On cherche s'il y a des places disponible autour de la source
          return s.pos.getOpenPositions().length > 0;
        });
      }
    }
    // On récupère les sources de la room du creep
    if (source) {
      // On sauvegarde la sources assigné
      creep.memory.targetSourceId = source.id;
      creep.memory._targetSourcePos = source.pos;
      creep.memory._targetSourceRoom = room.name;
      // On retourne la source
      return source as Source;
    }
    return undefined;
  }
}
