import "prototypes/room";
import "prototypes/roomPosition";
import "prototypes/creep";
import { Logger } from "./utils/Logger";
import { Initializer } from "./utils/Initialisazer";
import { RoomSourceUtils } from "./utils/room/RoomSourceUtils";
import { RoomConstructionSiteUtils } from "./utils/room/RoomConstructionSiteUtils";
import { RoomCreepUtils } from "./utils/room/RoomCreepUtils";
import { RoomStructureUtils } from "./utils/room/RoomStructureUtils";
import spawners from "./rooms/spawner";
import {
  CREEP_COLONIST,
  CREEP_BUILDER,
  CREEP_UPGRADER,
  CREEP_HARVESTER,
  CREEP_SCOUT,
  SOURCE_TYPE,
  CREEP_REPAIRMANS,
  CREEP_CARRIER
} from "./utils/ConstantUtils";
import roleColonist, { Colonist } from "./roles/colony/colonist";
import roleBuilder, { Builder } from "./roles/colony/builider";
import towers from "./rooms/tower";
import roleUpgrader from "./roles/colony/upgrader";
import { Upgrader } from "./roles/colony/upgrader";
import roleHarvester, { Harvester } from "./roles/colony/harvester";
import roleScout from "./roles/army/scout";
import { Scout } from "./roles/army/scout";
import roleReparman, { Repairman } from "./roles/colony/repairman";
import roleCarrier, { Carrier } from "./roles/colony/carrier";
import { CREEP_MANAGER } from "./utils/ConstantUtils";
import roleManager, { Manager } from "./roles/colony/manager";
import { ConsusManagement } from "./directive/ConsusManagement";
import { Flags } from "./flags/Flags";
import { BaseCircle } from "./base/circle";
import { List } from "lodash";

/**
 * Definie the game structure execution. Each tick is an instance of this object. the `GameLoop` do everything is needed.
 *
 */
export class GameLoop {
  /**
   * Initialize the game and all the properties needed at the start of it.
   */
  constructor() {
    // Initialize memory management
    this.initialize();

    let foundTask = this.loadTasks();

    // Scan rooms to find informations and tasks to do
    Logger.info("First Scan");
    this.scanForNewTasks(true);

    // Save the state, do memory management
    this.save();
  }

  /**
   * Action execute at each tick of the game.
   */
  public tick() {
    // Scan rooms to find informations and tasks to do
    this.scanForNewTasks(Game.time % 50 === 0);
    // Execute task
    this.executeAllTasks();
    // Save the state, do memory management
    this.save();
  }

  /**
   * Initialize the structure of the game. Exécuted only one time.
   */
  public initialize() {
    // Initialize Settings
    Initializer.initializeSettings();

    Object.values(Game.rooms).forEach((room: Room) => {
      if (room.controller?.my) {
        // Initialize default memory
        Initializer.initializeAllProperties(room);
      }
    });
    Logger.info("End initiliazation");
  }

  /**
   * Scan the game to find new task to do. Creeps tasks, rooms task, flags tasks...
   * @param define the necessarity to do the job
   */
  public scanForNewTasks(define: boolean) {
    if (Game.cpu.bucket == 10000) {
      Game.cpu.generatePixel();
    }
    // Scan room to update/find source of energy/mineral/deposit
    // scan only if define is true
    if (define) {
      _.forEach(Game.rooms, (room) => {
        if (room.controller && room.controller.my) {
          RoomSourceUtils.scan(room);
          RoomConstructionSiteUtils.scan(room);
          RoomCreepUtils.scanHostile(room);
          RoomStructureUtils.scan(room);

          this.executeBasePattern(room);
        }
      });
    }
  }

  /**
   * Execute tasks for each entity in the game
   */
  public executeAllTasks() {
    // Flag Task
    this.executeFlagsTasks();

    // Structure Task
    this.executeStructureTask();

    // Creep Task
    this.executeCreepTask();
  }

  /**
   * Load task who are stock in memory.
   * @returns statut of the loading.
   */
  public loadTasks(): boolean {
    return true;
  }

  /**
   * Save the game changement during the tick
   */
  public save() {
    // Automatically delete memory of missing creeps
    Object.keys(Memory.creeps)
      .filter((name) => !(name in Game.creeps))
      .forEach((name) => delete Memory.creeps[name]);
  }

  /**
   * Execute flags action. A flag action is the name of a flag with '.' who delimitated arguments
   */
  public executeFlagsTasks() {
    _.forEach(Game.flags, (flag: Flag) => {
      Flags.execute(flag);
    });
  }

  private executeStructureTask() {
    _.forEach(Game.rooms, (room: Room) => {
      if (room.controller && room.controller.my) {
        spawners.run(room);
        towers.run(room);
      }
    });
  }

  private executeBasePattern(room: Room) {
    let controlerStatut = _.filter(room.memory.structures, function (s) {
      return s.type === STRUCTURE_CONTROLLER;
    })[0];

    if (controlerStatut.levelUp) {
      // Manage consus
      ConsusManagement.manageConsus(room);
      // generate base
      let spawns: List<StructureSpawn> = <List<StructureSpawn>>room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_SPAWN, name: "Spawn1" }
      });
      if (spawns) {
        let spawn = spawns[0];
        let pos = spawn.pos;
        pos.x = pos.x + 1;
        pos.y = pos.y - 1;
        let autoBase = new BaseCircle(pos, room);
        autoBase.buildBase(room.controller.level);
      }
    }
  }
  /**
   * @description Manage the execution of creep. Each creep as a role. Role drive the action of a creep.
   */
  private executeCreepTask() {
    _.forEach(Game.creeps, (creep) => {
      switch (creep.memory.role) {
        case CREEP_COLONIST:
          roleColonist.run(creep as Colonist);
          return;
        case CREEP_BUILDER:
          roleBuilder.run(creep as Builder);
          return;
        case CREEP_UPGRADER:
          roleUpgrader.run(creep as Upgrader);
          return;
        case CREEP_HARVESTER:
          roleHarvester.run(creep as Harvester);
          return;
        case CREEP_REPAIRMANS:
          roleReparman.run(creep as Repairman);
          return;
        case CREEP_CARRIER:
          roleCarrier.run(creep as Carrier);
          return;
        case CREEP_MANAGER:
          roleManager.run(creep as Manager);
          return;
        case CREEP_SCOUT:
          roleScout.run(creep as Scout);
          return;
        default:
          break;
      }
    });
  }
}
