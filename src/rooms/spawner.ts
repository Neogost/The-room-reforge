import { List } from "lodash";
import { Colonist, ColonistMemory } from "../roles/colony/colonist";

import {
  ERR_NO_SPAWN_SELECTED,
  ERR_NO_ROLE_FOR_CREEP,
  ERR_NO_ROOM_SELECTED,
  ERR_FULL_CREEP
} from "../utils/ConstantUtils";

/**
 * Get the body of a new creep base on a `segment` and energy available in the `room` who will produce it.
 *
 * Segment is element like constant:
 * - MOVE
 * - WORK
 * - CARRY
 * - CLAIM
 * - HEAL
 * - ATTACK
 * - RANGED_ATTACK
 * - TOUGH
 *
 * @param segment list of body element that is going to be duplicated. If there are no `segment` return null
 * @param room room who are ready to spawn a creep.
 * @param limitedBody limit the body size
 * @returns The final size of the body, if no segment is given : null
 */
function getBody(segment: List<BodyPartConstant>, room: Room, limitedBody?: number): Array<BodyPartConstant> {
  let body: Array<BodyPartConstant> = new Array();

  // do the sum of body part pattern
  let segmentCost: number = _.sum(segment, (s) => BODYPART_COST[s]);

  // check energy available in the room
  let energyAvailable: number = room.energyAvailable;

  // count how many time the pattern can be reapet
  let maxSegments: number = Math.floor(energyAvailable / segmentCost);

  // if the limit is pass, limit set the max size of the body
  if (limitedBody && limitedBody != 0 && maxSegments > limitedBody) {
    maxSegments = limitedBody;
  }
  // duplicate the pattern
  _.times(maxSegments, function () {
    _.forEach(segment, (s) => body.push(s));
  });

  return body;
}

/**
 * Generate a new creep 'Harvester'
 * @param spawn Spawner who will spawn the new creep
 * @param room Room where is the spawner
 * @returns spawning statut
 */
// function spawnHarvester(spawn: StructureSpawn, room: Room): number {
//   // FIXME : Body a rendre paramettrable
//   return spawnGenericCreep(spawn, room, "harvester", [WORK, CARRY, MOVE], 0, 2, {
//     memory: new HarvesterMemory(room)
//   });
// }

/**
 * Generate a new creep 'Colonist'.
 * @param spawn Spawner who will spawn the new creep
 * @param room Room where is the spawner
 * @returns spawning statut
 */
function spawnColon(spawn: StructureSpawn, room: Room): number {
  // FIXME : Body a rendre paramettrable
  return spawnGenericCreep(spawn, room, "colonist", [WORK, CARRY, MOVE], 0, 2, {
    memory: new ColonistMemory(room)
  });
}

/**
 * Generate a new creep with all of his information needed.
 *
 * Can generate creep and limite the genegation of each role of creep.
 *
 * @param spawn Spawn who will do the job
 * @param room Room where is the spawn
 * @param role Role of the creep who will be generate
 * @param body Body pattern of the creep
 * @param limitedBody limited body size
 * @param defaultConsus default number of creep in the room. Override by Room.memory.consus
 * @param spawnOption option during the spawning
 * @returns return the result of the spawning action. Else, can return error :
 * - ERR_NO_SPAWN_SELECTED : No spawn are selected to do the spawning
 * - ERR_NO_ROLE_FOR_CREEP : No role are set for the new creep, can't initialise creep memory
 * - ERR_NO_ROOM_SELECTED : No room are selected for the spawning, can't initialise creep memory
 * - ERR_FULL_CREEP : The room is full of this role
 */
function spawnGenericCreep(
  spawn: StructureSpawn,
  room: Room,
  role: string,
  body: List<BodyPartConstant>,
  limitedBody: number,
  defaultConsus: number,
  spawnOption: SpawnOptions
): number {
  // No spawn, can't do anything, return error
  if (!spawn) {
    return ERR_NO_SPAWN_SELECTED;
  }
  // No role, can't create a new creep;
  if (!role) {
    return ERR_NO_ROLE_FOR_CREEP;
  }

  if (!room) {
    return ERR_NO_ROOM_SELECTED;
  }
  // How many creep with this role is autorise in this room
  let max = _.get(room.memory, ["consus", role], defaultConsus);
  // How many creep already exist in this room with this role
  let existingCreeps = _.filter(
    Game.creeps,
    (
      creep: /*Builder | Upgrader | Harvester | Claimer | Reservist | Repairman | Carrier | AssignedHarvester*/ Colonist
    ) => creep.memory.role == role && creep.memory.homeRoomName == room.name
  );
  if (existingCreeps.length < max) {
    // Generate a new creep
    let newName: string = role + Game.time;
    return spawn.spawnCreep(getBody(body, room, limitedBody), newName, spawnOption);
  }
  // Else number of max creep is reach, return error code
  else {
    return ERR_FULL_CREEP;
  }
}

/**
 * Generate a new creep 'AssignedHarvest'
 * @param spawn Spawner who will spawn the new creep
 * @param room Room where is the spawner
 * @returns spawining statut
 */
// function spawnCarrier(spawn: StructureSpawn, room: Room): number {
//   // Autorise an assigned Harvester only if a storage exist.
//   let result: number = -1;
//   if (spawn.room.storage) {
//     // for each sources memorise in the room
//     _.forEach(room.memory.structures, function (key, structureId) {
//       // get the source
//       let structure: Structure | undefined | null = Game.getObjectById(structureId.toString());
//       if (structure?.structureType == STRUCTURE_CONTAINER) {
//         if (structure) {
//           if (Game.time - (key.lastSpawn || 0) > CREEP_LIFE_TIME) {
//             var newName = "carrier" + Game.time;

//             // On génère un creep
//             // result = spawn.spawnCreep(getBody([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], room, 4), newName, {
//             //   memory: new CarrierMemory(room, structure.id.toString(), room.storage!.id.toString(), key.roomName)
//             // });
//             // If the result if the spawn is ok
//             if (result == OK) {
//               // Set the last time spawn and quit
//               key.lastSpawn = Game.time;
//               return false;
//             }
//           }
//         }
//       }
//       return true;
//     });
//   }
//   return result;
// }

const spawners = {
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
    let spawns: List<StructureSpawn> = <List<StructureSpawn>>room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_SPAWN }
    });

    // Extract all spawn available to be used
    spawns = _.filter(spawns, (s) => !s.spawning);

    // No spawn here,
    if (!spawns.length) {
      return;
    }

    // Use the first spawn available
    let spawn: StructureSpawn = spawns[0];

    // Spawn a creep 'harvester'
    if (spawnColon(spawn, room) == OK) {
      return;
    }

    // Spawn a creep 'harvester'
    // if (spawnHarvester(spawn, room) == OK) {
    //   return;
    // }
  }
};

export default spawners;
