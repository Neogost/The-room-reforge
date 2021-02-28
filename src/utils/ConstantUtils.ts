// ------------------------------------------------
// LIST OF ALL ERROR WHO THE ROOMS ENTITY CAN THROW
// ------------------------------------------------

// Creep's action
export const ERR_NO_TARGET = -1000;
export const ERR_NOT_ALREADY_IN_RANGE = -1001;
export const ERR_NO_CREEP_SELECTED = -1002;
export const ERR_CANT_MOVE = -1003;
export const ERR_NO_AVAILABLE_CAPACITY = -1005;
export const ERR_NOT_IN_RIGHT_ROOM = -1006;
export const ERR_NO_RESOURCE = -1007;

// Spawn's action
export const ERR_FULL_CREEP: number = -200;
export const ERR_NO_SPAWN_SELECTED: number = -210;
export const ERR_NO_ROLE_FOR_CREEP: number = -220;
export const ERR_NO_ROOM_SELECTED: number = -240;
export const NOT_AVAILABLE_NOW: number = -230;

//
export const NO_FULL_SCAN_DONE = -1004;
export const NO_FULL_SCAN_DONE_LINKED = -1008;
export const NEED_A_SCAN = 5000;

// Traveler
export const TRAVELER_MOVE = 1000;

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
