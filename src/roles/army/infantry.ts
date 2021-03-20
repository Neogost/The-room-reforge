import { ERR_NO_TARGET } from "../../utils/ConstantUtils";
import { CreepUtils } from "../../utils/CreepUtils";
import { Traveler } from "../../utils/Traveler";

export interface Infantry extends Creep {
  memory: InfantrytMemory;
}

export class InfantrytMemory implements CreepMemory {
  role: string = "infantry";
  homeRoomName: string;

  isSentry: boolean | undefined;
  isInPosition: boolean | undefined;

  hostileTarget: Id<Creep> | undefined;
  /** Creep's target to harvest energy */
  targetController: Id<StructureController> | undefined;
  /** Creep's target's to harvest position. Where is the task to do */
  _targetControllerPos: RoomPosition | undefined;
  /** Creep's target's to harvest position. Where is the task to do */
  _targetControllerRoom: string | undefined;

  _trav: any;
  _travel: any;

  /**
   * Initialize a Builder.
   * @param currentRoom Room where the creep is actualy
   * @param storage Storage who are a reference to take energy for this creep
   */
  constructor(currentRoom: Room, isSentry?: boolean, controller?: StructureController) {
    this.homeRoomName = currentRoom.name;
    if (isSentry) {
      this.isSentry = isSentry;
      this.isInPosition = false;
    }
    if (controller) {
      this.targetController = controller.id;
      this._targetControllerPos = controller.pos;
      this._targetControllerRoom = controller.room.name;
    }
  }
}

const roleInfantry = {
  run(creep: Infantry) {
    let analyseCPUStart = Game.cpu.getUsed();
    let room = creep.room;
    // est une sentinelle : défend une room
    if (creep.memory.isSentry) {
      // go to this affectation
      if (!creep.memory.isInPosition) {
        // The sentry have a target room to protect
        // Set a position to stay
        if (creep.memory._targetControllerPos) {
          let pos = new RoomPosition(
            creep.memory._targetControllerPos.x,
            creep.memory._targetControllerPos.y,
            creep.memory._targetControllerPos.roomName
          );
          if (creep.pos.isNearTo(pos)) {
            creep.memory.isInPosition = true;
            return OK;
          } else {
            CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
            return Traveler.travelTo(creep, pos);
          }
        } else {
          CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
          return ERR_NO_TARGET;
        }
      }
      // the creep is ready to protect his room
      else {
        // the creep is need in fight
        if (!creep.memory.hostileTarget) {
          // TODO : Every 10  tick, creep check the hostile activity
          let hostileCreep = room.find(FIND_HOSTILE_CREEPS);
          if (hostileCreep.length > 0) {
            // take the first target
            let target = hostileCreep[0];
            creep.memory.hostileTarget = target.id;
          }
        }
        // creep is in fight
        if (creep.memory.hostileTarget) {
          let target = <Creep>Game.getObjectById(creep.memory.hostileTarget);
          if (!target) {
            creep.memory.hostileTarget = undefined;
            CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
            return ERR_NO_TARGET;
          }
          if (creep.pos.isNearTo(target.pos)) {
            CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
            return creep.attack(target);
          } else {
            CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
            return Traveler.travelTo(creep, target.pos);
          }
        }
      }
    }
    // vérifie s'il est bien sur le lieu d'action
    // check room actuel et targetedRoom
    // vérifie si la cible existe encore
    // vérifie si la cible est a porté
    // attaque la cible
    // cible n'exsite plus
    // chercher une nouvelle cible
    // si pas de cible, passe en mode sentinelle
    CreepUtils.calculateCPUUsed(creep, analyseCPUStart);
    return OK;
  }
};

export default roleInfantry;
