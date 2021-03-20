Room.prototype.addLinked = function (roomName: string): void {
  if (!this.memory.linked) {
    this.initializeLinkedRoom();
  }
  let data = _.get(this.memory.linked, [roomName]);
  // If not exist, add it
  if (data === undefined) {
    _.set(this.memory.linked, [roomName], {});
  }
};
Room.prototype.addScouted = function (roomName: string): void {
  if (!this.memory.scouted) {
    this.initializeScoutedRoom();
  }
  let data = _.get(this.memory.scouted, [roomName]);
  // If not exist, add it
  if (data === undefined) {
    _.set(this.memory.scouted, [roomName], {});
  }
};

Room.prototype.removeScouted = function (roomName: string): void {
  if (this.memory.scouted[roomName as any]) {
    delete this.memory.scouted[roomName as any];
  } else {
    // Do nothing
  }
};

Room.prototype.removeLinked = function (roomName: string): void {
  if (this.memory.linked[roomName as any]) {
    delete this.memory.linked[roomName as any];
  } else {
    // Do nothing
  }
};

Room.prototype.setConsus = function (role: string, value: number) {
  if (!this.memory.consus) {
    this.initializeConsus();
  }
  _.set(this.memory.consus, [role], value);
};

Room.prototype.saveStructures = function saveStructures(): void {
  // var self = this;
  // _.forEach(this.memory.structures, function (values, key) {
  //   let structure: Structure | null = Game.getObjectById(key as any);
  //   if (!structure) {
  //     delete self.memory.structures[key];
  //   }
  // });
};

Room.prototype.isLinkedRoom = function (): boolean {
  // find in my rooms memory if this room is a linked room
  let roomsInMemory = Memory.rooms;
  let isNotLinkedRoom: boolean = true;
  _.forEach(roomsInMemory, (roomMemory, roomInMemoryName) => {
    // Have a name
    if (roomInMemoryName) {
      let room = Game.rooms[roomInMemoryName];
      // just scan my rooms
      if (room && room.controller && room.controller.my) {
        if (roomMemory.linked[this.name as any]) {
          isNotLinkedRoom = false;
        }
      }
    }
    // if the room is a linked room, return false
    return isNotLinkedRoom;
  });
  // return the real statut
  return !isNotLinkedRoom;
};

Room.prototype.defend = function defend(): void {
  //Logger.info(this.name + " - Scan for enemy ");
  /*
  let hostileCreeps: List<Creep> = this.find(FIND_HOSTILE_CREEPS);

  // If hostile creep exist
  if (hostileCreeps.length) {
    Logger.warning("Hotile creep detect in room : " + this.name);
    this.createFlag(25, 25, "defend." + this.name, COLOR_RED, COLOR_BLUE);
  } else {
    if (Game.flags["defend." + this.name]) {
      let flag = Game.flags["defend." + this.name];
      flag.remove();
    }
  }
  */
};
