var roleHarvester = require('role.Harvester');
var roleUpgrader = require('role.Upgrader');

module.exports.loop = function () {
    // Clear out memory from deleted or dead creeps within the game.
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    /**
     * Automatic Builder System
     *
     */
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

    if(harvesters.length < 2) {
        var newName = Game.spawns['Alpha'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    }

    if(harvesters.length < 1) {
        var newName = Game.spawns['Alpha'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
    }

    if(Game.spawns['Alpha'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Alpha'].spawning.name];
        Game.spawns['Alpha'].room.visual.text(
            spawningCreep.memory.role,
            Game.spawns['Alpha'].pos.x + 1,
            Game.spawns['Alpha'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}
