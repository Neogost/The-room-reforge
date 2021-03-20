import { Builder } from "../roles/colony/builider";
import { Carrier } from "../roles/colony/carrier";
import { Colonist } from "../roles/colony/colonist";
import { Harvester } from "../roles/colony/harvester";
import { Manager } from "../roles/colony/manager";
import { Repairman } from "../roles/colony/repairman";
import { Upgrader } from "../roles/colony/upgrader";
import { TaskBuild } from "./TaskBuild";
import { TaskHarvest } from "./TaskHarvest";
import { TaskHarvestSomething } from "./TaskHarvestSomething";
import { TaskRefillToLink } from "./TaskRefillToLink";
import { TaskRefillToStorage } from "./TaskRefillToStorage";
import { TaskRepair } from "./TaskRepair";
import { TaskTransfertToContainer } from "./TaskTransfertToContainer";
import { TaskTransfertToEssential } from "./TaskTransfertToEssential";
import { TaskTransfertToStorage } from "./TaskTransfertToStorage";
import { TaskUpgrade } from "./TaskUpgrade";

/**
 * Define all type of task than a creep can do.
 */
export class Tasks {
  public static harvestSomething(creep: Colonist | Upgrader | Builder | Repairman, room: Room): number {
    return TaskHarvestSomething.doTask(creep, room);
  }
  public static harvest(creep: Harvester) {
    return TaskHarvest.doTask(creep);
  }

  public static buildSomething(creep: Colonist | Harvester | Builder, room: Room): number {
    return TaskBuild.doTask(creep, room);
  }

  public static upgradeController(
    creep: Colonist | Upgrader | Harvester,
    controller: StructureController | undefined
  ): number {
    return TaskUpgrade.doTask(creep, controller);
  }

  public static transfertToEssentialStructure(creep: Colonist | Harvester | Carrier, room: Room): number {
    return TaskTransfertToEssential.doTask(creep, room);
  }

  public static transfertToStorage(creep: Harvester | Carrier | Colonist, room: Room): number {
    return TaskTransfertToStorage.doTask(creep, room);
  }
  public static transfertToContainer(creep: Harvester): number {
    return TaskTransfertToContainer.doTask(creep);
  }
  public static repairSomething(creep: Repairman, room: Room): number {
    return TaskRepair.doTask(creep, room);
  }
  public static refillToStorage(creep: Repairman | Builder | Manager | Upgrader, room: Room): number {
    return TaskRefillToStorage.doTask(creep, room);
  }

  public static refillToLink(creep: Upgrader, room: Room): number {
    return TaskRefillToLink.doTask(creep, room);
  }
}
