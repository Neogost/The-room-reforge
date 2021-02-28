import { Traveler } from "../../utils/Traveler";
export interface Helper extends Creep {
  memory: HelperMemory;
}

export class HelperMemory implements CreepMemory {
  role: string = "harvester";
  homeRoomName: string;

  _trav: any;
  _travel: any;

  constructor(currentRoom: Room) {
    this.homeRoomName = currentRoom.name;
  }
}

const roleHarvester = {
  run(creep: Helper) {}
};
export default roleHelper;
