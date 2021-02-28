import { List } from "lodash";

RoomPosition.prototype.getNearByPositions = function getNearByPositions(): Array<RoomPosition> {
  var positions = [];

  let startX = this.x - 1 || 1;
  let startY = this.y - 1 || 1;

  for (var x: number = startX; x <= this.x + 1 && x < 49; x++) {
    for (var y: number = startY; y <= this.y + 1 && y < 49; y++) {
      if (x !== this.x || y !== this.y) {
        positions.push(new RoomPosition(x, y, this.roomName));
      }
    }
  }

  return positions;
};

RoomPosition.prototype.getOpenPositions = function getOpenPositions(): Array<RoomPosition> {
  // Listes des cellules proches
  let nearbyPositions = this.getNearByPositions();

  // Récupération du typede terrain
  let terrain = Game.map.getRoomTerrain(this.roomName);

  // On récupère que les cellules ou l'on peu marcher dessus
  let walkablePositions: List<RoomPosition> = _.filter(nearbyPositions, function (pos) {
    return terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL;
  });

  // On retire les cellules utilisé par des creeps
  let freePositions = _.filter(walkablePositions, function (pos) {
    return !pos.lookFor(LOOK_CREEPS).length;
  });
  return freePositions;
};
