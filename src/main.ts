import ErrorMapper from "./utils/ErrorMapper";
import { GameLoop } from "./gameLoop";
import { Logger } from "./utils/Logger";

var gameLoop: GameLoop;
function unwrappedLoop() {
  let startAnalyseCPU = Game.cpu.getUsed();
  Logger.info("Current game tick is" + Game.time);
  if (gameLoop != null) {
    gameLoop.tick();
  } else {
    Logger.info("Initialize game");
    gameLoop = new GameLoop();
  }
  let endAnalyseCPU = Game.cpu.getUsed();
  Logger.debug("Total CPU used : " + (endAnalyseCPU - startAnalyseCPU));
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
const loop = ErrorMapper.wrapLoop(unwrappedLoop);

export { loop, unwrappedLoop };
