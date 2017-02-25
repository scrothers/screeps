var harvester = require('Harvester');
var spawnFrom = require('Spawner');
var builder = require('builder');
var cpuUsage = require('measureCPU');
var cleanMemory = require('cleanMemory');
var defense = require('Defense');

module.exports.loop = function()
{
	var reportInitializeCpuUsed = Game.getUsedCpu();
	//console.log('Initialize required modules CPU: ' + reportInitializeCpuUsed);

	//Triggers a function every 'defaultWait' ticks.
	var defaultWait = 20;
	var defaultLongWait = 1000;
	var gameTime = Game.time;
	var enemyInSpawn;

	//if(Memory.waitForTicks == null || Memory.waitForTicks-- <= 0)
	if(gameTime % defaultWait == 0) {
		cleanMemory();
		//cleanMemory.purgeFlagsWithId("123");
		//cleanMemory.purgeFlags();
		//cleanMemory.purgeRole('builder');
		//cleanMemory.purgeScoutInfo();

		enemyInSpawn = defense.detectEnemyCreep();
		//Memory.waitForTicks = defaultWait;
	}
	//else if(Memory.waitForLong == null || Memory.waitForLong-- <= 0)
	else if((gameTime+5) % defaultLongWait == 0)	//This overlaps defaultWait so we offset it by 5 ticks to make sure they're seperate
	{
		var nextRoom = _.find(Game.rooms, 'controller.owner.username', 'Crothers');
		//for(var eachRoom in Game.rooms)
		//{
		//	var nextRoom = Game.rooms[eachRoom];
		//	if(nextRoom.controller != null && nextRoom.controller.owner != null &&
		//		nextRoom.controller.owner.username == 'RaskVann')
		//	{
				//Rooms I own
				harvester.link(nextRoom);	//Create links near sources
				spawnFrom.createSpawn(nextRoom);	//Create additional spawns, power spawn and observers
		//	}
		//	else
		//	{
		//		//Rooms I don't own
		//	}
		//}

		//TO DO: Create extensions if doesn't exist
		//TO DO: Walls / ramparts to secure exits
		//Memory.waitForLong = defaultLongWait;
	}

	var reportPeriodic = Game.getUsedCpu()-reportInitializeCpuUsed;
	if(cpuLimit > 200)	//Disable room look if we're low on cpu
	{
		var nextRoom = _.find(Game.rooms, 'controller.owner.username', 'Crothers');
		//for(var eachRoom in Game.rooms)
		//{
		//	var nextRoom = Game.rooms[eachRoom];
		//	if(nextRoom.controller != null && nextRoom.controller.owner != null &&
		//		nextRoom.controller.owner.username == 'RaskVann')
		//	{
				//Rooms I own
				defense.observe(nextRoom);	//Use observer to analyse nearby rooms
				defense.tower(nextRoom, enemyInSpawn);	//Towers attack sent in enemy
		//	}
		//	else
		//	{
		//		//Rooms I don't own
		//	}
		//}
	}
	var reportLookThroughRooms = Game.getUsedCpu() - reportInitializeCpuUsed - reportPeriodic;

    var buildersSeen = 0;
	var harvestersSeen = 0;
	var gatherersSeen = 0;
	var attackersSeen = 0;
	var scoutsSeen = 0;
	var previousScoutState = 'ready';
    var individualCPU = Game.getUsedCpu();
    for(var name in Game.creeps)
    {
        var creep = Game.creeps[name];
		var role = creep.memory.role;

		if(role == 'worker' || role == 'lazy')
		{
			harvester.work(creep, harvestersSeen);
			harvestersSeen++;
		}
		else if(role == 'gather')
		{
			harvester.gather(creep, gatherersSeen);
			gatherersSeen++;
		}
		else if(role == 'builder')
        {
			builder.units(creep, buildersSeen);
    	    buildersSeen++;
        }
		else if(role == 'attack' || role == 'defend')
		{
			defense.attack(creep, attackersSeen);
			attackersSeen++;
		}
		else if(role == 'scout')
		{
			//if(cpuLimit > 100)
				previousScoutState = defense.scout(creep, scoutsSeen, previousScoutState);
			scoutsSeen++;
		}
		else if(role == 'attackPower' || role == 'healPower' || role == 'rangedPower')
		{
			defense.attackPower(unit);
		}

}
