export class Logger {
  static level: number = 5;

  public static info(message: string): void {
    if (this.level >= 1) {
      console.log("<span style='color:green'>[INFO] " + message);
    }
  }

  public static warning(message: string): void {
    if (this.level >= 2) {
      console.log("<span style='color:orange'>[WARNING] " + message);
    }
  }

  public static error(message: string): void {
    if (this.level >= 1) {
      console.log("<span style='color:red'>[ERROR] " + message);
    }
  }

  public static debug(message: string): void {
    if (this.level >= 3) {
      console.log("<span style='color:yellow'>[DEBUG] " + message);
    }
  }

  public static analyseCpu(message: string): void {
    if (this.level >= 4) {
      console.log("[ANALYSE] " + message);
    }
  }
}
