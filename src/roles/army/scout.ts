import { SCOUT_FREQUENCY } from "../../utils/ConstantUtils";
import { Traveler } from "../../utils/Traveler";
import { RoomConstructionSiteUtils } from "../../utils/room/RoomConstructionSiteUtils";
import { RoomStructureUtils } from "../../utils/room/RoomStructureUtils";
import { RoomSourceUtils } from "../../utils/room/RoomSourceUtils";

/**
 * @description A buildder is there to build structure in a colony.
 * This creep is able to perform several types of actions such as harvesting, crafting and reload.
 *
 * A builder can do 3 type of task :
 * - Harvest energy : when there are no room storage resources available. He leaves to recover energy in order to continue to carry out his main activity
 * - Build : when there are structures to build, the builder will concentrate on building them as quickly as possible.
 * - Reload: when it has no more resources, it will refuel in priority in the storage so as not to have to take harvest time.
 *
 * when he has nothing to do, the creep lets himself die. Ideally, it should be produced only when it is needed: that is, when there is a need to build something !
 * @version 1,0
 * @author kevin desmay
 */
export interface Scout extends Creep {
  memory: ScoutMemory;
}

export class ScoutMemory implements CreepMemory {
  role: string = "scout";
  homeRoomName: string;
  /** Where the creep have to go to work */
  workingStation: string | undefined;

  _trav: any;
  _travel: any;

  /**
   * Initialize a Builder.
   * @param currentRoom Room where the creep is actualy
   * @param storage Storage who are a reference to take energy for this creep
   */
  constructor(currentRoom: Room) {
    this.homeRoomName = currentRoom.name;
    this.workingStation = currentRoom.name;
  }
}

const roleScout = {
  run(creep: Scout) {
    // 1. Quel Room doit être scan
    // 1,2 recherche dans la listes des rooms a scan de la room maison
    let workingStation = creep.memory.workingStation;
    let homeRoom = Game.rooms[creep.memory.homeRoomName];
    if (workingStation) {
      console.log("Have a target room : " + workingStation);
      if (workingStation !== creep.room.name) {
        Traveler.travelTo(creep, new RoomPosition(25, 25, workingStation));
      } else {
        Traveler.travelTo(creep, new RoomPosition(25, 25, workingStation));
        console.log("Is on the right room");
        let linkedRoom = homeRoom.memory.linked[workingStation];
        let actualRoom = Game.rooms[workingStation];
        if (linkedRoom) {
          console.log("Scan my room");
          RoomConstructionSiteUtils.scan(homeRoom);
          RoomStructureUtils.scan(homeRoom);
          RoomSourceUtils.scan(homeRoom);
        } else {
          console.log("Scan room");
          RoomConstructionSiteUtils.scan(actualRoom);
          RoomStructureUtils.scan(actualRoom);
          RoomSourceUtils.scan(actualRoom);
        }
        if (homeRoom.memory.scouted[workingStation]) {
          homeRoom.memory.scouted[workingStation].lastScout = Game.time;
        }
        creep.memory.workingStation = undefined;
      }
    }
    // select new room to scout
    else {
      // Find room to scan
      console.log("find target");
      let targetsRoomName = _.filter(homeRoom.memory.scouted, function (r) {
        return (r.lastScout && r.lastScout + SCOUT_FREQUENCY < Game.time) || r.lastScout === undefined;
      });
      console.log("targets find : " + JSON.stringify(targetsRoomName));
      let target: ScoutOptions | null = targetsRoomName != null ? targetsRoomName[0] : null;
      console.log("target : " + JSON.stringify(target));
      if (target) {
        creep.memory.workingStation = target.roomName;
      }
    }
    // 2. Déplacement vers cette room

    // 3. Analyse
  }
};

export default roleScout;
