import { TaskHarvest } from "./TaskHarvest";

/**
 * Define all type of task than a creep can do.
 */
export class Tasks {
  public static harvest(creep: Creep, target: string): number {
    return TaskHarvest.doTask(creep, target);
  }
}
