import "prototypes/room";
import "prototypes/roomPosition";
import "prototypes/creep";
import { Logger } from "./utils/Logger";
import { Initializer } from "./utils/Initialisazer";
import { RoomSourceUtils } from "./utils/room/RoomSourceUtils";

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
    // Scan room to update/find source of energy/mineral/deposit
    _.forEach(Game.rooms, (room) => {
      RoomSourceUtils.scan(room);
    });
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
  public executeFlagsTasks() {}

  private executeStructureTask() {}

  private executeCreepTask() {}
}
