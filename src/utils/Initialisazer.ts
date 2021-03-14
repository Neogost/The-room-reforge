import { Logger } from "./Logger";
import {
  CREEP_BUILDER_DEFAULT_NUMBER,
  CREEP_CARRIER_DEFAULT_NUMBER,
  CREEP_COLONIST_DEFAULT_NUMBER,
  CREEP_HARVESTER_DEFAULT_NUMBER,
  CREEP_MANAGER_DEFAULT_NUMBER,
  CREEP_REPAIRMANS_DEFAULT_NUMBER,
  CREEP_SCOUT_DEFAULT_NUMBER,
  CREEP_UPGRADER_DEFAULT_NUMBER,
  SETTINGS_RAMPARTS_BY_LEVEL
} from "./ConstantUtils";

/**
 * Provides methods for initializing or resetting values ​​in memory.
 */
export class Initializer {
  /**
   * Initialize all properties to a room
   * @param room room to initialize
   */
  public static initializeAllProperties(room: Room) {
    if (!this.initializeConsus(room)) {
      Logger.warning(room.name + " - Consus is already exist");
    } else {
      Logger.info(room.name + " - Consus initialized");
    }

    if (!this.initializeLinkedRoom(room)) {
      Logger.warning(room.name + " - LinkedRoom is already exist");
    } else {
      Logger.info(room.name + " - LinkedRoom initialized");
    }

    if (!this.initializeLinks(room)) {
      Logger.warning(room.name + " - links is already exist");
    } else {
      Logger.info(room.name + " - links initialized");
    }

    if (!this.initializeStructures(room)) {
      Logger.warning(room.name + " - structures is already exist");
    } else {
      Logger.info(room.name + " - structures initialized");
    }

    if (!this.initializeConstructionsSites(room)) {
      Logger.warning(room.name + " - constructionsSites is already exist");
    } else {
      Logger.info(room.name + " - constructionsSites initialized");
    }

    if (!this.initializeSources(room)) {
      Logger.warning(room.name + " - Sources is already exist");
    } else {
      Logger.info(room.name + " - Sources initialized");
    }

    if (!this.initializeScouted(room)) {
      Logger.warning(room.name + " - Scouted is already exist");
    } else {
      Logger.info(room.name + " - Scouted initialized");
    }

    if (!this.initializeCreeps(room)) {
      Logger.warning(room.name + " - Creeps is already exist");
    } else {
      Logger.info(room.name + " - Creeps initialized");
    }

    if (!this.initializeSettings()) {
      Logger.info("Settings initialized");
    }
  }

  /**
   * Initialise the properties Consus to a room
   * @param room room to initialize
   */
  public static initializeConsus(room: Room): boolean {
    let statut: boolean = false;

    // If not exist, initialize
    if (!room.memory.consus) {
      _.set(room.memory, ["consus"], {
        // Colony
        colonist: CREEP_COLONIST_DEFAULT_NUMBER,
        harvester: CREEP_HARVESTER_DEFAULT_NUMBER,
        carrier: CREEP_CARRIER_DEFAULT_NUMBER,
        upgrader: CREEP_UPGRADER_DEFAULT_NUMBER,
        builder: CREEP_BUILDER_DEFAULT_NUMBER,
        repairmans: CREEP_REPAIRMANS_DEFAULT_NUMBER,
        manager: CREEP_MANAGER_DEFAULT_NUMBER,

        // Empire
        helpers: 0,
        claimers: 0,

        // Army
        scouts: CREEP_SCOUT_DEFAULT_NUMBER,
        infantrymans: 0
      } as ConsusOptions);
      statut = true;
    }
    return statut;
  }

  /**
   * Initialise the properties LinkedRoom to a room
   * @param room room to initialize
   */
  public static initializeLinkedRoom(room: Room): boolean {
    let statut: boolean = false;

    // If not exist, initialize
    if (!room.memory.linked) {
      _.set(room.memory, ["linked"], {});
      statut = true;
    }
    return statut;
  }

  /**
   * Initialise the properties links to a room
   * @param room room to initialize
   */
  public static initializeLinks(room: Room): boolean {
    let statut: boolean = false;

    // If not exist, initialize
    if (!room.memory.links) {
      _.set(room.memory, ["links"], {} as StructureLinkOptions);
      statut = true;
    }
    return statut;
  }

  /**
   * Initialise the properties structures to a room
   * @param room room to initialize
   */
  public static initializeStructures(room: Room): boolean {
    let statut: boolean = false;

    // If not exist, initialize
    if (!room.memory.structures) {
      _.set(room.memory, ["structures"], {} as StructureOptions);
      statut = true;
    }
    return statut;
  }

  /**
   * Initialise the properties constructions sites to a room
   * @param room room to initialize
   */
  public static initializeConstructionsSites(room: Room): boolean {
    let statut: boolean = false;

    // If not exist, initialize
    if (!room.memory.constructionsSites) {
      _.set(room.memory, ["constructionsSites"], {} as ConstructionSiteOptions);
      statut = true;
    }
    return statut;
  }

  /**
   * Initialise the properties sources to a room
   * @param room room to initialize
   */
  public static initializeSources(room: Room): boolean {
    let statut: boolean = false;

    // If not exist, initialize
    if (!room.memory.sources) {
      _.set(room.memory, ["sources"], {} as SourcesOptions);
      statut = true;
    }
    return statut;
  }

  /**
   * Initialise the properties scouted to a room
   * @param room room to initialize
   */
  public static initializeScouted(room: Room): boolean {
    let statut: boolean = false;

    // If not exist, initialize
    if (!room.memory.scouted) {
      _.set(room.memory, ["scouted"], {});
      statut = true;
    }
    return statut;
  }

  /**
   * Initialise the properties creeps to a room
   * @param room room to initialize
   */
  public static initializeCreeps(room: Room): boolean {
    let statut: boolean = false;

    // If not exist, initialize
    if (!room.memory.creeps) {
      _.set(room.memory, ["creeps"], {});
      statut = true;
    }
    return statut;
  }
  /**
   * Initialize settings of the IA
   */
  public static initializeSettings(): boolean {
    let statut: boolean = false;
    if (!Memory.settings) {
      _.set(Memory, ["settings"], {
        logLevel: 1,
        rampartMaxHits: SETTINGS_RAMPARTS_BY_LEVEL,
        repairIndicator: 0.9,
        colonisation: { levelToMaintain: 2 }
      } as Settings);
      statut = true;
      Logger.info("Settings initialzed");
    }
    return statut;
  }
}
