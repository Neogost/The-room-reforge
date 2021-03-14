import { TaskHarvestSomething } from "./TaskHarvestSomething";
import { Colonist } from "../roles/colony/colonist";
import { TaskBuild } from "./TaskBuild";
import { TaskUpgrade } from "./TaskUpgrade";
import { TaskTransfertToEssential } from "./TaskTransfertToEssential";
import { Harvester } from "../roles/colony/harvester";
import { Upgrader } from "../roles/colony/upgrader";
import { Builder } from "../roles/colony/builider";
import { Repairman } from "../roles/colony/repairman";
import { TaskRepair } from "./TaskRepair";
import { TaskRefillToStorage } from "./TaskRefillToStorage";
import { Carrier } from "../roles/colony/carrier";
import { TaskTransfertToStorage } from "./TaskTransfertToStorage";
import { Manager } from "../roles/colony/manager";

/**
 * Define all type of task than a creep can do.
 */
export class Tasks {
  public static harvestSomething(creep: Colonist | Upgrader | Builder | Repairman, room: Room): number {
    return TaskHarvestSomething.doTask(creep, room);
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

  public static repairSomething(creep: Repairman, room: Room): number {
    return TaskRepair.doTask(creep, room);
  }
  public static refillToStorage(creep: Repairman | Builder | Manager | Upgrader, room: Room): number {
    return TaskRefillToStorage.doTask(creep, room);
  }

  public static transfertToStorage(creep: Harvester | Carrier | Colonist, room: Room): number {
    return TaskTransfertToStorage.doTask(creep, room);
  }
}
