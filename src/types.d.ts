interface Room {
  /**
   * Initialize le consensus of creep in a room.
   *
   * If `consus` is already initialize, do nothing
   */
  initializeConsus(): void;

  /**
   * Initialize the linked room. Linked room is a room who is link to this room and contains
   * some element of game play like sources, structures, constructions sites. The link allows
   *  to analyze the content of the linked room at the same time as the main room.
   *
   * If `linked`is already initialize, do nothing
   */
  initializeLinkedRoom(): void;
  /**
   * Initialize the structures links in a room.
   *
   * If `links` is already initialize, do nothing
   */
  initializeLinks(): void;

  initializeScoutedRoom(): void;
  /**
   * Link an other room to this room.
   *
   * @param roomName Room who will be link to the room
   */
  addLinked(roomName: string): void;

  addScouted(roomName: string): void;

  removeScouted(roomName: string): void;
  /**
   * Unlink a linked room to the romm
   *
   * @param roomName Room who will be unlinked to the room
   */
  removeLinked(roomName: string): void;

  /**
   * Set the number of creeps for a role
   * @param role role to set value
   * @param value autorised number of creep for the role
   */
  setConsus(role: string, value: number): void;

  /**
   * Clean the memory from structure who not exist
   */
  saveStructures(): void;

  defend(): void;

  isLinkedRoom(): boolean;
}

interface SourceMemoryMap<T> {
  [index: string]: T;
}
interface ConstructionSiteMemoryMap<T> {
  [index: string]: T;
}
interface StructureMemoryMap<T> {
  [index: string]: T;
}
interface LinkedMemoryMap<T> {
  [index: string]: T;
}
interface ScoutMemory {
  [index: string]: ScoutOptions;
}

interface HostileCreepMemoryMap<T> {
  [index: string]: T;
}
interface StructureLinkMemory {
  [index: string]: StructureLinkOptions;
}
interface RoomMemory {
  /** Structures in the room */
  structures: StructureMemoryMap<StructureOptions>;
  /** Sources in the room */
  sources: SourceMemoryMap<SourcesOptions>;
  /** Constructions sites in the room */
  constructionsSites: ConstructionSiteMemoryMap<ConstructionSiteOptions>;
  /** Concensus of creep in the room */
  consus: ConsusOptions;
  /** Linked room to the room */
  linked: LinkedMemoryMap<LinkedRoomOptions>;
  /** Scouted room by the room */
  // FIXME : A faire quand je serais au scouting
  scouted: ScoutMemory;
  /** Links in the room */
  links: StructureLinkMemory;
  /** Hostile creep in the room */
  creeps: HostileCreepMemoryMap<HostileCreepOptions>;
  // ------ Scouted -------
  /** Last time where the room was scouted */
  lastScan: number;
}

interface RoomPosition {
  /**
   * Give the cellule in fron of one
   */
  getNearByPositions(): Array<RoomPosition>;

  /**
   * Give the free cell in front of a cell. A free cell is a cell who is not a WALL or CREEP
   */
  getOpenPositions(): Array<RoomPosition>;
}

interface Creep {
  /**
   * Harvest a source of energy in the current room.
   *
   * @returns Statut of the harvest
   */
  harvestEnergy(): number;

  /**
   * Permet de trouver une sources d'énergie disponible pour l'assigner a un creeps.
   *
   * Par défaut, la source retournée est celle stocké en mémoire dans _source_ ou _sourceId_.
   *
   * Si aucune source n'est affecté dans _sourceId_, identifie une source.
   *
   * La source qui est retournée est aussi stocké en mémoire dans _source_.
   * @returns une source d'énergie
   */
  findEnergySource(): Source | undefined;

  /**
   * Withdraw energy from the storage of the room
   */
  withdrawFromStorage(): void;
  /**
   * Move for or build a target
   * @param targetId the id of the target
   */
  moveToBuild(targetId: string, room: Room): void;

  /**
   * Analyse a room to find constructions who are affiliated to it.
   * @param room The room who will be analysate to find the constructions sites
   * @returns The target id or null if no one is find
   */
  findConstructionSites(room: Room): string | null;
}

interface CreepMemory {
  /** Job  */
  role: string;

  /** Position of the home's rooms */
  homeRoomName: string;

  /** Mouvement, used by Traveler */
  _trav: any;
  _travel: any;
}

interface Memory {
  uuid: number;
  empire?: any;
  settings: Settings;
}

// `global` extension samples
declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Global {}
}

interface RoomMemory {
  avoid: any;
  /** Is my room or a linked Room */
  mine?: boolean;
}
