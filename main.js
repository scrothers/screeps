/*
 * Load in all of the various modules we'll be using.
 */
var roleHarvester = require('roles/harvester');

// Screeps Main CPU Loop
module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        roleHarvester.run(creep);
    }
}
