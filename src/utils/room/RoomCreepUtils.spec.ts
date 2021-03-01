import { mockInstanceOf, mockStructure, mockGlobal } from "screeps-jest";
import { RoomSourceUtils } from "./RoomSourceUtils";
import { NO_FULL_SCAN_DONE, NO_FULL_SCAN_DONE_LINKED } from "../ConstantUtils";
import { RoomConstructionSiteUtils } from "./RoomConstructionSiteUtils";
import { RoomCreepUtils } from "./RoomCreepUtils";

describe("Room Creeps Utils, ", () => {
  describe("scan", () => {
    it("should scan, room with 1 hostile creep, no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));
      const hostileCreepRoom = mockInstanceOf<Room>({
        name: "origineRoomWithOneHostileCreep"
      });
      const constructionSiteOwner = mockInstanceOf<Owner>({
        username: "hostile"
      });
      const hostileCreep1 = mockInstanceOf<Creep>(
        {
          id: "hostileCreep1" as Id<Creep>,
          owner: constructionSiteOwner,
          room: hostileCreepRoom,
          body: [
            { type: "work", hits: 100 },
            { type: "move", hits: 100 },
            { type: "carry", hits: 100 }
          ],
          hits: 100,
          hitsMax: 1050,
          name: "worker",
          my: false,
          ticksToLive: 1200
        },
        true
      );
      const hostileCreepOption1 = mockInstanceOf<HostileCreepOptions>({
        id: "hostileCreep1" as Id<Creep>,
        roomName: "origineRoomWithOneHostileCreep",
        body: [
          { type: "work", hits: 100 },
          { type: "move", hits: 100 },
          { type: "carry", hits: 100 }
        ],
        hits: 100,
        hitsMax: 1050,
        hostile: true,
        owner: "hostile"
      });
      const hostileCreepMemory = mockInstanceOf<HostileCreepMemoryMap<HostileCreepOptions>>(
        {
          hostileCreep1: hostileCreepOption1
        },
        true
      );
      const origineRoomMemory = mockInstanceOf<RoomMemory>(
        {
          creeps: hostileCreepMemory
        },
        true
      );
      const origineRoomWithOneHostileCreep = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneHostileCreep",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_HOSTILE_CREEPS:
                return [hostileCreep1];
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
            case "hostileCreep1":
              return hostileCreep1;
            default:
              return null;
          }
        },
        rooms: { origineRoomWithOneHostileCreep: origineRoomWithOneHostileCreep }
      });

      let result: number = RoomCreepUtils.scanHostile(origineRoomWithOneHostileCreep);
      expect(result).toBe(OK);
    });

    it("should scan, room with 1 hostile creep, room is not available", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));
      const hostileCreepRoom = mockInstanceOf<Room>({
        name: "origineRoomWithOneHostileCreep"
      });
      const constructionSiteOwner = mockInstanceOf<Owner>({
        username: "hostile"
      });
      const hostileCreep1 = mockInstanceOf<Creep>(
        {
          id: "hostileCreep1" as Id<Creep>,
          owner: constructionSiteOwner,
          room: hostileCreepRoom,
          body: [
            { type: "work", hits: 100 },
            { type: "move", hits: 100 },
            { type: "carry", hits: 100 }
          ],
          hits: 100,
          hitsMax: 1050,
          name: "worker",
          my: false,
          ticksToLive: 1200
        },
        true
      );
      const hostileCreepOption1 = mockInstanceOf<HostileCreepOptions>({
        id: "hostileCreep1" as Id<Creep>,
        roomName: "origineRoomWithOneHostileCreep",
        body: [
          { type: "work", hits: 100 },
          { type: "move", hits: 100 },
          { type: "carry", hits: 100 }
        ],
        hits: 100,
        hitsMax: 1050,
        hostile: true,
        owner: "hostile"
      });
      const hostileCreepMemory = mockInstanceOf<HostileCreepMemoryMap<HostileCreepOptions>>(
        {
          hostileCreep1: hostileCreepOption1
        },
        true
      );
      const origineRoomMemory = mockInstanceOf<RoomMemory>(
        {
          creeps: hostileCreepMemory
        },
        true
      );
      const origineRoomWithOneHostileCreep = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneHostileCreep",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_HOSTILE_CREEPS:
                return [hostileCreep1];
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
              case "hostileCreep1":
                return hostileCreep1;
              default:
                return null;
            }
          },
          rooms: {}
        },
        true
      );

      let result: number = RoomCreepUtils.scanHostile(origineRoomWithOneHostileCreep);
      expect(result).toBe(NO_FULL_SCAN_DONE);
    });

    it("should scan, room exist but hostile creep didn't exist no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));
      const hostileCreepRoom = mockInstanceOf<Room>({
        name: "origineRoomWithOneHostileCreep"
      });
      const constructionSiteOwner = mockInstanceOf<Owner>({
        username: "hostile"
      });
      const hostileCreep1 = mockInstanceOf<Creep>(
        {
          id: "hostileCreep1" as Id<Creep>,
          owner: constructionSiteOwner,
          room: hostileCreepRoom,
          body: [
            { type: "work", hits: 100 },
            { type: "move", hits: 100 },
            { type: "carry", hits: 100 }
          ],
          hits: 100,
          hitsMax: 1050,
          name: "worker",
          my: false,
          ticksToLive: 1200
        },
        true
      );
      const hostileCreepOption1 = mockInstanceOf<HostileCreepOptions>({
        id: "hostileCreep1" as Id<Creep>,
        roomName: "origineRoomWithOneHostileCreep",
        body: [
          { type: "work", hits: 100 },
          { type: "move", hits: 100 },
          { type: "carry", hits: 100 }
        ],
        hits: 100,
        hitsMax: 1050,
        hostile: true,
        owner: "hostile"
      });
      const hostileCreepMemory = mockInstanceOf<HostileCreepMemoryMap<HostileCreepOptions>>(
        {
          hostileCreep1: hostileCreepOption1
        },
        true
      );
      const origineRoomMemory = mockInstanceOf<RoomMemory>(
        {
          creeps: hostileCreepMemory
        },
        true
      );
      const origineRoomWithOneHostileCreep = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneHostileCreep",
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
            default:
              return null;
          }
        },
        rooms: { origineRoomWithOneHostileCreep: origineRoomWithOneHostileCreep }
      });

      let result: number = RoomCreepUtils.scanHostile(origineRoomWithOneHostileCreep);
      expect(result).toBe(OK);
    });

    it("should scan, room with 1 hostile creep witch is not already save, no problem during the scan", () => {
      jest.mock("lodash", () => ({
        ...require.requireActual("lodash"),
        debounce: (fn: { cancel: jest.Mock<any, any> }) => {
          fn.cancel = jest.fn();
          return fn;
        }
      }));
      const hostileCreepRoom = mockInstanceOf<Room>({
        name: "origineRoomWithOneHostileCreep"
      });
      const constructionSiteOwner = mockInstanceOf<Owner>({
        username: "hostile"
      });
      const hostileCreep1 = mockInstanceOf<Creep>(
        {
          id: "hostileCreep1" as Id<Creep>,
          owner: constructionSiteOwner,
          room: hostileCreepRoom,
          body: [
            { type: "work", hits: 100 },
            { type: "move", hits: 100 },
            { type: "carry", hits: 100 }
          ],
          hits: 100,
          hitsMax: 1050,
          name: "worker",
          my: false,
          ticksToLive: 1200
        },
        true
      );
      const hostileCreepMemory = mockInstanceOf<HostileCreepMemoryMap<HostileCreepOptions>>({}, true);
      const origineRoomMemory = mockInstanceOf<RoomMemory>(
        {
          creeps: hostileCreepMemory
        },
        true
      );
      const origineRoomWithOneHostileCreep = mockInstanceOf<Room>(
        {
          name: "origineRoomWithOneHostileCreep",
          memory: origineRoomMemory,
          find: (type: number) => {
            switch (type) {
              case FIND_HOSTILE_CREEPS:
                return [hostileCreep1];
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
            case "hostileCreep1":
              return hostileCreep1;
            default:
              return null;
          }
        },
        rooms: { origineRoomWithOneHostileCreep: origineRoomWithOneHostileCreep }
      });

      let result: number = RoomCreepUtils.scanHostile(origineRoomWithOneHostileCreep);
      expect(result).toBe(OK);
    });
  });
});
