import { mockInstanceOf, mockStructure, mockGlobal } from "screeps-jest";
import { RoomSourceUtils } from "./RoomSourceUtils";
import { NO_FULL_SCAN_DONE, NO_FULL_SCAN_DONE_LINKED } from "../ConstantUtils";
import { RoomConstructionSiteUtils } from "./RoomConstructionSiteUtils";

const cpuMock = mockInstanceOf<CPU>({
  getUsed: () => {
    return 0;
  }
});
describe("Room Construction Site Utils, ", () => {
  describe("scan", () => {
    it("should scan, room with 1 constructions site, no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));
      const constructionSiteRoom = mockInstanceOf<Room>({
        name: "origineRoomWithOneConstructionSite"
      });
      const constructionSiteOwner = mockInstanceOf<Owner>({
        username: "neogost"
      });
      const constructionSite1 = mockInstanceOf<ConstructionSite>({
        id: "constructionSite1" as Id<ConstructionSite>,
        owner: constructionSiteOwner,
        progress: 1,
        progressTotal: 100,
        room: constructionSiteRoom,
        structureType: "extension"
      });
      const constructionSiteOption1 = mockInstanceOf<ConstructionSiteOptions>({
        owner: "neogost",
        roomName: "origineRoomWithOneConstructionSite",
        type: "extension"
      });
      const constructionSiteMemory = mockInstanceOf<ConstructionSiteMemoryMap<ConstructionSiteOptions>>(
        {
          constructionSite1: constructionSiteOption1
        },
        true
      );
      const origineRoomMemory = mockInstanceOf<RoomMemory>(
        {
          constructionsSites: constructionSiteMemory
        },
        true
      );
      const origineRoomWithOneConstructionSite = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneConstructionSite",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_CONSTRUCTION_SITES:
                return [constructionSite1];
              default:
                return null;
            }
          }
        },
        true
      );

      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            case "constructionSite1":
              return constructionSite1;
            default:
              return null;
          }
        },
        rooms: { origineRoomWithOneConstructionSite: origineRoomWithOneConstructionSite },
        cpu: cpuMock
      });

      let result: number = RoomConstructionSiteUtils.scan(origineRoomWithOneConstructionSite);
      expect(result).toBe(OK);
    });

    it("should scan, room with 1 construction site, room is not available", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));
      const constructionSiteRoom = mockInstanceOf<Room>({
        name: "origineRoomWithOneConstructionSite"
      });
      const constructionSiteOwner = mockInstanceOf<Owner>({
        username: "neogost"
      });
      const constructionSite1 = mockInstanceOf<ConstructionSite>({
        id: "constructionSite1" as Id<ConstructionSite>,
        owner: constructionSiteOwner,
        progress: 1,
        progressTotal: 100,
        room: constructionSiteRoom,
        structureType: "extension"
      });
      const constructionSiteOption1 = mockInstanceOf<ConstructionSiteOptions>({
        owner: "neogost",
        roomName: "origineRoomWithOneConstructionSite",
        type: "extension"
      });
      const constructionSiteMemory = mockInstanceOf<ConstructionSiteMemoryMap<ConstructionSiteOptions>>(
        {
          constructionSite1: constructionSiteOption1
        },
        true
      );
      const origineRoomMemory = mockInstanceOf<RoomMemory>(
        {
          constructionsSites: constructionSiteMemory
        },
        true
      );
      const origineRoomWithOneConstructionSite = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneConstructionSite",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_CONSTRUCTION_SITES:
                return [constructionSite1];
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
              case "constructionSite1":
                return constructionSite1;
              default:
                return null;
            }
          },
          rooms: {},
          cpu: cpuMock
        },
        true
      );

      let result: number = RoomConstructionSiteUtils.scan(origineRoomWithOneConstructionSite);
      expect(result).toBe(NO_FULL_SCAN_DONE);
    });

    it("should scan, room with 1 constructions site, room exist but constructions site didn't exist, no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));
      const constructionSiteRoom = mockInstanceOf<Room>({
        name: "origineRoomWithOneConstructionSite"
      });
      const constructionSiteOwner = mockInstanceOf<Owner>({
        username: "neogost"
      });
      const constructionSite1 = mockInstanceOf<ConstructionSite>({
        id: "constructionSite1" as Id<ConstructionSite>,
        owner: constructionSiteOwner,
        progress: 1,
        progressTotal: 100,
        room: constructionSiteRoom,
        structureType: "extension"
      });
      const constructionSiteOption1 = mockInstanceOf<ConstructionSiteOptions>({
        owner: "neogost",
        roomName: "origineRoomWithOneConstructionSite",
        type: "extension"
      });
      const constructionSiteMemory = mockInstanceOf<ConstructionSiteMemoryMap<ConstructionSiteOptions>>(
        {
          constructionSite1: constructionSiteOption1
        },
        true
      );
      const origineRoomMemory = mockInstanceOf<RoomMemory>(
        {
          constructionsSites: constructionSiteMemory
        },
        true
      );
      const origineRoomWithOneConstructionSite = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneConstructionSite",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              default:
                return null;
            }
          }
        },
        true
      );

      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            case "constructionSite1":
              return null;
            default:
              return null;
          }
        },
        rooms: { origineRoomWithOneConstructionSite: origineRoomWithOneConstructionSite },
        cpu: cpuMock
      });

      let result: number = RoomConstructionSiteUtils.scan(origineRoomWithOneConstructionSite);
      expect(result).toBe(OK);
    });

    it("should scan, room with 1 construction site, room is not available", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));
      const constructionSiteRoom = mockInstanceOf<Room>({
        name: "origineRoomWithOneConstructionSite"
      });
      const constructionSiteOwner = mockInstanceOf<Owner>({
        username: "neogost"
      });
      const constructionSite1 = mockInstanceOf<ConstructionSite>({
        id: "constructionSite1" as Id<ConstructionSite>,
        owner: constructionSiteOwner,
        progress: 1,
        progressTotal: 100,
        room: constructionSiteRoom,
        structureType: "extension"
      });
      const constructionSiteOption1 = mockInstanceOf<ConstructionSiteOptions>({
        owner: "neogost",
        roomName: "origineRoomWithOneConstructionSite",
        type: "extension"
      });
      const constructionSiteMemory = mockInstanceOf<ConstructionSiteMemoryMap<ConstructionSiteOptions>>(
        {
          constructionSite1: constructionSiteOption1
        },
        true
      );
      const origineRoomMemory = mockInstanceOf<RoomMemory>(
        {
          constructionsSites: constructionSiteMemory
        },
        true
      );
      const origineRoomWithOneConstructionSite = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneConstructionSite",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_CONSTRUCTION_SITES:
                return [constructionSite1];
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
              case "constructionSite1":
                return constructionSite1;
              default:
                return null;
            }
          },
          rooms: {},
          cpu: cpuMock
        },
        true
      );

      let result: number = RoomConstructionSiteUtils.scan(origineRoomWithOneConstructionSite);
      expect(result).toBe(NO_FULL_SCAN_DONE);
    });

    it("should scan, room with 1 construction site witch is not already save, no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));
      const constructionSiteRoom = mockInstanceOf<Room>({
        name: "origineRoomWithOneConstructionSite"
      });
      const constructionSiteOwner = mockInstanceOf<Owner>({
        username: "neogost"
      });
      const constructionSite1 = mockInstanceOf<ConstructionSite>({
        id: "constructionSite1" as Id<ConstructionSite>,
        owner: constructionSiteOwner,
        progress: 1,
        progressTotal: 100,
        room: constructionSiteRoom,
        structureType: "extension"
      });

      const constructionSite2 = mockInstanceOf<ConstructionSite>({
        id: "constructionSite2" as Id<ConstructionSite>,
        owner: constructionSiteOwner,
        progress: 1,
        progressTotal: 100,
        room: constructionSiteRoom,
        structureType: "extension"
      });
      const constructionSiteOption1 = mockInstanceOf<ConstructionSiteOptions>({
        owner: "neogost",
        roomName: "origineRoomWithOneConstructionSite",
        type: "extension"
      });
      const constructionSiteMemory = mockInstanceOf<ConstructionSiteMemoryMap<ConstructionSiteOptions>>(
        {
          constructionSite1: constructionSiteOption1
        },
        true
      );
      const origineRoomMemory = mockInstanceOf<RoomMemory>(
        {
          constructionsSites: constructionSiteMemory
        },
        true
      );
      const origineRoomWithOneConstructionSite = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneConstructionSite",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_CONSTRUCTION_SITES:
                return [constructionSite1, constructionSite2];
              default:
                return null;
            }
          }
        },
        true
      );

      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            case "constructionSite1":
              return constructionSite1;
            case "constructionSite2":
              return constructionSite2;
            default:
              return null;
          }
        },
        rooms: { origineRoomWithOneConstructionSite: origineRoomWithOneConstructionSite },
        cpu: cpuMock
      });

      let result: number = RoomConstructionSiteUtils.scan(origineRoomWithOneConstructionSite);
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
      const constructionSiteRoom = mockInstanceOf<Room>({
        name: "linkedRoomWithOneConstructionSite"
      });
      const constructionSiteOwner = mockInstanceOf<Owner>({
        username: "neogost"
      });
      const constructionSite1 = mockInstanceOf<ConstructionSite>({
        id: "constructionSite1" as Id<ConstructionSite>,
        owner: constructionSiteOwner,
        progress: 1,
        progressTotal: 100,
        room: constructionSiteRoom,
        structureType: "extension"
      });
      const constructionSiteOption1 = mockInstanceOf<ConstructionSiteOptions>({
        owner: "neogost",
        roomName: "linkedRoomWithOneConstructionSite",
        type: "extension"
      });
      const constructionSiteMemory = mockInstanceOf<ConstructionSiteMemoryMap<ConstructionSiteOptions>>(
        {
          constructionSite1: constructionSiteOption1
        },
        true
      );
      const linkedMemory = mockInstanceOf<LinkedMemoryMap<LinkedRoomOptions>>(
        {
          linkedRoomWithOneConstructionSite: {}
        },
        true
      );
      const origineRoomMemory = mockInstanceOf<RoomMemory>(
        {
          linked: linkedMemory
        },
        true
      );

      const linkedRoomMemory = mockInstanceOf<RoomMemory>(
        {
          constructionsSites: constructionSiteMemory
        },
        true
      );
      const origineRoomWithOneConstructionSite = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneConstructionSite",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              default:
                return null;
            }
          }
        },
        true
      );

      const linkedRoomWithOneConstructionSite = mockInstanceOf<Room>(
        {
          name: "linkedRoomWithOneConstructionSite",
          memory: linkedRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_CONSTRUCTION_SITES:
                return [constructionSite1];
              default:
                return null;
            }
          }
        },
        true
      );
      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            case "constructionSite1":
              return constructionSite1;
            default:
              return null;
          }
        },
        rooms: {
          origineRoomWithOneConstructionSite: origineRoomWithOneConstructionSite,
          linkedRoomWithOneConstructionSite: linkedRoomWithOneConstructionSite
        },
        cpu: cpuMock
      });

      let result: number = RoomConstructionSiteUtils.scan(origineRoomWithOneConstructionSite);
      expect(result).toBe(OK);
    });

    it("should scan, room with 1 source and 1 linked room, room is not available", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));
      const constructionSiteRoom = mockInstanceOf<Room>({
        name: "linkedRoomWithOneConstructionSite"
      });
      const constructionSiteOwner = mockInstanceOf<Owner>({
        username: "neogost"
      });
      const constructionSite1 = mockInstanceOf<ConstructionSite>({
        id: "constructionSite1" as Id<ConstructionSite>,
        owner: constructionSiteOwner,
        progress: 1,
        progressTotal: 100,
        room: constructionSiteRoom,
        structureType: "extension"
      });
      const constructionSiteOption1 = mockInstanceOf<ConstructionSiteOptions>({
        owner: "neogost",
        roomName: "linkedRoomWithOneConstructionSite",
        type: "extension"
      });
      const constructionSiteMemory = mockInstanceOf<ConstructionSiteMemoryMap<ConstructionSiteOptions>>(
        {
          constructionSite1: constructionSiteOption1
        },
        true
      );
      const linkedMemory = mockInstanceOf<LinkedMemoryMap<LinkedRoomOptions>>(
        {
          linkedRoomWithOneConstructionSite: {}
        },
        true
      );
      const origineRoomMemory = mockInstanceOf<RoomMemory>(
        {
          linked: linkedMemory
        },
        true
      );

      const linkedRoomMemory = mockInstanceOf<RoomMemory>(
        {
          constructionsSites: constructionSiteMemory
        },
        true
      );
      const origineRoomWithOneConstructionSite = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneConstructionSite",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              default:
                return null;
            }
          }
        },
        true
      );

      const linkedRoomWithOneConstructionSite = mockInstanceOf<Room>(
        {
          name: "linkedRoomWithOneConstructionSite",
          memory: linkedRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_CONSTRUCTION_SITES:
                return [constructionSite1];
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
              case "constructionSite1":
                return constructionSite1;
              default:
                return null;
            }
          },
          rooms: {
            origineRoomWithOneConstructionSite: origineRoomWithOneConstructionSite
          },
          cpu: cpuMock
        },
        true
      );

      let result: number = RoomConstructionSiteUtils.scan(origineRoomWithOneConstructionSite);
      expect(result).toBe(NO_FULL_SCAN_DONE_LINKED);
    });
  });
});
