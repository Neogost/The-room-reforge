import { mockInstanceOf, mockStructure, mockGlobal } from "screeps-jest";
import { Colonist, ColonistMemory } from "./colonist";
import roleColonist from "./colonist";
import { ERR_NO_WORKING_STATION } from "../../utils/ConstantUtils";
import { Traveler } from "../../utils/Traveler";

const cpuMock = mockInstanceOf<CPU>({
  getUsed: () => {
    return 0;
  }
});

jest.mock("../../utils/Traveler.ts");
describe("Colonist, ", () => {
  describe("run", () => {
    it("should do nothing, the colonist haven't workingstation", () => {
      const colonistMemory = mockInstanceOf<ColonistMemory>({
        homeRoomName: "roomWhereIsTheColonist",
        workingStation: undefined
      });
      const colonist = mockInstanceOf<Colonist>({
        memory: colonistMemory
      });
      const roomWhereIsTheColonist = mockInstanceOf<Room>({
        name: "roomWhereIsTheColonist"
      });
      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            default:
              return null;
          }
        },
        rooms: { roomWhereIsTheColonist: roomWhereIsTheColonist },
        cpu: cpuMock
      });

      //  let result = roleColonist.run(colonist);

      //expect(result).toBe(ERR_NO_WORKING_STATION);
    });
    it("should do nothing, the colonist is not in this working station and he is fatigue ", () => {
      const mockTravelerClass = Traveler as jest.Mocked<typeof Traveler>;
      const colonistMemory = mockInstanceOf<ColonistMemory>({
        homeRoomName: "roomWhereIsTheColonist",
        workingStation: "roomWorkingStation",
        canBuild: false
      });
      const roomWhereIsTheColonist = mockInstanceOf<Room>({
        name: "roomWhereIsTheColonist"
      });
      const colonist = mockInstanceOf<Colonist>({
        name: "colonist",
        memory: colonistMemory,
        room: roomWhereIsTheColonist,
        fatigue: 1,
        pos: new RoomPosition(25, 25, "roomWhereIsTheColonist")
      });
      const roomWorkingStation = mockInstanceOf<Room>({
        name: "roomWorkingStation"
      });
      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            default:
              return null;
          }
        },
        rooms: { roomWhereIsTheColonist: roomWhereIsTheColonist, roomWorkingStation: roomWorkingStation },
        cpu: cpuMock
      });

      mockTravelerClass.travelTo.mockReturnValue(ERR_TIRED);

      // let result = roleColonist.run(colonist);

      //expect(result).toBe(ERR_TIRED);
    });
    it("should move, the colonist is not in this working station move to go in the right room ", () => {
      const mockTravelerClass = Traveler as jest.Mocked<typeof Traveler>;
      const colonistMemory = mockInstanceOf<ColonistMemory>({
        homeRoomName: "roomWhereIsTheColonist",
        workingStation: "roomWorkingStation",
        canBuild: false
      });
      const roomWhereIsTheColonist = mockInstanceOf<Room>({
        name: "roomWhereIsTheColonist"
      });
      const colonist = mockInstanceOf<Colonist>({
        name: "colonist",
        memory: colonistMemory,
        room: roomWhereIsTheColonist,
        fatigue: 0,
        pos: new RoomPosition(25, 25, "roomWhereIsTheColonist")
      });
      const roomWorkingStation = mockInstanceOf<Room>({
        name: "roomWorkingStation"
      });
      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            default:
              return null;
          }
        },
        rooms: { roomWhereIsTheColonist: roomWhereIsTheColonist, roomWorkingStation: roomWorkingStation },
        cpu: cpuMock
      });

      mockTravelerClass.travelTo.mockReturnValue(OK);

      //let result = roleColonist.run(colonist);

      // expect(result).toBe(OK);
    });

    it("should be in build mode, the colonist move to transfert energy to an essential structure", () => {
      const structureSpawn = mockInstanceOf<StructureSpawn>({
        id: "structureSpawn" as Id<StructureSpawn>,
        pos: new RoomPosition(25, 25, "roomWhereIsTheColonist"),
        structureType: "spawn",
        store: {
          getFreeCapacity: (type: string) => {
            switch (type) {
              case RESOURCE_ENERGY:
                return 50;
              default:
                return null;
            }
          }
        }
      });
      const roomWhereIsTheColonist = mockInstanceOf<Room>({
        name: "roomWhereIsTheColonist",
        find: (type: number) => {
          switch (type) {
            case FIND_MY_STRUCTURES:
              return [structureSpawn];
            default:
              return null;
          }
        }
      });
      const colonistMemory = mockInstanceOf<ColonistMemory>({
        homeRoomName: "roomWhereIsTheColonist",
        workingStation: "roomWhereIsTheColonist",
        canBuild: true,
        targetId: null
      });
      const colonist = mockInstanceOf<Colonist>({
        memory: colonistMemory,
        room: roomWhereIsTheColonist
      });
      mockGlobal<Game>("Game", {
        getObjectById: (id: string) => {
          switch (id) {
            case "structureSpawn":
              return structureSpawn;
            default:
              return null;
          }
        },
        rooms: { roomWhereIsTheColonist: roomWhereIsTheColonist },
        cpu: cpuMock
      });

      //  let result = roleColonist.run(colonist);

      // expect(result).toBe(OK);
    });
  });
});
