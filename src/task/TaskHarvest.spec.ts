import { mockInstanceOf, mockStructure, mockGlobal } from "screeps-jest";
import { TaskHarvest } from "./TaskHarvest";
import { ERR_NO_TARGET, ERR_NO_AVAILABLE_CAPACITY, TRAVELER_MOVE } from "../utils/ConstantUtils";
import { Traveler } from "../utils/Traveler";

const invalidSourceIdInTheSameRoom: string = "invalidSourceIdInTheSameRoom";
const invalidSourceId: string = "invalidSourceId";
const source2Id: string = "source2Id";

const positionSourceInARoom = mockInstanceOf<RoomPosition>({
  isNearTo: (target: RoomPosition) => {
    switch (target) {
      case creep3pos:
        return false;
      default:
        return true;
    }
  },
  x: 1,
  y: 1,
  roomName: "room"
});
const sourceInARoom = mockInstanceOf<Source>({
  id: "positionSourceInARoom" as Id<Source>,
  pos: positionSourceInARoom
});
const extension = mockStructure(STRUCTURE_EXTENSION);
const room = mockInstanceOf<Room>({
  name: "room",
  find: (type: FindConstant) => {
    switch (type) {
      case FIND_SOURCES:
        return [sourceInARoom];
      case FIND_STRUCTURES:
        return [extension];
      default:
        return [];
    }
  }
});

const positionInFrontOfASource = mockInstanceOf<RoomPosition>({
  x: 2,
  y: 1,
  roomName: "room"
});
const creepWhoCanHarvertInFrontOfASource = mockInstanceOf<Creep>({
  harvest: () => OK,
  body: [{ type: WORK, boost: undefined, hits: 1 }],
  room,
  store: { getFreeCapacity: () => 50 },
  pos: positionInFrontOfASource
});

const creep2 = mockInstanceOf<Creep>({
  harvest: () => OK,
  body: [{ type: CARRY, boost: undefined, hits: 1 }],
  room,
  store: { getFreeCapacity: () => 50 }
});

const creep3pos = mockInstanceOf<RoomPosition>({
  x: 5,
  y: 5,
  room: "room"
});
const creepWhoCanHarvest = mockInstanceOf<Creep>({
  harvest: () => OK,
  body: [{ type: WORK, boost: undefined, hits: 1 }],
  room,
  store: { getFreeCapacity: () => 50 },
  fatigue: 0,
  pos: creep3pos
});

const creepWhoCanHarvestButExhaust = mockInstanceOf<Creep>({
  harvest: () => OK,
  body: [{ type: WORK, boost: undefined, hits: 1 }],
  room,
  store: { getFreeCapacity: () => 50 },
  fatigue: 100,
  pos: creep3pos
});

const creepWhoCanHarvestButNoFreeCapacity = mockInstanceOf<Creep>({
  harvest: () => OK,
  body: [{ type: WORK, boost: undefined, hits: 1 }],
  room,
  store: { getFreeCapacity: () => 0 }
});

mockGlobal<Game>("Game", {
  getObjectById: (id: string) => {
    switch (id) {
      case source2Id:
        return sourceInARoom;
      default:
        return null;
    }
  }
});

describe("All task to harvest", () => {
  describe("doTask", () => {
    it("should not harvest, target does not exist", () => {
      let result: number = TaskHarvest.doTask(creepWhoCanHarvertInFrontOfASource, invalidSourceId);
      expect(Game.getObjectById).toBeCalledWith(invalidSourceId);
      expect(result).toBe(ERR_NO_TARGET);
    });

    it("should not harvest, creep does not have body part of 'WORK' ", () => {
      let result: number = TaskHarvest.doTask(creep2, source2Id);
      expect(result).toBe(ERR_NO_BODYPART);
    });

    it("should not harvest, creep will move to target", () => {
      // Arrange
      const travelToMock = jest.fn();
      travelToMock.mockReturnValue(OK);
      Traveler.travelTo = travelToMock;
      // Act
      let result: number = TaskHarvest.doTask(creepWhoCanHarvest, source2Id);
      expect(Game.getObjectById).toBeCalledWith(source2Id);
      expect(result).toBe(OK);
    });

    it("should not harvest, creep will try to move to the target but is exhausted", () => {
      // Arrange
      const travelToMock = jest.fn();
      travelToMock.mockReturnValue(ERR_TIRED);
      Traveler.travelTo = travelToMock;
      // Act
      let result: number = TaskHarvest.doTask(creepWhoCanHarvestButExhaust, source2Id);
      expect(Game.getObjectById).toBeCalledWith(source2Id);
      expect(result).toBe(ERR_TIRED);
    });

    it("should not harvest, creep haven't space in store", () => {
      let result: number = TaskHarvest.doTask(creepWhoCanHarvestButNoFreeCapacity, source2Id);
      expect(result).toBe(ERR_NO_AVAILABLE_CAPACITY);
    });

    it("should harvest, creep in front of the target", () => {
      let result: number = TaskHarvest.doTask(creepWhoCanHarvertInFrontOfASource, source2Id);
      expect(Game.getObjectById).toBeCalledWith(source2Id);
      expect(result).toBe(OK);
    });
  });
});
