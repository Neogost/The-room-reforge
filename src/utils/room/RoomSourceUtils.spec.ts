import { mockInstanceOf, mockStructure, mockGlobal } from "screeps-jest";
import { RoomSourceUtils } from "./RoomSourceUtils";
import { NO_FULL_SCAN_DONE, NO_FULL_SCAN_DONE_LINKED } from "../ConstantUtils";

const cpuMock = mockInstanceOf<CPU>({
  getUsed: () => {
    return 0;
  }
});
describe("Room Source/Deposit/Mineral Utils, ", () => {
  describe("scan", () => {
    it("should scan, room with 1 source of energy, no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));

      const sourceOption1 = mockInstanceOf<SourcesOptions>({
        id: "source1" as Id<Source>,
        roomName: "origineRoomWithOneSource",
        pos: new RoomPosition(0, 0, "origineRoomWithOneSource"),
        lastSpawn: undefined
      });
      const origineSourceMemory = mockInstanceOf<SourceMemoryMap<SourcesOptions>>(
        {
          source1: sourceOption1
        },
        true
      );

      const origineLinkedMemory = mockInstanceOf<LinkedMemoryMap<LinkedRoomOptions>>({}, true);

      const origineRoomMemory = mockInstanceOf<RoomMemory>({
        sources: origineSourceMemory,
        linked: origineLinkedMemory
      });
      const origineRoomWithOneSource = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneSource",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_SOURCES:
                return [source1];
              case FIND_MINERALS:
                return null;
              case FIND_DEPOSITS:
                return null;
              default:
                return null;
            }
          }
        },
        true
      );

      const source1 = mockInstanceOf<Source>({
        id: "source1" as Id<Source>,
        room: origineRoomWithOneSource,
        pos: new RoomPosition(0, 0, "origineRoomWithOneSource")
      });

      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            case "source1":
              return source1;
            default:
              return null;
          }
        },

        rooms: { origineRoomWithOneSource: origineRoomWithOneSource },
        cpu: cpuMock
      });
      let result: number = RoomSourceUtils.scan(origineRoomWithOneSource);
      expect(result).toBe(OK);
    });

    it("should scan, room with 1 source of deposit, no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));

      const sourceOption1 = mockInstanceOf<SourcesOptions>({
        id: "deposit1" as Id<Deposit>,
        roomName: "origineRoomWithOneSource",
        pos: new RoomPosition(0, 0, "origineRoomWithOneSource"),
        lastSpawn: undefined
      });
      const origineSourceMemory = mockInstanceOf<SourceMemoryMap<SourcesOptions>>(
        {
          deposit1: sourceOption1
        },
        true
      );

      const origineLinkedMemory = mockInstanceOf<LinkedMemoryMap<LinkedRoomOptions>>({}, true);

      const origineRoomMemory = mockInstanceOf<RoomMemory>({
        sources: origineSourceMemory,
        linked: origineLinkedMemory
      });
      const origineRoomWithOneSource = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneSource",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_SOURCES:
                return null;
              case FIND_MINERALS:
                return null;
              case FIND_DEPOSITS:
                return [deposit1];
              default:
                return null;
            }
          }
        },
        true
      );

      const deposit1 = mockInstanceOf<Deposit>({
        id: "deposit1" as Id<Deposit>,
        room: origineRoomWithOneSource,
        pos: new RoomPosition(0, 0, "origineRoomWithOneSource")
      });

      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            case "deposit1":
              return deposit1;
            default:
              return null;
          }
        },

        rooms: { origineRoomWithOneSource: origineRoomWithOneSource },
        cpu: cpuMock
      });
      let result: number = RoomSourceUtils.scan(origineRoomWithOneSource);
      expect(result).toBe(OK);
    });

    it("should scan, room with 1 source of mineral , no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));

      const sourceOption1 = mockInstanceOf<SourcesOptions>({
        id: "mineral1" as Id<Mineral>,
        roomName: "origineRoomWithOneSource",
        pos: new RoomPosition(0, 0, "origineRoomWithOneSource"),
        lastSpawn: undefined
      });
      const origineSourceMemory = mockInstanceOf<SourceMemoryMap<SourcesOptions>>(
        {
          mineral1: sourceOption1
        },
        true
      );

      const origineLinkedMemory = mockInstanceOf<LinkedMemoryMap<LinkedRoomOptions>>({}, true);

      const origineRoomMemory = mockInstanceOf<RoomMemory>({
        sources: origineSourceMemory,
        linked: origineLinkedMemory
      });
      const origineRoomWithOneSource = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneSource",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_SOURCES:
                return null;
              case FIND_MINERALS:
                return [mineral1];
              case FIND_DEPOSITS:
                return null;
              default:
                return null;
            }
          }
        },
        true
      );

      const mineral1 = mockInstanceOf<Mineral>({
        id: "mineral1" as Id<Mineral>,
        room: origineRoomWithOneSource,
        pos: new RoomPosition(0, 0, "origineRoomWithOneSource")
      });

      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            case "mineral1":
              return mineral1;
            default:
              return null;
          }
        },

        rooms: { origineRoomWithOneSource: origineRoomWithOneSource },
        cpu: cpuMock
      });
      let result: number = RoomSourceUtils.scan(origineRoomWithOneSource);
      expect(result).toBe(OK);
    });

    it("should scan, room with 1 source witch is not already save, no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));

      const origineSourceMemory = mockInstanceOf<SourceMemoryMap<SourcesOptions>>({}, true);

      const origineLinkedMemory = mockInstanceOf<LinkedMemoryMap<LinkedRoomOptions>>({}, true);

      const origineRoomMemory = mockInstanceOf<RoomMemory>(
        {
          sources: origineSourceMemory,
          linked: origineLinkedMemory
        },
        true
      );
      const origineRoomWithOneSource = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneSource",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_SOURCES:
                return [source1];
              case FIND_MINERALS:
                return null;
              case FIND_DEPOSITS:
                return null;
              default:
                return null;
            }
          }
        },
        true
      );

      const source1 = mockInstanceOf<Source>({
        id: "source1" as Id<Source>,
        room: origineRoomWithOneSource,
        pos: new RoomPosition(0, 0, "origineRoomWithOneSource")
      });

      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            case "source1":
              return source1;
            default:
              return null;
          }
        },

        rooms: { origineRoomWithOneSource: origineRoomWithOneSource },
        cpu: cpuMock
      });
      let result: number = RoomSourceUtils.scan(origineRoomWithOneSource);
      expect(result).toBe(OK);
    });

    it("should scan, room with 1 source, room is not available", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));

      const sourceOption1 = mockInstanceOf<SourcesOptions>({
        id: "source1" as Id<Source>,
        roomName: "origineRoomWithOneSource",
        pos: new RoomPosition(0, 0, "origineRoomWithOneSource"),
        lastSpawn: undefined
      });
      const origineSourceMemory = mockInstanceOf<SourceMemoryMap<SourcesOptions>>(
        {
          source1: sourceOption1
        },
        true
      );

      const origineLinkedMemory = mockInstanceOf<LinkedMemoryMap<LinkedRoomOptions>>({}, true);

      const origineRoomMemory = mockInstanceOf<RoomMemory>({
        sources: origineSourceMemory,
        linked: origineLinkedMemory
      });
      const origineRoomWithOneSource = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneSource",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_SOURCES:
                return [source1];
              case FIND_MINERALS:
                return null;
              case FIND_DEPOSITS:
                return null;
              default:
                return null;
            }
          }
        },
        true
      );

      const source1 = mockInstanceOf<Source>({
        id: "source1" as Id<Source>,
        room: origineRoomWithOneSource,
        pos: new RoomPosition(0, 0, "origineRoomWithOneSource")
      });

      mockGlobal<Game>(
        "Game",
        {
          getObjectById: (id: string) => {
            switch (id) {
              case "source1":
                return source1;
              default:
                return null;
            }
          },

          rooms: {},
          cpu: cpuMock
        },
        true
      );
      let result: number = RoomSourceUtils.scan(origineRoomWithOneSource);
      expect(result).toBe(NO_FULL_SCAN_DONE);
    });

    it("should scan, room with 1 source, room exist but source didn't exist, no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));

      const sourceOption1 = mockInstanceOf<SourcesOptions>({
        id: "source1" as Id<Source>,
        roomName: "origineRoomWithOutSource",
        pos: new RoomPosition(0, 0, "origineRoomWithOutSource"),
        lastSpawn: undefined
      });
      const origineSourceMemory = mockInstanceOf<SourceMemoryMap<SourcesOptions>>(
        {
          source1: sourceOption1
        },
        true
      );

      const origineLinkedMemory = mockInstanceOf<LinkedMemoryMap<LinkedRoomOptions>>({}, true);

      const origineRoomMemory = mockInstanceOf<RoomMemory>({
        sources: origineSourceMemory,
        linked: origineLinkedMemory
      });
      const origineRoomWithOutSource = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOutSource",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_SOURCES:
                return null;
              case FIND_MINERALS:
                return null;
              case FIND_DEPOSITS:
                return null;
              default:
                return null;
            }
          }
        },
        true
      );

      mockGlobal<Game>(
        "Game",
        {
          getObjectById: (id: string) => {
            switch (id) {
              default:
                return null;
            }
          },

          rooms: { origineRoomWithOutSource: origineRoomWithOutSource },
          cpu: cpuMock
        },
        true
      );
      let result: number = RoomSourceUtils.scan(origineRoomWithOutSource);
      expect(result).toBe(OK);
    });

    it("should scan, room with 1 source and 1 linked room, no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));

      const sourceOption1 = mockInstanceOf<SourcesOptions>({
        id: "source1" as Id<Source>,
        roomName: "origineRoomWithOneSourceAndOneLinkedRoom",
        pos: new RoomPosition(0, 0, "origineRoomWithOneSourceAndOneLinkedRoom"),
        lastSpawn: undefined
      });

      const sourceLinkedOption1 = mockInstanceOf<SourcesOptions>({
        id: "sourceLinked1" as Id<Source>,
        roomName: "origineRoomWithOneSourceAndOneLinkedRoom",
        pos: new RoomPosition(0, 0, "origineRoomWithOneSourceAndOneLinkedRoom"),
        lastSpawn: undefined
      });
      const origineSourceMemory = mockInstanceOf<SourceMemoryMap<SourcesOptions>>(
        {
          source1: sourceOption1
        },
        true
      );

      const LinkedSourceMemory = mockInstanceOf<SourceMemoryMap<SourcesOptions>>(
        {
          sourceLinked1: sourceLinkedOption1
        },
        true
      );
      const origineLinkedMemory = mockInstanceOf<LinkedMemoryMap<LinkedRoomOptions>>(
        {
          linkedRoomToOriginRoom: {}
        },
        true
      );

      const origineRoomMemory = mockInstanceOf<RoomMemory>({
        sources: origineSourceMemory,
        linked: origineLinkedMemory
      });

      const linkedRoomToOriginRoomMemory = mockInstanceOf<RoomMemory>({
        sources: LinkedSourceMemory
      });
      const origineRoomWithOneSourceAndOneLinkedRoom = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneSourceAndOneLinkedRoom",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_SOURCES:
                return [source1];
              case FIND_MINERALS:
                return null;
              case FIND_DEPOSITS:
                return null;
              default:
                return null;
            }
          }
        },
        true
      );
      const linkedRoomToOriginRoom = mockInstanceOf<Room>(
        {
          name: "linkedRoomToOriginRoom",
          memory: linkedRoomToOriginRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_SOURCES:
                return [source1];
              case FIND_MINERALS:
                return null;
              case FIND_DEPOSITS:
                return null;
              default:
                return null;
            }
          }
        },
        true
      );
      const source1 = mockInstanceOf<Source>({
        id: "source1" as Id<Source>,
        room: origineRoomWithOneSourceAndOneLinkedRoom,
        pos: new RoomPosition(0, 0, "origineRoomWithOneSourceAndOneLinkedRoom")
      });

      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            case "source1":
              return source1;
            default:
              return null;
          }
        },

        rooms: {
          origineRoomWithOneSourceAndOneLinkedRoom: origineRoomWithOneSourceAndOneLinkedRoom,
          linkedRoomToOriginRoom: linkedRoomToOriginRoom
        },
        cpu: cpuMock
      });

      let result: number = RoomSourceUtils.scan(origineRoomWithOneSourceAndOneLinkedRoom);
      expect(result).toBe(OK);
    });

    it("should scan, room with 1 source and 1 linked room who are not available", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));

      const sourceOption1 = mockInstanceOf<SourcesOptions>({
        id: "source1" as Id<Source>,
        roomName: "origineRoomWithOneSourceAndOneLinkedRoom",
        pos: new RoomPosition(0, 0, "origineRoomWithOneSourceAndOneLinkedRoom"),
        lastSpawn: undefined
      });

      const sourceLinkedOption1 = mockInstanceOf<SourcesOptions>({
        id: "sourceLinked1" as Id<Source>,
        roomName: "origineRoomWithOneSourceAndOneLinkedRoom",
        pos: new RoomPosition(0, 0, "origineRoomWithOneSourceAndOneLinkedRoom"),
        lastSpawn: undefined
      });
      const origineSourceMemory = mockInstanceOf<SourceMemoryMap<SourcesOptions>>(
        {
          source1: sourceOption1
        },
        true
      );

      const LinkedSourceMemory = mockInstanceOf<SourceMemoryMap<SourcesOptions>>(
        {
          sourceLinked1: sourceLinkedOption1
        },
        true
      );
      const origineLinkedMemory = mockInstanceOf<LinkedMemoryMap<LinkedRoomOptions>>(
        {
          linkedRoomToOriginRoom: {}
        },
        true
      );

      const origineRoomMemory = mockInstanceOf<RoomMemory>({
        sources: origineSourceMemory,
        linked: origineLinkedMemory
      });

      const linkedRoomToOriginRoomMemory = mockInstanceOf<RoomMemory>({
        sources: LinkedSourceMemory
      });
      const origineRoomWithOneSourceAndOneLinkedRoom = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneSourceAndOneLinkedRoom",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_SOURCES:
                return [source1];
              case FIND_MINERALS:
                return null;
              case FIND_DEPOSITS:
                return null;
              default:
                return null;
            }
          }
        },
        true
      );
      const source1 = mockInstanceOf<Source>({
        id: "source1" as Id<Source>,
        room: origineRoomWithOneSourceAndOneLinkedRoom,
        pos: new RoomPosition(0, 0, "origineRoomWithOneSourceAndOneLinkedRoom")
      });

      mockGlobal<Game>(
        "Game",
        {
          getObjectById: (id: string) => {
            switch (id) {
              case "source1":
                return source1;
              default:
                return null;
            }
          },

          rooms: {
            origineRoomWithOneSourceAndOneLinkedRoom: origineRoomWithOneSourceAndOneLinkedRoom
          },
          cpu: cpuMock
        },
        true
      );

      let result: number = RoomSourceUtils.scan(origineRoomWithOneSourceAndOneLinkedRoom);
      expect(result).toBe(NO_FULL_SCAN_DONE_LINKED);
    });
  });
});
