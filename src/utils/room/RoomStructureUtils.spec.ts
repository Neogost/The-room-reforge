import { mockInstanceOf, mockStructure, mockGlobal } from "screeps-jest";
import { RoomSourceUtils } from "./RoomSourceUtils";
import { NO_FULL_SCAN_DONE, NO_FULL_SCAN_DONE_LINKED } from "../ConstantUtils";
import { RoomStructureUtils } from "./RoomStructureUtils";

const rampartLevels1 = mockInstanceOf<RampartSettings>({ level: 1, maxHits: 1 });
const settings = mockInstanceOf<Settings>({
  logLevel: 3,
  repairIndicator: 0.9,
  rampartMaxHits: [rampartLevels1]
});

const cpuMock = mockInstanceOf<CPU>({
  getUsed: () => {
    return 0;
  }
});
mockGlobal<Memory>("Memory", {
  // @ts-ignore
  settings: settings
});

describe("Room Structure Utils, ", () => {
  describe("scan", () => {
    it("should scan, room with 1 structure who don't need to be repair, no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));

      const structureOption1 = mockInstanceOf<StructureOptions>({
        id: "structure1",
        roomName: "origineRoomWithOneStructure",
        type: "container",
        lastSpawn: undefined
      });
      const structuresOptionsMemory = mockInstanceOf<StructureMemoryMap<StructureOptions>>(
        {
          structure1: structureOption1
        },
        true
      );
      const origineRoomWithOneStructureMemory = mockInstanceOf<RoomMemory>(
        {
          structures: structuresOptionsMemory
        },
        true
      );
      const origineRoomWithOneStructure = mockInstanceOf<Room>({
        name: "origineRoomWithOneStructure",
        memory: origineRoomWithOneStructureMemory,
        find: (type: number) => {
          switch (type) {
            case FIND_STRUCTURES:
              return [structure1];
            default:
              return null;
          }
        }
      });

      const structure1 = mockInstanceOf<StructureContainer>({
        id: "structure1" as Id<StructureContainer>,
        room: origineRoomWithOneStructure,
        hits: 1000,
        hitsMax: 1000,
        structureType: "container"
      });
      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            case "structure1":
              return structure1;
            default:
              return null;
          }
        },
        rooms: { origineRoomWithOneStructure: origineRoomWithOneStructure },
        cpu: cpuMock
      });

      let result: number = RoomStructureUtils.scan(origineRoomWithOneStructure);
      expect(result).toBe(OK);
      expect(origineRoomWithOneStructure.memory.structures["structure1"].needRepair).toBe(false);
    });

    it("should scan, room with 1 structure who need to be repair, no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));

      const structureOption1 = mockInstanceOf<StructureOptions>({
        id: "structure1",
        roomName: "origineRoomWithOneStructure",
        type: "container",
        lastSpawn: undefined
      });
      const structuresOptionsMemory = mockInstanceOf<StructureMemoryMap<StructureOptions>>(
        {
          structure1: structureOption1
        },
        true
      );
      const origineRoomWithOneStructureMemory = mockInstanceOf<RoomMemory>(
        {
          structures: structuresOptionsMemory
        },
        true
      );
      const origineRoomWithOneStructure = mockInstanceOf<Room>({
        name: "origineRoomWithOneStructure",
        memory: origineRoomWithOneStructureMemory,
        find: (type: number) => {
          switch (type) {
            case FIND_STRUCTURES:
              return [structure1];
            default:
              return null;
          }
        }
      });

      const structure1 = mockInstanceOf<StructureContainer>({
        id: "structure1" as Id<StructureContainer>,
        room: origineRoomWithOneStructure,
        hits: 800,
        hitsMax: 1000,
        structureType: "container"
      });
      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            case "structure1":
              return structure1;
            default:
              return null;
          }
        },
        rooms: { origineRoomWithOneStructure: origineRoomWithOneStructure },
        cpu: cpuMock
      });

      let result: number = RoomStructureUtils.scan(origineRoomWithOneStructure);
      expect(result).toBe(OK);
      expect(origineRoomWithOneStructure.memory.structures["structure1"].needRepair).toBe(true);
    });

    it("should scan, room with 1 structure who don't need to be repair, room is not available", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));

      const structureOption1 = mockInstanceOf<StructureOptions>({
        id: "structure1",
        roomName: "origineRoomWithOneStructure",
        type: "container",
        lastSpawn: undefined
      });
      const structuresOptionsMemory = mockInstanceOf<StructureMemoryMap<StructureOptions>>(
        {
          structure1: structureOption1
        },
        true
      );
      const origineRoomWithOneStructureMemory = mockInstanceOf<RoomMemory>(
        {
          structures: structuresOptionsMemory
        },
        true
      );
      const origineRoomWithOneStructure = mockInstanceOf<Room>({
        name: "origineRoomWithOneStructure",
        memory: origineRoomWithOneStructureMemory,
        find: (type: number) => {
          switch (type) {
            default:
              return null;
          }
        }
      });

      mockGlobal<Game>(
        "Game",
        {
          getObjectById: (id: string) => {
            switch (id) {
              default:
                return null;
            }
          },
          rooms: {},
          cpu: cpuMock
        },
        true
      );

      let result: number = RoomStructureUtils.scan(origineRoomWithOneStructure);
      expect(result).toBe(NO_FULL_SCAN_DONE);
    });

    it("should scan, room with 1 structure who don't exist more, no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));

      const structureOption1 = mockInstanceOf<StructureOptions>({
        id: "structure1",
        roomName: "origineRoomWithOneStructure",
        type: "container",
        lastSpawn: undefined
      });
      const structuresOptionsMemory = mockInstanceOf<StructureMemoryMap<StructureOptions>>(
        {
          structure1: structureOption1
        },
        true
      );
      const origineRoomWithOneStructureMemory = mockInstanceOf<RoomMemory>(
        {
          structures: structuresOptionsMemory
        },
        true
      );
      const origineRoomWithOneStructure = mockInstanceOf<Room>({
        name: "origineRoomWithOneStructure",
        memory: origineRoomWithOneStructureMemory,
        find: (type: number) => {
          switch (type) {
            case FIND_STRUCTURES:
              return [structure1];
            default:
              return null;
          }
        }
      });

      const structure1 = mockInstanceOf<StructureContainer>({
        id: "structure1" as Id<StructureContainer>,
        room: origineRoomWithOneStructure,
        hits: 1000,
        hitsMax: 1000,
        structureType: "container"
      });
      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            default:
              return null;
          }
        },
        rooms: { origineRoomWithOneStructure: origineRoomWithOneStructure },
        cpu: cpuMock
      });

      let result: number = RoomStructureUtils.scan(origineRoomWithOneStructure);
      expect(result).toBe(OK);
      expect(origineRoomWithOneStructure.memory.structures["structure1"].needRepair).toBe(false);
    });

    it("should scan, room wihtout structure and with a linked room with 1 structure who don't need to be repair, no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));

      const linkedOption1 = mockInstanceOf<LinkOptions>({});

      const structureOption1 = mockInstanceOf<StructureOptions>({
        id: "structure1",
        roomName: "linkedRoomWithOneStructure",
        type: "container",
        lastSpawn: undefined
      });

      const structuresOptionsMemory = mockInstanceOf<StructureMemoryMap<StructureOptions>>(
        {
          structure1: structureOption1
        },
        true
      );

      const linkedOptionsMemory = mockInstanceOf<LinkedMemoryMap<LinkedRoomOptions>>(
        {
          linkedRoomWithOneStructure: linkedOption1
        },
        true
      );
      const origineRoomWithOneStructureMemory = mockInstanceOf<RoomMemory>(
        {
          linked: linkedOptionsMemory
        },
        true
      );

      const linkedRoomWithOneStructureMemory = mockInstanceOf<RoomMemory>(
        {
          linkedRoomWithOneStructure: structuresOptionsMemory
        },
        true
      );
      const origineRoomWithALinkedRoom = mockInstanceOf<Room>({
        name: "origineRoomWithALinkedRoom",
        memory: origineRoomWithOneStructureMemory,
        find: (type: number) => {
          switch (type) {
            default:
              return null;
          }
        }
      });

      const linkedRoomWithOneStructure = mockInstanceOf<Room>({
        name: "linkedRoomWithOneStructure",
        memory: linkedRoomWithOneStructureMemory,
        find: (type: number) => {
          switch (type) {
            case FIND_STRUCTURES:
              return [structure1];
            default:
              return null;
          }
        }
      });
      const structure1 = mockInstanceOf<StructureContainer>({
        id: "structure1" as Id<StructureContainer>,
        room: origineRoomWithALinkedRoom,
        hits: 1000,
        hitsMax: 1000,
        structureType: "container"
      });
      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            case "structure1":
              return structure1;
            default:
              return null;
          }
        },
        rooms: {
          origineRoomWithALinkedRoom: origineRoomWithALinkedRoom,
          linkedRoomWithOneStructure: linkedRoomWithOneStructure
        },
        cpu: cpuMock
      });

      let result: number = RoomStructureUtils.scan(origineRoomWithALinkedRoom);
      expect(result).toBe(OK);
    });

    it("should scan, room wihtout structure and with a linked room with 1 structure who don't need to be repair, linked room is not available", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));

      const linkedOption1 = mockInstanceOf<LinkOptions>({});

      const structureOption1 = mockInstanceOf<StructureOptions>({
        id: "structure1",
        roomName: "linkedRoomWithOneStructure",
        type: "container",
        lastSpawn: undefined
      });

      const structuresOptionsMemory = mockInstanceOf<StructureMemoryMap<StructureOptions>>(
        {
          structure1: structureOption1
        },
        true
      );

      const linkedOptionsMemory = mockInstanceOf<LinkedMemoryMap<LinkedRoomOptions>>(
        {
          linkedRoomWithOneStructure: linkedOption1
        },
        true
      );
      const origineRoomWithOneStructureMemory = mockInstanceOf<RoomMemory>(
        {
          linked: linkedOptionsMemory
        },
        true
      );

      const linkedRoomWithOneStructureMemory = mockInstanceOf<RoomMemory>(
        {
          linkedRoomWithOneStructure: structuresOptionsMemory
        },
        true
      );
      const origineRoomWithALinkedRoom = mockInstanceOf<Room>({
        name: "origineRoomWithALinkedRoom",
        memory: origineRoomWithOneStructureMemory,
        find: (type: number) => {
          switch (type) {
            default:
              return null;
          }
        }
      });

      const linkedRoomWithOneStructure = mockInstanceOf<Room>({
        name: "linkedRoomWithOneStructure",
        memory: linkedRoomWithOneStructureMemory,
        find: (type: number) => {
          switch (type) {
            case FIND_STRUCTURES:
              return [structure1];
            default:
              return null;
          }
        }
      });
      const structure1 = mockInstanceOf<StructureContainer>({
        id: "structure1" as Id<StructureContainer>,
        room: origineRoomWithALinkedRoom,
        hits: 1000,
        hitsMax: 1000,
        structureType: "container"
      });
      mockGlobal<Game>(
        "Game",
        {
          getObjectById: (id: string) => {
            switch (id) {
              case "structure1":
                return structure1;
              default:
                return null;
            }
          },
          rooms: {
            origineRoomWithALinkedRoom: origineRoomWithALinkedRoom
          },
          cpu: cpuMock
        },
        true
      );

      let result: number = RoomStructureUtils.scan(origineRoomWithALinkedRoom);
      expect(result).toBe(NO_FULL_SCAN_DONE_LINKED);
    });
  });
});
