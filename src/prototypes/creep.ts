import { Traveler } from "../utils/Traveler";
import { ERR_NO_TARGET } from "../utils/ConstantUtils";

// Creep.prototype.harvestEnergy = function harvestEnergy(): number {
//   //  TO DO : result value
//   let target: Source | undefined | null;
//   let result: number = 0;
//   // If a target is set in memory, take it
//   target = Game.getObjectById(this.memory.targetedSource);

//   // if there are no sources or not available sources
//   if (!target || (!target.pos.getOpenPositions().length && !this.pos.isNearTo(target))) {
//     delete this.memory.targetedSource;
//     target = this.findEnergySource();
//   }

//   // If source exit in a room available
//   if (target) {
//     // Close, harvest it
//     if (this.pos.isNearTo(target.pos)) {
//       return this.harvest(target);
//     }
//     // Not in range to harvest, move to it
//     else {
//       Traveler.travelTo(this, target);
//     }
//     return ERR_NO_TARGET;
//   }

//   return result;
// };

// Creep.prototype.findEnergySource = function findEnergySource(): Source | undefined {
//   let source: Source | undefined;
//   // S'il y a une source en mémoire, on la récupère
//   if (this.memory.targetedSource) {
//     source = <Source>Game.getObjectById(this.memory.targetedSource);
//   }
//   if (!source) {
//     let sources = this.room.find(FIND_SOURCES);
//     if (sources.length) {
//       source = _.find(sources, function (s) {
//         // On cherche s'il y a des places disponible autour de la source
//         return s.pos.getOpenPositions().length > 0;
//       });
//     }
//   }
//   // On récupère les sources de la room du creep
//   if (source) {
//     // On sauvegarde la sources assigné
//     this.memory.targetedSource = source.id;
//     // On retourne la source
//     return source;
//   }
//   return undefined;
// };

// Creep.prototype.withdrawFromStorage = function withdrawFromStorage(): void {
//   //
//   if (this.memory.forcedTargetedStorage) {
//     let storage: StructureStorage | null = Game.getObjectById<StructureStorage>(this.memory.forcedTargetedStorage);
//     if (storage) {
//       if (storage.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
//         this.harvestEnergy();
//       } else {
//         if (this.pos.isNearTo(storage)) {
//           this.withdraw(storage, RESOURCE_ENERGY);
//         } else {
//           Traveler.travelTo(this, storage);
//         }
//       }
//     }
//   }
// };

// Creep.prototype.moveToBuild = function moveToBuild(targetId: string, room: Room): void {
//   const target: ConstructionSite | null = Game.getObjectById(targetId);
//   if (target) {
//     this.pos.getRangeTo(target) > 3 ? Traveler.travelTo(this, target) : this.build(target);
//   }
//   // Clean memory
//   else {
//     delete room.memory.constructionsSites[targetId as any];
//     delete this.memory.targetedCS;
//   }
// };

// Creep.prototype.findConstructionSites = function findTarget(room: Room): string | null {
//   let result: string | null = null;
//   // Analyse the constructions sites linked to the room
//   _.forEach(room.memory.constructionsSites, function (csId, key) {
//     let cs: ConstructionSite | null = Game.getObjectById(key.toString());
//     // Get the first target find and break the loop
//     if (cs && cs.progress < cs.progressTotal) {
//       result = key.toString();
//       return false;
//     }
//     // Construction sites is now a structure. delete it
//     else {
//       delete room.memory.constructionsSites[key];
//     }
//     // The loop continue
//     return true;
//   });
//   return result;
// };
