import { Logger } from "../utils/Logger";
import {
  SOURCE_TYPE,
  SECOND_LEVEL_STORAGE_STOCK,
  THIRD_LEVEL_STORAGE_STOCK,
  FIRST_LEVEL_STORAGE_STOCK
} from "../utils/ConstantUtils";

/**
 * @author Neogost
 * @description Manage the population of a room. Define and adapte with inteligence the amount of each creep in a room.
 * @version 1.0
 */
export class ConsusManagement {
  public static manageConsus(room: Room) {
    let analyseCPUStart = Game.cpu.getUsed();
    this.manageColonist(room);
    this.manageManager(room);
    this.manageHarvester(room);
    this.manageCarrier(room);
    this.manageRepairman(room);

    let analyseCPUEnd = Game.cpu.getUsed();
    Logger.debug("Manage consus execution use :" + (analyseCPUEnd - analyseCPUStart));
  }
  /**
   * @description Adapt the amount of creep with the role `Repairmans` in the room
   * @param room Room to manage and adapte consus of `Repairmans`
   */
  private static manageRepairman(room: Room) {
    if (room.memory.linked) {
      room.memory.consus.repairmans = 1;
    }
  }

  /**
   * @description Adapt the amount of creep with the role `Colonist` in the room
   * @param room Room to manage and adapte consus of `Colonist`
   */
  private static manageColonist(room: Room) {
    // Does the room is at minimum level auto suffisant ?
    if (room.controller && room.controller.level >= Memory.settings.colonisation.levelToMaintain) {
      // Does the storage is build ?
      if (room.storage) {
        // The stock is low but suffisant to reduce colonist
        if (room.storage.store[RESOURCE_ENERGY] < SECOND_LEVEL_STORAGE_STOCK) {
          room.memory.consus.colonist = 3;
        }
        // The stock is medium, suffisiant to reduce colonist againt
        else if (room.storage && room.storage.store[RESOURCE_ENERGY] < THIRD_LEVEL_STORAGE_STOCK) {
          room.memory.consus.colonist = 1;
        }
        // The stock is hight, remove all colonist
        else {
          room.memory.consus.colonist = 0;
        }
      }
    }
    // TODO : Ajouter une gestion de l'expension de l'empire.
    // Faire modifier le nombre de colonist de la room en fonction de la conquete a effectuer
    // Et manager celle-ci jusqu'a la création d'une colonie autonome en création de creep.
  }

  /**
   * @description Adapt the amount of creep with the role `Colonist` in the room
   * @param room Room to manage and adapte consus of `Colonist`
   */
  private static manageManager(room: Room) {
    let storage = room.storage;
    if (storage && storage.store[RESOURCE_ENERGY] > FIRST_LEVEL_STORAGE_STOCK) {
      room.memory.consus.manager = 1;
    }
    let nbExtensionInRoom = _.filter(room.memory.structures, function (s) {
      return s.type === STRUCTURE_EXTENSION;
    });
    if (nbExtensionInRoom.length > 20) {
      room.memory.consus.manager = 2;
    }
  }

  /**
   * @description Adapt the amount of creep with the role `Harvester` in the room
   * @param room Room to manage and adapte consus of `Harvester`
   */
  private static manageHarvester(room: Room) {
    // Adapte concus of harvester following source with linked room
    let nbSourcesAvailable = _.filter(room.memory.sources, function (s) {
      return s.type === SOURCE_TYPE;
    });
    room.memory.consus.harvester = nbSourcesAvailable.length;
  }
  /**
   * @description Adapt the amount of creep with the role `Carrier` in the room
   * @param room Room to manage and adapte consus of `Carrier`
   */
  private static manageCarrier(room: Room) {
    // Adapte concus of carrier following container available with linked room
    let nbContainerAvailable = _.filter(room.memory.structures, function (s) {
      return s.type === STRUCTURE_CONTAINER;
    });
    room.memory.consus.carrier = nbContainerAvailable.length;
  }
}
