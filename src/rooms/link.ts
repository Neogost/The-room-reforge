const links = {
  run(room: Room) {
    let linksOrigin = _.filter(room.memory.structures, function (s) {
      return s.type === STRUCTURE_LINK && s.linkOrigine;
    });

    // No links here,
    if (!linksOrigin.length) {
      return;
    }

    let linksTarget = _.filter(room.memory.structures, function (s) {
      return s.type === STRUCTURE_LINK && !s.linkOrigine;
    });

    // No links here,
    if (!linksTarget.length) {
      return;
    }

    let linksTargetEmpty = _.filter(linksTarget, function (link) {
      let linkStructure = <StructureLink>Game.getObjectById(link.id);
      return linkStructure.store[RESOURCE_ENERGY] === 0;
    });

    // No links here,
    if (!linksTargetEmpty.length) {
      return;
    }

    _.forEach(linksOrigin, function (link) {
      let linkOrigin: StructureLink = <StructureLink>Game.getObjectById(link.id);
      if (linkOrigin && linkOrigin.cooldown === 0 && linkOrigin.store[RESOURCE_ENERGY] > 0) {
        let targetId = linksTargetEmpty[0];
        let target = <StructureLink>Game.getObjectById(targetId.id);
        linkOrigin.transferEnergy(target);
      }
    });
  }
};

export default links;
