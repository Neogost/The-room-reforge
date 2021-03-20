import { List } from "lodash";
import { InfantrytMemory } from "../roles/army/infantry";
import { ReservistMemory } from "../roles/army/reservist";
import { Scout, ScoutMemory } from "../roles/army/scout";
import { Builder, BuilderMemory } from "../roles/colony/builider";
import { CarrierMemory } from "../roles/colony/carrier";
import { Colonist, ColonistMemory } from "../roles/colony/colonist";
import { Harvester, HarvesterMemory } from "../roles/colony/harvester";
import { Manager, ManagerMemory } from "../roles/colony/manager";
import { Repairman, RepairmanMemory } from "../roles/colony/repairman";
import { Upgrader, UpgraderMemory } from "../roles/colony/upgrader";
import {
  CARRIER_DEDICATED_BODY,
  CARRIER_DEDICATED_LIMIT,
  CREEP_BUILDER,
  CREEP_BUILDER_DEFAULT_NUMBER,
  CREEP_CARRIER,
  CREEP_CARRIER_DEFAULT_NUMBER,
  CREEP_COLONIST,
  CREEP_COLONIST_DEFAULT_NUMBER,
  CREEP_HARVESTER,
  CREEP_HARVESTER_DEFAULT_NUMBER,
  CREEP_INFANTRY,
  CREEP_INFANTRY_DEFAULT_NUMBER,
  CREEP_MANAGER,
  CREEP_MANAGER_DEFAULT_NUMBER,
  CREEP_REPAIRMANS,
  CREEP_REPAIRMANS_DEFAULT_NUMBER,
  CREEP_RESERVIST,
  CREEP_RESERVIST_DEFAULT_NUMBER,
  CREEP_SCOUT,
  CREEP_SCOUT_DEFAULT_NUMBER,
  CREEP_UPGRADER,
  CREEP_UPGRADER_DEFAULT_NUMBER,
  DEFAULT_BODY,
  DEFAULT_LIMIT,
  ERR_FULL_CREEP,
  ERR_NOTHING_TO_DO,
  ERR_NO_ROLE_FOR_CREEP,
  ERR_NO_ROOM_SELECTED,
  ERR_NO_SPAWN_SELECTED,
  HARVESTER_DEDICATED_BODY,
  HARVESTER_DEDICATED_LIMIT,
  HARVESTER_MINIMAL_BODY,
  HARVESTER_MINIMAL_LIMIT,
  INFANTRY_BODY,
  INFANTRY_LIMIT,
  MANAGER_BODY,
  MANAGER_LIMIT,
  REPAIRMAN_DMINIMAL_LIMIT,
  REPAIRMAN_MINIMAL_BODY,
  RESERVIST_BODY,
  RESERVIST_LIMIT,
  SCOUT_BODY,
  SCOUT_LIMIT,
  SECOND_LEVEL_STORAGE_STOCK,
  SOURCE_TYPE,
  UPGRADER_DEDICATED_BODY,
  UPGRADER_DEDICATED_LIMIT,
  UPGRADER_MINIMAL_BODY,
  UPGRADER_MINIMAL_LIMIT
} from "../utils/ConstantUtils";
import { Logger } from "../utils/Logger";

/**
 * @description Get the body of a new creep base on a `segment` and energy available in the `room` who will produce it.
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
 * @version 1.0
 */
function getBody(segment: List<BodyPartConstant>, room: Room, limitedBody?: number): Array<BodyPartConstant> {
  let analyseCPUStart = Game.cpu.getUsed();
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

  let analyseCPUEnd = Game.cpu.getUsed();
  Logger.debug("get Body execution use : " + (analyseCPUEnd - analyseCPUStart));
  return body;
}

/**
 * @description Determinate the body size and part of a futur Creep.
 * @param room room where the creep will be spawn
 * @param role Role of the creep. Help to determinate the body pattern. If incorrect, return default pattern
 * @param link If exist, used to initialised some body
 * @returns Array of body part for the creep
 * @version 1.0
 */
function getBodyPattern(room: Room, role: string, link?: StructureLink): Array<BodyPartConstant> {
  switch (role) {
    // ===== COLONY
    case CREEP_HARVESTER:
      if (room.storage && room.storage.store[RESOURCE_ENERGY] > SECOND_LEVEL_STORAGE_STOCK) {
        return HARVESTER_DEDICATED_BODY;
      } else {
        // Pattern use for low level or insuffisent energy
        return HARVESTER_MINIMAL_BODY;
      }
    case CREEP_UPGRADER:
      if (link) {
        return UPGRADER_DEDICATED_BODY;
      } else {
        return UPGRADER_MINIMAL_BODY;
      }
    case CREEP_BUILDER:
      return DEFAULT_BODY;
    case CREEP_REPAIRMANS:
      return DEFAULT_BODY;
    case CREEP_MANAGER:
      return MANAGER_BODY;
    case CREEP_CARRIER:
      return CARRIER_DEDICATED_BODY;
    case CREEP_COLONIST:
      return DEFAULT_BODY;
    case CREEP_REPAIRMANS:
      return REPAIRMAN_MINIMAL_BODY;
    case CREEP_RESERVIST:
      return RESERVIST_BODY;

    // ===== ARMY
    case CREEP_SCOUT:
      return SCOUT_BODY;
    case CREEP_INFANTRY:
      return INFANTRY_BODY;
    // ===== DEFAULT
    default:
      return DEFAULT_BODY;
  }
}
/**
 * @description Determinate the body limit of an futur Creep.
 * @param room room where the creep will be spawn
 * @param role Role of the creep. Help to determinate the body pattern. If incorrect, return default pattern
 * @param link If exist, used to initialised some body
 * @returns Array of body part for the creep
 * @version 1.0
 */
function getBodyLimit(room: Room, role: string, link?: StructureLink): number {
  switch (role) {
    // ===== COLONY
    case CREEP_HARVESTER:
      if (room.storage && room.storage.store[RESOURCE_ENERGY] > SECOND_LEVEL_STORAGE_STOCK) {
        return HARVESTER_DEDICATED_LIMIT;
      } else {
        // Pattern use for low level or insuffisent energy
        return HARVESTER_MINIMAL_LIMIT;
      }
    case CREEP_UPGRADER:
      if (link) {
        return UPGRADER_DEDICATED_LIMIT;
      } else {
        return UPGRADER_MINIMAL_LIMIT;
      }
    case CREEP_BUILDER:
      return DEFAULT_LIMIT;
    case CREEP_REPAIRMANS:
      return DEFAULT_LIMIT;
    case CREEP_MANAGER:
      return MANAGER_LIMIT;
    case CREEP_CARRIER:
      return CARRIER_DEDICATED_LIMIT;
    case CREEP_COLONIST:
      return DEFAULT_LIMIT;
    case CREEP_REPAIRMANS:
      return REPAIRMAN_DMINIMAL_LIMIT;
    case CREEP_RESERVIST:
      return RESERVIST_LIMIT;
    // ===== ARMY
    case CREEP_INFANTRY:
      return INFANTRY_LIMIT;
    case CREEP_SCOUT:
      return SCOUT_LIMIT;

    // ===== DEFAULT
    default:
      return DEFAULT_LIMIT;
  }
}

/**
 * @description Try to spawn a creep of type `Carrier`.
 * A `Carrier` is generated if there are a container available. A container available is a container who are in a room or this linked room who haven't be linked to an other carrier
 *
 * @param spawn spawn try to do the action of spawn a `Carrier`
 * @param room Room where the spawn and the creep is. Use to initialise the `Carrier`
 * @returns Statut of execution of the spawn. See [StructureSpawner.spawnCreep()](https://docs.screeps.com/api/#StructureSpawn.spawnCreep) documentation.
 * @version 1.0
 */
function spawnCarrier(spawn: StructureSpawn, room: Room): number {
  let storage = room.storage;
  let result = -1;
  // Find container in the room's structure memory
  let containers = _.filter(room.memory.structures, function (s) {
    return s.type === STRUCTURE_CONTAINER;
  });

  // For each container
  _.forEach(containers, function (container) {
    // Check if it was already affected and it's not the time to spawn another creep for this container
    if (Game.time - (container.lastSpawn || 0) > CREEP_LIFE_TIME) {
      let containerStatut: StructureContainer = <StructureContainer>Game.getObjectById(container.id);
      // Check if the container is not empty, if it is empty, the container is may be not used
      if (containerStatut && containerStatut.store[RESOURCE_ENERGY] > 200) {
        // Spawn a Carrier
        result = spawnGenericCreep(
          spawn,
          room,
          CREEP_CARRIER,
          getBodyPattern(room, CREEP_CARRIER),
          getBodyLimit(room, CREEP_CARRIER),
          CREEP_CARRIER_DEFAULT_NUMBER,
          {
            memory: new CarrierMemory(
              room,
              container.id as Id<StructureContainer>,
              container.pos,
              container.roomName,
              storage
            )
          }
        );
      }
      // The carrier is spawned, no need to continue the forEach
      if (result == OK) {
        // Set the time code when the Carrier was spawn on the container, in memory
        container.lastSpawn = Game.time;
        return false;
      }
    }
    // Continue to try to spawn a Carrier
    return true;
  });
  return result;
}
/**
 * @description Try to spawn a creep of type `Harvester`.
 * A `Harvester` is generated if there are a `source` available in the room or a linked room. It's determinate if the source have been already affected.
 *
 * @param spawn spawn try to do the action of spawn a `Harvester`
 * @param room Room where the spawn and the creep is. Use to initialise the `Harvester`
 * @returns Statut of execution of the spawn. See [StructureSpawner.spawnCreep()](https://docs.screeps.com/api/#StructureSpawn.spawnCreep) documentation.
 */
function spawnHarvester(spawn: StructureSpawn, room: Room): number {
  let storage = room.storage;
  let result = -1;
  // For each source, assign a creep
  _.forEach(room.memory.sources, function (source) {
    // Take only `Source`
    if (source.type === SOURCE_TYPE) {
      // Check if it was already affected and it's not the time to spawn another creep for this source
      if (Game.time - (source.lastSpawn || 0) > CREEP_LIFE_TIME) {
        result = spawnGenericCreep(
          spawn,
          room,
          CREEP_HARVESTER,
          getBodyPattern(room, CREEP_HARVESTER),
          getBodyLimit(room, CREEP_HARVESTER),
          CREEP_HARVESTER_DEFAULT_NUMBER,
          {
            memory: new HarvesterMemory(room, source.id as Id<Source>, source.pos, source.roomName, storage)
          }
        );
        // The harvester is spawned, no need to continue the forEach
        if (result == OK) {
          // Set the time code when the Harvester was spawn on the source, in memory
          source.lastSpawn = Game.time;
          return false;
        }
      }
    }
    // Continue to try to spawn a Harvester
    return true;
  });
  return result;
}

/**
 * @description Try to spawn a creep of type `Colonist`.
 * @param spawn spawn try to do the action of spawn a `Colonist`
 * @param room Room where the spawn and the creep is. Use to initialise the `Colonist`
 * @returns spawning statut
 * @version 1.0
 */
function spawnColonist(spawn: StructureSpawn, room: Room): number {
  let result = spawnGenericCreep(
    spawn,
    room,
    CREEP_COLONIST,
    getBodyPattern(room, CREEP_COLONIST),
    getBodyLimit(room, CREEP_COLONIST),
    CREEP_COLONIST_DEFAULT_NUMBER,
    {
      memory: new ColonistMemory(room)
    }
  );
  return result;
}
/**
 * @description Try to spawn a creep of type `Scout`.
 * @param spawn spawn try to do the action of spawn a `Scout`
 * @param room Room where the spawn and the creep is. Use to initialise the `Scout`
 * @returns spawning statut
 * @version 1.0
 */
function spawnScout(spawn: StructureSpawn, room: Room): number {
  let result = spawnGenericCreep(
    spawn,
    room,
    CREEP_SCOUT,
    getBodyPattern(room, CREEP_SCOUT),
    getBodyLimit(room, CREEP_SCOUT),
    CREEP_SCOUT_DEFAULT_NUMBER,
    {
      memory: new ScoutMemory(room)
    }
  );
  return result;
}

/**
 * Generate a new creep 'Repairmans'.
 * @param spawn spawn try to do the action of spawn a `Repairmans`
 * @param room Room where the spawn and the creep is. Use to initialise the `Repairmans`
 * @returns spawning statut
 * @version 1.0
 */
function spawnRepairman(spawn: StructureSpawn, room: Room): number {
  let result = spawnGenericCreep(
    spawn,
    room,
    CREEP_REPAIRMANS,
    getBodyPattern(room, CREEP_REPAIRMANS),
    getBodyLimit(room, CREEP_REPAIRMANS),
    CREEP_REPAIRMANS_DEFAULT_NUMBER,
    {
      memory: new RepairmanMemory(room, room.storage)
    }
  );
  return result;
}
/**
 * Generate a new creep 'Manager'.
 * @param spawn spawn try to do the action of spawn a `Manager`
 * @param room Room where the spawn and the creep is. Use to initialise the `Manager`
 * @returns spawning statut
 * @version 1.0
 */
function spawnManager(spawn: StructureSpawn, room: Room): number {
  let result = -1;
  // FIXME : Body a rendre paramettrable
  if (room.storage && room.storage.store[RESOURCE_ENERGY] > SECOND_LEVEL_STORAGE_STOCK) {
    result = spawnGenericCreep(
      spawn,
      room,
      CREEP_MANAGER,
      getBodyPattern(room, CREEP_MANAGER),
      getBodyLimit(room, CREEP_MANAGER),
      CREEP_MANAGER_DEFAULT_NUMBER,
      {
        memory: new ManagerMemory(room, room.storage)
      }
    );
  }
  return result;
}

function spawnInfantry(spawn: StructureSpawn, room: Room): number {
  let result = -1;
  _.forEach(room.memory.linked, function (linked) {
    if (linked.roomName) {
      let targetedRoom = Game.rooms[linked.roomName];
      if (targetedRoom && targetedRoom.controller && Game.time - (linked.lastSentry || 0) > CREEP_LIFE_TIME) {
        result = spawnGenericCreep(
          spawn,
          room,
          CREEP_INFANTRY,
          getBodyPattern(room, CREEP_INFANTRY),
          getBodyLimit(room, CREEP_INFANTRY),
          CREEP_INFANTRY_DEFAULT_NUMBER,
          {
            memory: new InfantrytMemory(room, true, targetedRoom.controller)
          }
        );
        // The harvester is spawned, no need to continue the forEach
        if (result == OK) {
          // Set the time code when the Harvester was spawn on the source, in memory
          linked.lastSentry = Game.time;
          return false;
        }
      }
    }
    return true;
  });
  return result;
}

function spawnReservist(spawn: StructureSpawn, room: Room): number {
  let result = -1;
  _.forEach(room.memory.linked, function (linked) {
    if (linked.roomName) {
      let targetedRoom = Game.rooms[linked.roomName];
      if (targetedRoom && targetedRoom.controller && Game.time - (linked.lastSpawn || 0) > CREEP_LIFE_TIME) {
        result = spawnGenericCreep(
          spawn,
          room,
          CREEP_RESERVIST,
          getBodyPattern(room, CREEP_RESERVIST),
          getBodyLimit(room, CREEP_RESERVIST),
          CREEP_RESERVIST_DEFAULT_NUMBER,
          {
            memory: new ReservistMemory(room, targetedRoom.controller)
          }
        );
        // The harvester is spawned, no need to continue the forEach
        if (result == OK) {
          // Set the time code when the Harvester was spawn on the source, in memory
          linked.lastSpawn = Game.time;
          return false;
        }
      }
    }
    return true;
  });
  return result;
}
/**
 * Generate a new creep 'Builder'.
 * @param spawn spawn try to do the action of spawn a `Builder`
 * @param room Room where the spawn and the creep is. Use to initialise the `Builder`
 * @returns spawning statut
 * @version 1.0
 */
function spawnBuilder(spawn: StructureSpawn, room: Room): number {
  let result = -1;
  // If there are nothing to build, do nothing
  if (Object.keys(room.memory.constructionsSites).length === 0) {
    return ERR_NOTHING_TO_DO;
  }
  // FIXME : Body a rendre paramettrable
  result = spawnGenericCreep(
    spawn,
    room,
    CREEP_BUILDER,
    getBodyPattern(room, CREEP_BUILDER),
    getBodyLimit(room, CREEP_BUILDER),
    CREEP_BUILDER_DEFAULT_NUMBER,
    {
      memory: new BuilderMemory(room, room.storage)
    }
  );
  return result;
}
/**
 * Generate a new creep 'Upgrader'.
 * @param spawn spawn try to do the action of spawn a `Upgrader`
 * @param room Room where the spawn and the creep is. Use to initialise the `Upgrader`
 * @returns spawning statut
 * @version 1.0
 */
function spawnUpgrader(spawn: StructureSpawn, room: Room): number {
  let result = -1;
  let link: StructureLink | undefined;
  let structureLinksDestination = _.filter(room.memory.structures, function (structure) {
    return structure.type === STRUCTURE_LINK && structure.linkOrigine === false;
  });
  if (structureLinksDestination.length > 0) {
    link = <StructureLink>Game.getObjectById(structureLinksDestination[0].id);
  }
  result = spawnGenericCreep(
    spawn,
    room,
    CREEP_UPGRADER,
    getBodyPattern(room, CREEP_UPGRADER, link),
    getBodyLimit(room, CREEP_UPGRADER, link),
    CREEP_UPGRADER_DEFAULT_NUMBER,
    {
      memory: new UpgraderMemory(room, room.storage, link)
    }
  );
  return result;
}

/**
 * @description Generate a new creep with all of his information needed.
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
 * @version 1.0
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
  // FIXME : Cette appel, lors de sa première exécution prend 0,9 CPU... (cas du Colonist
  let max = _.get(room.memory.consus, role, defaultConsus);
  // How many creep already exist in this room with this role
  let existingCreeps = _.filter(
    Game.creeps,
    (creep: Harvester | Upgrader | Colonist | Builder | Scout | Repairman | Manager) =>
      creep.memory.role == role && creep.memory.homeRoomName == room.name
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
    let analyseCPUStart = Game.cpu.getUsed();
    let spawns: List<StructureSpawn> = <List<StructureSpawn>>room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_SPAWN }
    });

    // Extract all spawn available to be used
    spawns = _.filter(spawns, (s) => !s.spawning);

    // No spawn here,
    if (!spawns.length) {
      let analyseCPUEnd = Game.cpu.getUsed();
      Logger.debug("Spawner execution use : " + (analyseCPUEnd - analyseCPUStart));
      return;
    }

    // Use the first spawn available
    let spawn: StructureSpawn = spawns[0];

    // Spawn a creep 'colonist'
    if (spawnColonist(spawn, room) == OK) {
      let analyseCPUEnd = Game.cpu.getUsed();
      Logger.debug("Spawner execution use : " + (analyseCPUEnd - analyseCPUStart));
      return;
    }

    // Spawn a creep 'harvester'
    if (spawnHarvester(spawn, room) == OK) {
      let analyseCPUEnd = Game.cpu.getUsed();
      Logger.debug("Spawner execution use : " + (analyseCPUEnd - analyseCPUStart));
      return;
    }

    // Spawn a creep 'builder'
    if (spawnBuilder(spawn, room) == OK) {
      let analyseCPUEnd = Game.cpu.getUsed();
      Logger.debug("Spawner execution use : " + (analyseCPUEnd - analyseCPUStart));
      return;
    }

    // Spawn a creep 'upgrader'
    if (spawnUpgrader(spawn, room) == OK) {
      let analyseCPUEnd = Game.cpu.getUsed();
      Logger.debug("Spawner execution use : " + (analyseCPUEnd - analyseCPUStart));
      return;
    }
    // Spawn a creep 'harvester'
    if (spawnRepairman(spawn, room) == OK) {
      let analyseCPUEnd = Game.cpu.getUsed();
      Logger.debug("Spawner execution use : " + (analyseCPUEnd - analyseCPUStart));
      return;
    }
    if (spawnCarrier(spawn, room) == OK) {
      let analyseCPUEnd = Game.cpu.getUsed();
      Logger.debug("Spawner execution use : " + (analyseCPUEnd - analyseCPUStart));
      return;
    }
    if (spawnManager(spawn, room) == OK) {
      let analyseCPUEnd = Game.cpu.getUsed();
      Logger.debug("Spawner execution use : " + (analyseCPUEnd - analyseCPUStart));
      return;
    }

    if (spawnInfantry(spawn, room) == OK) {
      let analyseCPUEnd = Game.cpu.getUsed();
      Logger.debug("Spawner execution use : " + (analyseCPUEnd - analyseCPUStart));
      return;
    }

    if (spawnReservist(spawn, room) == OK) {
      let analyseCPUEnd = Game.cpu.getUsed();
      Logger.debug("Spawner execution use : " + (analyseCPUEnd - analyseCPUStart));
      return;
    }
    // Spawn a creep 'scout'
    // if (spawnScout(spawn, room) == OK) {
    //   let analyseCPUEnd = Game.cpu.getUsed();
    //   Logger.debug("Spawner execution use : " + (analyseCPUEnd - analyseCPUStart));
    //   return;
    // }
    let analyseCPUEnd = Game.cpu.getUsed();
    Logger.debug("Spawner execution use end: " + (analyseCPUEnd - analyseCPUStart));
  }
};

export default spawners;
