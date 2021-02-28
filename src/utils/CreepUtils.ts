/**
 * @author neogost
 * Help to use the entity `Creep`
 *
 * @version 1.0
 */
export class CreepUtils {
  /**
   * Verify if the creep can work. Check if the body of the creep containt `WORK` element.
   * @version 1.0
   * @param creep Creep to verify
   * @returns true if the creep can work, else false
   */
  public static canWork(creep: Creep): boolean {
    return !_.isEmpty(_.filter(creep.body, (element) => element.type === WORK));
  }

  public static canStore(creep: Creep): boolean {
    return creep.store.getFreeCapacity() > 0;
  }
}
