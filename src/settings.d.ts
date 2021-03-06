/**
 * Setting of the IA. Define all commun properties used to administrate the IA.
 */
interface Settings {
  /** Log Level available.  */
  logLevel: number;
  /** Max heal point autorise for rampart by level of RoomController*/
  // FIXME : Change type
  rampartMaxHits: Array<RampartSettings>;
  /** List of player who are set as Ally */
  allies?: Array<string>;
  /** List of player who are set as Enemy */
  enemies?: Array<string>;
  /** Indicator for repairman */
  repairIndicator: number;
}

interface LinkedRoomOptions {}

interface ScoutOptions {}

interface LinkOptions {}
/**
 * Define the options of a link. A Link can be a source of energy or an storage
 */
interface StructureLinkOptions {
  /** Give energy to another link */
  isSource: boolean;
  /** Target link to transfert energy */
  targetId?: string;
}

/**
 * Setting and configuration for Rampart
 */
interface RampartSettings {
  /** Level of the RoomController */
  level: number;
  /** Number of hits max for a rampart by level */
  maxHits: number;
}

/**
 * Define the information in memory for structure in a room.
 * For a room who is mine, room's structure include linkedRoom structure
 */
interface StructureOptions {
  /** Structure resquest healing */
  needRepair: boolean;
  /** The room name where the structure is */
  roomName: string;
  /** Owner of the structure */
  owner: string;
  /** The structure Type*/
  type: StructureConstant;
  /** Last ingame time where a creep was spawn for this structure */
  lastSpawn?: number;
}

/**
 * Structure of the Constructions site options in memory room
 */
interface ConstructionSiteOptions {
  /** Nome of the room where is the constructions sites */
  roomName: string;
  /** Owner of the structure */
  owner: string;
  /** The structure Type*/
  type: StructureConstant;
}

/**
 * Structure of the Sources/Deposit/Minerals options in memory room
 */
interface SourcesOptions {
  /** Last ingame time where a creep was spawn for this structure */
  lastSpawn?: number;
  /** Nome of the room where is the constructions sites */
  roomName: string;
  /** Type of the source : SOURCE/MINERAL/DEPOSIT */
  type: string;
}

/**
 * Structure of the Creep options in memory room
 */
interface HostileCreepOptions {
  /** Nome of the room where is the constructions sites */
  roomName: string;
  /** owner of the creep */
  owner: string;
  /** bodypart of the creep */
  body: Array<BodyPartDefinition>;
  /** Bonus applied on the creep */
  effect: RoomObjectEffect[];

  /** The current amount of hit points of the creep. */
  hits: number;
  /** The maximum amount of hit points of the creep. */
  hitsMax: number;
  /** A unique object identificator. You can use Game.getObjectById method to retrieve an object instance by its id. */
  id: Id<Creep>;

  /** The remaining amount of game ticks after which the creep will die. */
  tickToLive: number;
  /** Does the creep is hostile to me ?  */
  hostile: boolean;
}

/**
 * Structure of an effect on a creep. An effect is a buff who upgrade a creep.
 */
interface EffectsOptions {
  /** Effect ID of the applied effect. Can be either natural effect ID or Power ID. */
  effect: number;
  /** Power level of the applied effect. Absent if the effect is not a Power effect. */
  level?: number;
  /** How many ticks will the effect last. */
  tricksRemaining: number;
}
/**
 * Structure of the consus options of a main room
 */
interface ConsusOptions {
  // Colony role :
  workers: number;
  builders: number;
  upgraders: number;
  repairmans: number;
  managers: number;

  // Empire role :
  helpers: number;
  claimers: number;

  // Army role :
  scouts: number;
  infantrymans: number;
}
