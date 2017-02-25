/*
 * Load in all of the various modules we'll be using.
 */
var roleHarvester = require('roles.Harvester');

// Screeps Main CPU Loop
module.exports.loop = function () {

  if(Game.spawns['Alpha'].spawning) {
    var spawningCreep = Game.creeps[Game.spawns['Alpha'].spawning.name];
    Game.spawns['Alpha'].room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Alpha'].pos.x + 1,
      Game.spawns['Alpha'].pos.y,
      {align: 'left', opacity: 0.8});
  }

  for(var name in Game.creeps) {
    var creep = Game.creeps[name];

    if(creep.memory.role == 'harvester') {
        roleHarvester.run(creep);
    }
  }

  roleHarvester.spawn();
}
