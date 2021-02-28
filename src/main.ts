import ErrorMapper from "./utils/ErrorMapper";
import { GameLoop } from "./gameLoop";

var gameLoop: GameLoop;

function unwrappedLoop() {
  console.log(`Current game tick is ${Game.time}`);
  if (gameLoop != null) {
    gameLoop.tick();
  } else {
    console.log("Initialize game");
    gameLoop = new GameLoop();
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
const loop = ErrorMapper.wrapLoop(unwrappedLoop);

export { loop, unwrappedLoop };
