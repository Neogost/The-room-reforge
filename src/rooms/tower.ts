import { List } from "lodash";
import { ERR_NOTHING_TO_DO } from "../utils/ConstantUtils";
import { Logger } from "../utils/Logger";

const towers = {
  /**
   * Execute the workflow of the spawner.
   * A spawner generate all type of creep needed to the empire.
   * Type of creep who the spawner can generate :
   * - Harvester
   * - Builder
   * - Upgrader
   * @param room Room who try to generate creep
   */
  run(room: Room) {
    let analyseCPUStart = Game.cpu.getUsed();

    // Find tower in the room

    let towers: List<StructureTower> = <List<StructureTower>>room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    });

    // No spawn here,
    if (!towers.length) {
      return;
    }

    let hostileCreep: List<Creep> = room.find(FIND_HOSTILE_CREEPS);
    // Each tower do there job
    // FIXME : ce foreach bloque l'utilisation du return pour stoper l'exécution
    _.forEach(towers, (tower, id) => {
      // 1. Recherche des enemies
      // 1.2. Attaque
      let statutExecution: number = -1;

      if (hostileCreep.length) {
        let target = hostileCreep[0];
        statutExecution = tower.attack(target);
      }

      // can't do more thing, the tower attack a creep
      if (statutExecution != OK) {
        // Find structure to repair
        let structures = room.memory.structures;
        let structuresToRepair = _.filter(structures, function (structure) {
          return structure.needRepair;
        });
        // Take a structure and repair it
        let structure = structuresToRepair[0];
        if (structure) {
          let target = Game.getObjectById(structure.id);
          if (target) {
            if (target.hits < target.hitsMax) {
              tower.repair(target);
            } else {
              room.memory.structures[target.id].needRepair = false;
            }
          }
        } else {
          statutExecution = ERR_NOTHING_TO_DO;
        }
      }
    });
    let analyseCPUEnd = Game.cpu.getUsed();
    Logger.debug("Tower execution use : " + (analyseCPUEnd - analyseCPUStart));
  }
};

export default towers;
