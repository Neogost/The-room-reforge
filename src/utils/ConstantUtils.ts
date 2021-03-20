// =========================== CREEP TYPE ====================
export const CREEP_HARVESTER = "harvester";
export const CREEP_COLONIST = "colonist";
export const CREEP_BUILDER = "builder";
export const CREEP_UPGRADER = "upgrader";
export const CREEP_REPAIRMANS = "repairmans";
export const CREEP_CARRIER = "carrier";
export const CREEP_MANAGER = "manager";
export const CREEP_SCOUT = "scout";
export const CREEP_RESERVIST = "reservist";
export const CREEP_INFANTRY = "infantry";

// =========================== CREEP DEFAULT ====================
export const CREEP_HARVESTER_DEFAULT_NUMBER = 0;
export const CREEP_COLONIST_DEFAULT_NUMBER = 5;
export const CREEP_BUILDER_DEFAULT_NUMBER = 1;
export const CREEP_UPGRADER_DEFAULT_NUMBER = 2;
export const CREEP_REPAIRMANS_DEFAULT_NUMBER = 0;
export const CREEP_CARRIER_DEFAULT_NUMBER = 0;
export const CREEP_MANAGER_DEFAULT_NUMBER = 1;
//
export const CREEP_INFANTRY_DEFAULT_NUMBER = 0;
export const CREEP_SCOUT_DEFAULT_NUMBER = 0;
export const CREEP_RESERVIST_DEFAULT_NUMBER = 0;

// =========================== CREEP BODY PART =====================
export const DEFAULT_BODY = [WORK, CARRY, MOVE]; // 200 (but 300 minimal to spawn)
export const DEFAULT_LIMIT = 8;

export const MANAGER_BODY = [CARRY, MOVE]; // 100 (but 300 minimal to spawn)
export const MANAGER_LIMIT = 8;

export const RESERVIST_LIMIT = 1;
export const RESERVIST_BODY = [MOVE, MOVE, CLAIM, CLAIM]; // 1300

export const HARVESTER_MINIMAL_BODY = [WORK, CARRY, MOVE]; // 200 (but 300 minimal to spawn)
export const HARVESTER_MINIMAL_LIMIT = 5;
export const HARVESTER_DEDICATED_BODY = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]; // 800 energy
export const HARVESTER_DEDICATED_LIMIT = 1;

export const CARRIER_DEDICATED_BODY = [
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY
]; // 300 energy
export const CARRIER_DEDICATED_LIMIT = 5;

export const UPGRADER_MINIMAL_BODY = [WORK, CARRY, MOVE]; // 200 (but 300 minimal to spawn)
export const UPGRADER_MINIMAL_LIMIT = 5;
export const UPGRADER_DEDICATED_BODY = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE]; // 400 energy
export const UPGRADER_DEDICATED_LIMIT = 1;

export const REPAIRMAN_MINIMAL_BODY = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
export const REPAIRMAN_DMINIMAL_LIMIT = 5;

export const SCOUT_BODY = [MOVE, MOVE]; // 100 (but 300 minimal to spawn)
export const SCOUT_LIMIT = 1;

export const INFANTRY_BODY = [ATTACK, MOVE];
export const INFANTRY_LIMIT = 8;
// =========================== CREEP ERROR CODE ====================
export const ERR_NO_TARGET = -1000;
export const ERR_NOT_ALREADY_IN_RANGE = -1001;
export const ERR_NO_CREEP_SELECTED = -1002;
export const ERR_CANT_MOVE = -1003;
export const ERR_NO_AVAILABLE_CAPACITY = -1005;
export const ERR_NOT_IN_RIGHT_ROOM = -1006;
export const ERR_NO_RESOURCE = -1007;
export const ERR_NO_WORKING_STATION = -1008;
export const ERR_NOTHING_TO_DO = -1009;

// =========================== SPAWN ERROR CODE ====================
export const ERR_FULL_CREEP: number = -200;
export const ERR_NO_SPAWN_SELECTED: number = -210;
export const ERR_NO_ROLE_FOR_CREEP: number = -220;
export const ERR_NO_ROOM_SELECTED: number = -240;
export const NOT_AVAILABLE_NOW: number = -230;
export const SCOUT_FREQUENCY = 2500;

// =========================== ROOM SCAN ERROR CODE ================
export const NO_FULL_SCAN_DONE = -1004;
export const NO_FULL_SCAN_DONE_LINKED = -1008;
export const NEED_A_SCAN = 5000;

// =========================== STORAGE =============================
/** First level of confidence in the room's energy store */
export const FIRST_LEVEL_STORAGE_STOCK = 500;
export const SECOND_LEVEL_STORAGE_STOCK = 1000;
export const THIRD_LEVEL_STORAGE_STOCK = 10000;

// =========================== TYPE OF SOURCE FOR OPTION ===========
export const SOURCE_SOURCE_OPTION = "source";
export const MINERAL_SOURCE_OPTION = "mineral";
export const DEPOSIT_SOURCE_OPTION = "deposit";

// =========================== FLAG
export const PATTERN_ORIGIN_ROOM = new RegExp("^[WENS0-9]{4,}");
export const PATTERN_TARGET_ROOM = new RegExp("[WENS0-9]{4,}$");
// =========================== TRAVELER
export const TRAVELER_MOVE = 1000;
// Divers, a voir si je dois le conserver

export const CONSTRUCTION_SITE_TYPE: string = "constructionSite";
export const STRUCTURE_TYPE: string = "structure";
export const SOURCE_TYPE: string = "source";
export const CONTROLER_TYPE: string = "controller";

// Settings Constants
export const SETTINGS_RAMPARTS_BY_LEVEL = [
  { level: 1, maxHits: 0 },
  { level: 2, maxHits: 20000 },
  { level: 3, maxHits: 50000 },
  { level: 4, maxHits: 100000 },
  { level: 5, maxHits: 500000 },
  { level: 6, maxHits: 3000000 },
  { level: 7, maxHits: 5000000 },
  { level: 8, maxHits: 1000000 }
] as RampartSettings[];
