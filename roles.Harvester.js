module.exports = {
  /**
   * Create additional harversters according to specification.
   */
  spawn: function() {
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');

    if(harvesters.length < 2) {
      var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
      console.log('Spawning new harvester: ' + newName);
    }
  }

  /**
   * Control creeps and make them harvest.
   *
   * @param {Creep} creep
   */
  run: function(creep) {
    if(creep.carry.energy < creep.carryCapacity) {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
    }
    else {
      if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.spawns['Spawn1']);
      }
    }
  }
};
