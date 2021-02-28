export class Logger {
  static level: number = 5;

  public static info(message: string): void {
    if (this.level >= 1) {
      console.log("[INFO] " + message);
    }
  }

  public static warning(message: string): void {
    if (this.level >= 2) {
      console.log("[WARNING] " + message);
    }
  }

  public static error(message: string): void {
    if (this.level >= 1) {
      console.log("[ERROR] " + message);
    }
  }

  public static debug(message: string): void {
    if (this.level >= 3) {
      console.log("[DEBUG] " + message);
    }
  }

  public static analyseCpu(message: string): void {
    if (this.level >= 4) {
      console.log("[ANALYSE] " + message);
    }
  }
}
