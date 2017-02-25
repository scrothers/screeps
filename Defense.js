/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Defense'); // -> 'a thing'
 */

 var followFlagForward = require('createPathFlags');
 //var spawnFrom = require('Spawner');

 //Recorded by how many units we've assigned a harvest spot to in this room.
 function getNeedHarvest(spawn)
 {
	if(spawn.memory.needHarvest0 == null)
	{
		spawn.memory.needHarvest0 = 0;
		spawn.memory.needHarvest1 = 0;
		spawn.memory.needHarvest2 = 0;
		spawn.memory.needHarvest3 = 0;
	}
	return(spawn.memory.needHarvest0);
 }

 //Populate the next non-filled needHarvest, returns null if full.
 //WARNING: This can fail, technically if harvest or gatherer is a >0 value we're still using this spot
 function addNeedHarvest(spawn, value)
 {
	if(spawn.memory.needHarvest0 == null || spawn.memory.needHarvest0 <= 0)
	{
		spawn.memory.needHarvest0 = value;
		spawn.memory.needHarvest1 = 0;
		spawn.memory.needHarvest2 = 0;
		spawn.memory.needHarvest3 = 0;
		return(spawn.memory.needHarvest0);
	}
	else if(spawn.memory.needHarvest1 == null || spawn.memory.needHarvest1 <= 0)
	{
		spawn.memory.needHarvest1 = value;
		spawn.memory.needHarvest2 = 0;
		spawn.memory.needHarvest3 = 0;
		return(spawn.memory.needHarvest1);
	}
	else if(spawn.memory.needHarvest2 == null || spawn.memory.needHarvest2 <= 0)
	{
		spawn.memory.needHarvest2 = value;
		spawn.memory.needHarvest3 = 0;
		return(spawn.memory.needHarvest2);
	}
	else if(spawn.memory.needHarvest3 == null || spawn.memory.needHarvest3 <= 0)
	{
		spawn.memory.needHarvest3 = value;
		return(spawn.memory.needHarvest3);
	}
	return(null);
 }

 function nextNeedHarvest(spawn)
 {
	//If we still have valid units to spawn, give the currentID, otherwise push list closer to top.
	if(spawn == null)
	{
		return(null);
	}
	else if(spawn.memory.needGather0 > 0 || spawn.memory.needHarvest0 > 0)
	{
		var updateHarvest = spawn.memory.needHarvest0--;
		updateHarvestGatherList(spawn);
		return(updateHarvest);
	}
	else
	{
		updateHarvestGatherList(spawn);
		return(spawn.memory.needHarvest0);
	}
 }

 //Push all three parts of the list closer to the top to be retrieved, no more gatherers
 //or harvesters were found.
 function updateHarvestGatherList(spawn)
 {
	var resetValue = -1;
	if(spawn != null && spawn.memory.needGather0 <= 0 && spawn.memory.needHarvest0 <= 0)
	{
		spawn.memory.needHarvest0 = spawn.memory.needHarvest1;
		spawn.memory.needHarvest1 = spawn.memory.needHarvest2;
		spawn.memory.needHarvest2 = spawn.memory.needHarvest3;
		spawn.memory.needHarvest3 = resetValue;

		spawn.memory.needGather0 = spawn.memory.needGather1;
		spawn.memory.needGather1 = spawn.memory.needGather2;
		spawn.memory.needGather2 = spawn.memory.needGather3;
		spawn.memory.needGather3 = resetValue;

		spawn.memory.harvestId0 = spawn.memory.harvestId1;
		spawn.memory.harvestId1 = spawn.memory.harvestId2;
		spawn.memory.harvestId2 = spawn.memory.harvestId3;
		spawn.memory.harvestId3 = resetValue;
	}
 }

 function getNeedGather(spawn)
 {
	if(spawn.memory.needGather0 == null)
	{
		spawn.memory.needGather0 = 0;
		spawn.memory.needGather1 = 0;
		spawn.memory.needGather2 = 0;
		spawn.memory.needGather3 = 0;
	}
	return(spawn.memory.needGather0);
 }

 //Populate the next non-filled needGather, returns null if full
 //WARNING: This can fail, technically if harvest or gatherer is a >0 value we're still using this spot
 function addNeedGather(spawn, value)
 {
	if(spawn.memory.needGather0 == null || spawn.memory.needGather0 <= 0)
	{
		spawn.memory.needGather0 = value;
		spawn.memory.needGather1 = 0;
		spawn.memory.needGather2 = 0;
		spawn.memory.needGather3 = 0;
		return(spawn.memory.needGather0);
	}
	else if(spawn.memory.needGather1 == null || spawn.memory.needGather1 <= 0)
	{
		spawn.memory.needGather1 = value;
		spawn.memory.needGather2 = 0;
		spawn.memory.needGather3 = 0;
		return(spawn.memory.needGather1);
	}
	else if(spawn.memory.needGather2 == null || spawn.memory.needGather2 <= 0)
	{
		spawn.memory.needGather2 = value;
		spawn.memory.needGather3 = 0;
		return(spawn.memory.needGather2);
	}
	else if(spawn.memory.needGather3 == null || spawn.memory.needGather3 <= 0)
	{
		spawn.memory.needGather3 = value;
		return(spawn.memory.needGather3);
	}
	return(null);
 }

 function nextNeedGather(spawn)
 {
	//If we still have valid units to spawn, give the currentID, otherwise push list closer to top.
	if(spawn == null)
	{
		return(null);
	}
	else if(spawn.memory.needGather0 > 0 || spawn.memory.needHarvest0 > 0)
	{
		var updateHarvest = spawn.memory.needGather0--;
		updateHarvestGatherList(spawn);
		return(updateHarvest);
	}
	else
	{
		updateHarvestGatherList(spawn);
		return(spawn.memory.needGather0);
	}
 }

 function getHarvestId(spawn)
 {
	if(spawn != null)
	{
		if(spawn.memory.harvestId0 == null)
		{
			spawn.memory.harvestId0 = -1;
			spawn.memory.harvestId1 = -1;
			spawn.memory.harvestId2 = -1;
			spawn.memory.harvestId3 = -1;
		}
		return(spawn.memory.harvestId0);
	}
	return(null);
 }

 //Returns the most recently added harvestId, if none are found in the list returns null
 function harvestIdInList(spawn, id)
 {
	return(spawn.memory.harvestId3 == id ||
		spawn.memory.harvestId2 == id ||
		spawn.memory.harvestId1 == id ||
		spawn.memory.harvestId0 == id);
 }

 //Populate the next non-filled harvestId, returns null if full
 function addHarvestId(spawn, id)
 {
	if(spawn.memory.harvestId0 == null || spawn.memory.harvestId0 == -1)
	{
		spawn.memory.harvestId0 = id;
		spawn.memory.harvestId1 = -1;
		spawn.memory.harvestId2 = -1;
		spawn.memory.harvestId3 = -1;
		return(spawn.memory.harvestId0);
	}
	else if(spawn.memory.harvestId1 == null || spawn.memory.harvestId1 == -1)
	{
		spawn.memory.harvestId1 = id;
		spawn.memory.harvestId2 = -1;
		spawn.memory.harvestId3 = -1;
		return(spawn.memory.harvestId1);
	}
	else if(spawn.memory.harvestId2 == null || spawn.memory.harvestId2 == -1)
	{
		spawn.memory.harvestId2 = id;
		spawn.memory.harvestId3 = -1;
		return(spawn.memory.harvestId2);
	}
	else if(spawn.memory.harvestId3 == null || spawn.memory.harvestId3 == -1)
	{
		spawn.memory.harvestId3 = id;
		return(spawn.memory.harvestId3);
	}
	return(null);
 }

 //Used to verify if we can safely give the spawn more requests for harvesters and gatherers. Each time everything is pulled from the first
 //slot 0, the requests filter down so slot 1 becomes slot 0 and so on. We can verify if the scouts can safely populate this list if the
 //list is empty (otherwise spawner is still working on a previous set of requests) by checking the harvest0 and gather0 slots
 function harvestEmpty(spawn)
 {
	//If the need for harvesters and gatherers have been populated, check if they've been set to their "I'm empty" values
	//if so return true
	if(spawn != null && spawn.memory != null && spawn.memory.needHarvest0 != null && spawn.memory.needGather0 != null)
	{
		return(spawn.memory.needHarvest0 <= 0 && spawn.memory.needGather0 <= 0);
	}
	else if(spawn == null)
	{
		console.log('Can not retrieve. harvest list is empty, given ' + spawn + ' which is null');
		return(null);
	}
	else 	//otherwise it hasn't been populated, and is empty. Allow scouts to populate the list
	{
		return(true);
	}
 }

 //Check if one of these has been created in the sent in room. If one exists send back null otherwise let this
 //unit be made with the returned name.
 function createOneInRoom(role, roomName)
 {
	var nextName = role + '0' + roomName;
	if(Memory.creeps[nextName] != null)
		return(null);
	else
		return(nextName);
 }

 function findNextUnusedName(role, roomName)
 {
	var num = 0;
	var nextName = role + num + roomName;
	var count = 0;
	var countMax = 50;

	while(Memory.creeps[nextName] != null && count < countMax)
	{
		num++;
		nextName = role + num + roomName;
		count++;
	}

	if(count >= countMax)
	{
		console.log('Trying to find name for ' + role + ' in ' + roomName + ' failed, max attempts reached.');
		return(null);
	}
	else
	{
		return(nextName);
	}
 }

 //Note: Until this switches to store everything within the room that is relevant, any scout
 //		will happily create any available worker/gather as long as any unit is in the source room.
 //Takes unit that is within a room that needs units (currently workers and gatherers).
 //If these units haven't been created yet it stores the needed information in memory for creation
 //and adds the unit to the end of the respawn list of the spawner that created this unit
 function createMemoryNew(unit)
 {
	var spawner = getSpawnId(unit);
	var sourceId = getHarvestId(spawner);	//TO DO: Convert to store and pull from unit.room, not spawn.room
	var source = Game.getObjectById(sourceId);
	var length;
	var role;
	var name;
	var claimName;
	var num = 0;

	//TO DO: Convert to store and pull from unit.room, not spawn.room
	if(source != null && source.room != null &&
		harvestEmpty(spawner) == false)
	{
		claimName = createOneInRoom('claim', source.room.name);	//Attempt to pair worker/gather generation with 1 claim unit.

		if(getNeedHarvest(spawner) > 0)
		{
			role = 'worker';
			name = findNextUnusedName(role, source.room.name);
		}
		else if(getNeedGather(spawner) > 0)
		{
			role = 'gather';
			name = findNextUnusedName(role, source.room.name);
		}
		else
		{
			console.log(unit.name + ' has not found any needed new units in ' + unit.room.name);
			return(false);
		}

		//The length this unit needs to travel should exceed this number by some amount, but this is a good ballpark
		if(unit.memory.pathLength != null)
		{
			length = Math.max(unit.memory.pathLength, unit.memory.distanceMoved);
		}
		else
		{
			length = 25;
		}
	}
	else
	{
		return(false);
	}

	if( spawner != null &&
		role != null && name != null && length != null &&
		Memory.creeps[name] == null &&
		(sourceId != -1 && sourceId != 0) )
	{
		console.log(unit.name + ' just added ' + name + ' to room: ' + unit.room.name + ' to end of respawn list.');

		Memory.creeps[name] = {'role': role, 'usingSourceId': sourceId, 'spawnId': unit.memory.spawnId, 'pathLength': length};
		spawner.memory.respawnName += (name+",");

		//If worker/gather found that a claim doesn't exist, create it for this room.
		if(claimName != null)// && Memory.creeps[claimName] == null
		{
			Memory.creeps[claimName] = {'role': 'claim', 'usingSourceId': source.room.name, 'spawnId': unit.memory.spawnId, 'pathLength': length};
			spawner.memory.respawnName += (claimName+",");
		}

		if(role == 'worker')
		{
			nextNeedHarvest(spawner);	//This need is filled, decrease or remove
		}
		else if(role == 'gather')
		{
			nextNeedGather(spawner);	//This need is filled, decrease or remove
		}
		else
		{
			console.log('not handling role: ' + role + ' in creation of memory of unit, check createMemoryNew(unit)');
		}
		return(true);
	}
	else
	{
		console.log(unit.name + ' missing spawn: ' + spawner + ' role: ' + role + ' new name: ' + name + ' id: ' + sourceId + ' or memory already exists: ' + Memory.creeps[name] + ' disabling creation of unit');
		return(false);
	}
 }

 function requestScout(unit, useSpawn)
 {
	useSpawn.memory.requestScout = 1;	//Replace the unit with one from spawn
	var report = removeScout(unit);
	return(report);
 }

 function populateExitMax(currentRoom)
 {
	if(currentRoom != null && currentRoom.memory.exitMax == null)
	{
		var roomExits = Game.map.describeExits(currentRoom.name);
		var countExits = 0;
		for(var i in roomExits)
		{
			if(roomExits[i] != null)
			{
				countExits++;
			}
		}
		currentRoom.memory.exitMax = countExits;
		return(true);
	}
	console.log('populate exit got a null room: ' + currentRoom);
	return(false);
 }

 function nextRoomManager(unit, currentRoom, useSpawn)
 {
	var newExit;
	//The first time the room is entered by a scout. Populate the exit information and if a dead end
	//go ahead and kill the scout here otherwise move on to existing exit logic
	//This will mess up if the scout bounces back and forth between rooms for any length of time
	if(currentRoom.memory.exitMax == null)
	{
		//Find and assign how many exits are in this room
		currentRoom.memory.exitsVisited = 0;
		populateExitMax(currentRoom);

		//If found another user owned room. Remove unit and update previous room to look at next room
		if(currentRoom.controller != null && currentRoom.controller.owner != null &&
			currentRoom.controller.owner.username != 'RaskVann')
		{
			currentRoom.memory.exitsVisited = currentRoom.memory.exitMax;
			currentRoom.memory.owner = currentRoom.controller.owner.username;
			currentRoom.memory.threat = evaluateThreat(currentRoom);

			if(unit.memory.previousRoom != null)
				Memory.rooms[unit.memory.previousRoom].exitsVisited++;
			else
				console.log(unit.name + ' doesnt have previous room defined before ' + currentRoom.name + ' but this room is owned by ' + currentRoom.controller.owner.username + ' and needs turned into dead-end');

			return(requestScout(unit, useSpawn));
		}

		//Look for next relevant room to go to
		newExit = findNextRoom(unit, currentRoom);
		if(newExit == null)	//All remaining rooms have been visited, end of this route
		{
			console.log(unit.name + ' cant find exit when no exitMax exists so requesting new unit.');
			return(requestScout(unit, useSpawn));
		}
	}
	else if(currentRoom.memory.exitsVisited < currentRoom.memory.exitMax)
	{
		newExit = getRoomForExit(unit, currentRoom.memory.exitsVisited);
		if(newExit == null)	//All remaining rooms have been visited, end of this route
		{
			console.log(unit.name + ' cant find exit when visit < max so requesting new unit.');
			return(requestScout(unit, useSpawn));
		}
	}
	else
	{
		console.log(unit.name + ' visit is greater or equal then max. ' + currentRoom.memory.exitsVisited + ' of ' + currentRoom.memory.exitMax);
		return(requestScout(unit, useSpawn));
	}

	return(newExit);
 }

 function getRoomForExit(unit, value)
 {
	var roomExits = Game.map.describeExits(unit.room.name);

	var count = 0;
	for(var x in roomExits)
	{
		if(roomExits[x] != null && count++ == value)
		{
			if(Memory.rooms[roomExits[x]] != null &&
				Memory.rooms[roomExits[x]].exitsVisited != null &&
				Memory.rooms[roomExits[x]].exitsVisited >= Memory.rooms[roomExits[x]].exitMax)
			{
				//If what we'd return is a room that is already found to be a dead end this room
				//isn't valid and we should try the next one
				console.log(unit.name + ' this exit is a dead end. Try to find next room in ' + unit.room.name);
				Memory.rooms[unit.room.name].exitsVisited++;	//Can cause unit to turn back.
				return(findNextRoom(unit, unit.room));

				//if(Memory.rooms[unit.room.name].exitsVisited >= Memory.rooms[unit.room.name].exitMax)
				//{
				//	if(unit.memory.previousRoom != null)
				//		Memory.rooms[unit.memory.previousRoom].exitsVisited++;
				//	else
				//		console.log(unit.name + ' doesnt have previous room defined before ' + unit.room.name + ' needs turned into dead-end');
				//
				//	return(null);
				//}
				//value++;
			}
			else
			{
				console.log('retrieving exit: ' + roomExits[x]);
				return(roomExits[x]);
			}
		}
	}
	console.log(unit.name + ' ran out of exits to look at in ' + unit.room.name);
	return(null);
 }

 function removeScout(unit)
 {
	for(var i in Memory.creeps)
	{
		//Assuming the list displayed in memory cycles through the list in the same order on the webpage as
		//in this array. The first found entry should be the oldest and therefore the one that needs deleted.
		if(Memory.creeps[i].role == unit.memory.role && unit.memory.usingSourceId == Memory.creeps[i].usingSourceId)
		{
			//console.log(unit.name + ' attempted to remove memory before death.');
			delete Memory.creeps[i];
			break;
		}
		else if(Memory.creeps[i].role == unit.memory.role)
		{
			//console.log(unit.name + ' was found for deletion, but usingSourceId didnt match, my assumptions were wrong.');
		}
	}
	console.log(unit.name + ' requested the scout be removed');
	unit.suicide();
	return('exploreEnd');
 }

 //WARNING: Assumes scouts will be the first in any given room, if any other code changes this
 //		(patrols, etc.) then will need to change this to check for rooms with scout data in it
 //		or other 'scouted' status has been triggered in each room.
 //TO DO: Check room memory instead of or in addition to accessible rooms for more accurate results?
 //Checks the current exitsVisited to see if we're already present there, we don't want to scout a place we've already
 //been and so we denote this room as a invalid candiate to scout and skip to the next exitsVisited if this is the case.
 //We should be returning either a valid room name to go to or null
 function findNextRoom(unit, currentRoom)
 {
	if(currentRoom.memory.exitsVisited < currentRoom.memory.exitMax)
	{
		//skip over all exits that go to all rooms we've previously visited
		var roomList = Game.rooms;
		var newExit;
		while(currentRoom.memory.exitsVisited < currentRoom.memory.exitMax)
		{
			newExit = getRoomForExit(unit, currentRoom.memory.exitsVisited);

			if(newExit == null)
			{	//Should mean this exit is a dead end. Look at next
				currentRoom.memory.exitsVisited++;
			}
			//As long as this exit hasn't been visited by a scout it's a valid route and we should go this way.
			else if(Memory.rooms[newExit] == null || Memory.rooms[newExit].exitsVisited == null)// ||
				//(Memory.rooms[newExit] != null && Memory.rooms[newExit].exitsVisited < Memory.rooms[newExit].exitMax))
			{
				console.log(unit.name + ' scout is retrieving exit: ' + newExit + ' in room: ' + currentRoom.name);
				return(newExit);
			}
			//As long as we have more exits to visit, go to the next exit and try again
			else if(currentRoom.memory.exitsVisited < currentRoom.memory.exitMax-1)
			{
				currentRoom.memory.exitsVisited++;
			}
			//Out of exits. Make this a dead end by increasing exitsVisisted to equal or exceed exitMax, update previousRoom to look at the next exit
			//because this is now a dead end.
			else
			{
				currentRoom.memory.exitsVisited++;
				//Could cause loop back.
				//If not a dead end then we can go there since it leads to a room that has yet to be explored.
				//if(unit.memory.previousRoom != null && Memory.rooms[unit.memory.previousRoom] != null &&
				//	Memory.rooms[unit.memory.previousRoom].exitsVisited != null)
				//{
				//	Memory.rooms[unit.memory.previousRoom].exitsVisited++;
				//	return(null);
				//}
				//else if(unit.memory.previousRoom == null)
				//{
				//	console.log(unit.name + ' expecting previousRoom defined but is null.');
				//}
				//else
				//{
				//	console.log(unit.name + ' should have previous ' + unit.memory.previousRoom + ' and exit should already be defined but arnt ' + Memory.rooms[unit.memory.previousRoom].exitsVisited);
				//}
				break;	//End condition, reached end of attempts, stop trying
			}
		}
	}
	//If a scout makes it into a room that is already a dead (or becomes a dead end) end then try to update the previous room to not point at this room anymore.
	else if(currentRoom.memory.exitsVisited >= currentRoom.memory.exitMax)
	{
		console.log(unit.name + ' exit visited is higher then exit max in ' + currentRoom.name + ', ' + currentRoom.memory.exitsVisited + ', ' + currentRoom.memory.exitMax);
		//Could cause loop back.
		//if(unit.memory.previousRoom != null && Memory.rooms[unit.memory.previousRoom] != null)
		//	Memory.rooms[unit.memory.previousRoom].exitsVisited++;
		//else
		//	console.log(unit.name + ' in ' + currentRoom.name + ' doesnt have previousRoom defined or room it points to. Error');

		return(null);
	}
	else if(currentRoom == null || currentRoom.memory.exitsVisited == null || currentRoom.memory.exitMax == null)
	{
		console.log(unit.name + ' in ' + currentRoom + ' looking for next room was given null values. SHOULD NEVER HAPPEN');
	}
	console.log(unit.name + ' All exits lead to rooms weve been to, end of path reached.');
	return(null);	//All exits lead to rooms we've been to, end of path reached.
	//return(getRoomForExit(unit, currentRoom.memory.exitsVisited));
 }

 //Only reason we're sending in a unit and requiring the unit to be in the same room as the route createDefinedPath
 //is findFlag takes a unit instead of a room to find flags. This does ensure that it's possible to create a flag there
 //So I'm not going to change it.
 function createPreviousExit(unit)
 {
	//var route = getRoute();
	var routePos = getRouteFromRoom(unit.room.name);
	var route = getRoutePos(routePos);
	if(route != null)
	{
		route = route[0];
	}

	if(route == null || (route != null && route.routeStart.roomName != unit.room.name))
	{
		//Unit doesn't exist in the room we're interested in to create a route, skip.
		return(false);
	}

	if(route != null && route.routeStart.roomName == unit.room.name &&
		followFlagForward.findFlag(unit, route.usingSourceId) != null)
	{
		//Flag has been found, so this route already exists in this room. Go ahead and remove
		removeRouteLocation(routePos);
		console.log(unit.name + ' found route ' + route.usingSourceId + ' in ' + unit.room + ' removing from list since already created.');
		return(true);
	}

	//We have more then enough time, and there is a unit in the
	//room we need access to, to create the path in flags
	if(Game.cpuLimit >= 500 && Game.cpu.getUsed() < 20 &&
		route != null && unit != null &&
		route.routeStart.roomName == unit.room.name)
	{
		var sourceId = route.usingSourceId;
		var currentRoom = unit.room;
		var startPosition = new RoomPosition(route.routeStart.x, route.routeStart.y, route.routeStart.roomName);
		var exit = new RoomPosition(route.routeEnd.x, route.routeEnd.y, route.routeEnd.roomName);
		var cap = route.cap;
		//console.log('Attempting Creation: found start: ' + startPosition + ' with route ' + sourceId + ' to exit: ' + exit);

		//If in room I control, make path from spawns to relevant exit, otherwise from current
		//position to the relevant exit.
		if(currentRoom.controller != null && currentRoom.controller.owner != null &&
			currentRoom.controller.owner.username == 'RaskVann')
		{
			var tempCPU = Game.cpu.getUsed();
			var routeMessage = (unit.name + ', pos: ' + unit.pos + ', spawn: ' + currentRoom + ', stop: ' + exit + ', id: ' + sourceId + ' route creation.');
			var pathMade = followFlagForward.createPathFromSpawn(exit, currentRoom, sourceId);
			tempCPU = Game.cpu.getUsed()-tempCPU;
			if(pathMade)
			{
				console.log('SUCCESS: ' + routeMessage + ' took cpu: ' + tempCPU);
				var length = Math.max(unit.memory.pathLength, unit.memory.distanceMoved);
				followFlagForward.addPathLength(sourceId, length, unit.room);
				removeRouteLocation(routePos);
				return(true);
			}
			else
			{
				console.log('FAIL: ' + routeMessage + ' took cpu: ' + tempCPU);
				return(false);
			}
		}
		else if(startPosition != null && exit != null && startPosition != exit)
		{
			var tempCPU = Game.cpu.getUsed();
			var routeMessage = (unit.name + ', pos: ' + unit.pos + ', room: ' + currentRoom + ', start: ' + startPosition + ', stop: ' + exit + ', id: ' + sourceId + ' capped: ' + cap + ' route creation.');
			var newPath = startPosition.findPathTo(exit, {maxOps: 4000, ignoreCreeps: true});
			if(newPath != null && newPath.length > 0)
			{
				var pathMade = followFlagForward.createDefinedPath(currentRoom, newPath, sourceId, cap, startPosition);
				tempCPU = Game.cpu.getUsed()-tempCPU;
				if(pathMade)
				{
					console.log('SUCCESS: ' + routeMessage + ' took cpu: ' + tempCPU);
					var length = Math.max(unit.memory.pathLength, unit.memory.distanceMoved);
					followFlagForward.addPathLength(sourceId, length, unit.room);
					removeRouteLocation(routePos);
					return(true);
				}
				else
				{
					console.log('FAIL: ' + routeMessage + ' took cpu: ' + tempCPU);
					//removeRouteLocation(routePos);
					return(false);
				}
			}
			else
			{
				console.log(unit.name + ' path is ' + newPath + ' or length ' + newPath.length + ' Message: ' + routeMessage);
				return(false);
			}
		}
		else
		{
			console.log(unit.name + ' trying to create path in room: ' + unit.room.name + ' with null values.');
		}
	}
	return(false);
 }

 //This unit creates a path in it's current room to the newExit passed in. It links itself to this new
 //path so it can follow it
 function createPathToExit(unit, currentRoom, newExit)
 {
	console.log('NewExit? ' + newExit + ' name: ' + newExit.name);
	//If can't find a flag in the room that matches id we're trying to create, create a path
	if(followFlagForward.findFlag(unit, newExit) == null)
	{
		var routeToExit = Game.map.findExit(currentRoom.name, newExit);
		var startPosition = new RoomPosition(unit.memory.startPos.x, unit.memory.startPos.y, unit.memory.startPos.roomName);
		var exit = startPosition.findClosestByRange(routeToExit);
		//console.log('found exit: ' + newExit + ' with route ' + routeToExit + ' at destination ' + exit);

		//If in room I control, make path from spawns to relevant exit, otherwise from current
		//position to the relevant exit.
		if(currentRoom.controller != null && currentRoom.controller.owner != null &&
			currentRoom.controller.owner.username == 'RaskVann')
		{
			if(followFlagForward.createPathFromSpawn(exit, currentRoom, newExit))
			{
				//There shouldn't be any scouts for this to send to, unless this is another spawn of mine
				return(newExit);
			}
		}
		else if(startPosition != null && exit != null)
		{
			//console.log(currentRoom + ', ' + startPosition + ', ' + exit + ', ' + newExit);
			if(followFlagForward.createDefinedPath(currentRoom, startPosition.findPathTo(exit, {maxOps: 2000, ignoreCreeps: true}), newExit, false, startPosition))
			{
				return(newExit);
			}
		}
		else
		{
			console.log(unit.name + ' trying to create path in room: ' + unit.room.name + ' with null values.');
		}
	}
	else
	{
		console.log(unit.name + ' in room ' + unit.room.name + ' trying to create path to exit but previous flag exists so canceling creation.');
	}
	return(null);
 }

 function threatString(threat)
 {
	var threatString;
	if(threat != null)
	{
		if(threat < 0)
		{
			threatString = 'friendly room, no enemy creeps';
		}
		else if(threat == 0)
		{
			threatString = 'no enemy creeps, uncontrolled room';
		}
		else if(threat == 1)
		{
			threatString = 'no enemy creeps, controlled room';
		}
		else if(threat == 2)
		{
			threatString = 'no enemy attacking body, no spawning capacity';
		}
		else if(threat == 3)
		{
			threatString = 'no enemy attacking body found, spawning capacity';
		}
		else if(threat == 4)
		{
			threatString = 'enemy attacking body found in past, room is in alert';
		}
		else if(threat == 5)
		{
			threatString = 'enemy attacking body < 5, does not grow during watch';
		}
		else if(threat == 6)
		{
			threatString = 'enemy attacking body < 10, does not grow during watch';
		}
		else if(threat == 7)
		{
			threatString = 'enemy attacking body < 20, does not grow during watch';
		}
		else if(threat == 8)
		{
			threatString = 'enemy attacking body >= 20, does not grow during watch';
		}
		else if(threat == 9)
		{
			threatString = 'enemy attacking body < 5, grows during watch';
		}
		else if(threat == 10)
		{
			threatString = 'enemy attacking body < 10, grows during watch';
		}
		else if(threat == 11)
		{
			threatString = 'enemy attacking body < 20, grows during watch';
		}
		else if(threat >= 12)
		{
			threatString = 'enemy attacking body >= 20, grows during watch';
		}
	}

	return(threatString);
 }

 function evaluateThreat(currentRoom)
 {
	//		-1 threat, friendly room, no enemy creeps
	//		0 threat no enemy creeps found, uncontrolled room
	//		1 threat no enemy creeps found, controlled room
	//		2 threat no enemy attacking body found, no spawning capacity
	//		3 threat no enemy attacking body found, spawning capacity,
	//TODO:	4 threat enemy attacking body found in past, room is in alert (save time and don't lower for +1500 ticks)
	//		5 threat enemy attacking body < 5, does not grow during watch
	//		6 threat enemy attacking body < 10, does not grow during watch
	//		7 threat enemy attacking body < 20, does not grow during watch
	//		8 threat enemy attacking body >= 20, does not grow during watch
	//TODO:	9 threat enemy attacking body < 5, grows during watch
	//TODO:	10 threat enemy attacking body < 10, grows during watch
	//TODO:	11 threat enemy attacking body < 20, grows during watch
	//TODO:	12 threat enemy attacking body >= 20, grows during watch
	var targetCreep = currentRoom.find(FIND_HOSTILE_CREEPS, {
		filter: function(object) {
			return((object.getActiveBodyparts(ATTACK) > 0 || object.getActiveBodyparts(RANGED_ATTACK) > 0 || object.getActiveBodyparts(HEAL) > 0 ||
					object.getActiveBodyparts(WORK) > 0 || object.getActiveBodyparts(CLAIM) > 0) &&
					object.owner.username != 'Source Keeper');
		}
	});
	var reportTime = 720;
	//TO DO: When we attack source keeper later, this will be a problem. we're leaving him out because
	//observer keeps reporting his creeps/rooms
	if(targetCreep != null && targetCreep.length > 0)
	{
		var totalHostileBody = 0;
		for(hostileUnit in targetCreep)
		{
			totalHostileBody += targetCreep[hostileUnit].getActiveBodyparts(RANGED_ATTACK);
			totalHostileBody += targetCreep[hostileUnit].getActiveBodyparts(ATTACK);
		}

		if(totalHostileBody <= 0)
		{
			var targetSpawns = currentRoom.find(FIND_HOSTILE_SPAWNS);
			if(currentRoom.memory.threat != null && currentRoom.memory.threat >= 4)
			{
				//TO DO: save time and don't lower for +1500 ticks. There was previously a threat and it has disappeared
				return(4);
			}
			else if(targetSpawns.length <= 0)
			{
				//console.log(currentRoom + ' has ' + targetCreep.length + ' creeps with 0 hostile body, no enemy spawns found');
				//Game.notify(currentRoom + ' has ' + targetCreep.length + ' creeps with 0 hostile body, no enemy spawns found', reportTime);
				return(2);
			}
			else
			{
				//console.log(currentRoom + ' has ' + targetCreep.length + ' creeps with 0 hostile body, ' + targetSpawns.length + ' spawns found, owned by ' + targetSpawns[0].owner.username);
				//Game.notify(currentRoom + ' has ' + targetCreep.length + ' creeps with 0 hostile body, ' + targetSpawns.length + ' spawns found, owned by ' + targetSpawns[0].owner.username, reportTime);
				return(3);
			}
		}
		else if(totalHostileBody < 5)
		{
			console.log(currentRoom + ' has ' + targetCreep.length + ' creeps with ' + totalHostileBody + ' hostile body, first unit owned by ' + targetCreep[0].owner.username);
			if(currentRoom.controller != null && targetCreep.owner.name != 'Invader')
				Game.notify(currentRoom + ' has ' + targetCreep.length + ' creeps with ' + totalHostileBody + ' hostile body, first unit owned by ' + targetCreep[0].owner.username, reportTime);
			if(currentRoom.memory.threat != null && currentRoom.memory.threat < 5)
			{
				if(currentRoom.memory.threat <= 4)
				{
					//TO DO: Previous threat didn't exist, it now does (between 1 and 4)
				}
				return(9);
			}
			return(5);
		}
		else if(totalHostileBody < 10)
		{
			console.log(currentRoom + ' has ' + targetCreep.length + ' creeps with ' + totalHostileBody + ' hostile body, first unit owned by ' + targetCreep[0].owner.username);
			if(currentRoom.controller != null && targetCreep.owner.name != 'Invader')
				Game.notify(currentRoom + ' has ' + targetCreep.length + ' creeps with ' + totalHostileBody + ' hostile body, first unit owned by ' + targetCreep[0].owner.username, reportTime);
			if(currentRoom.memory.threat != null && currentRoom.memory.threat < 6)
			{
				if(currentRoom.memory.threat <= 4)
				{
					//TO DO: Previous threat didn't exist, it now does (between 5-9)
				}
				else if(currentRoom.memory.threat == 5 || currentRoom.memory.threat == 9)
				{
					//TO DO: Previous threat was between 1-4, now grew to 5-9
				}
				return(10);
			}
			return(6);
		}
		else if(totalHostileBody < 20)
		{
			console.log(currentRoom + ' has ' + targetCreep.length + ' creeps with ' + totalHostileBody + ' hostile body, first unit owned by ' + targetCreep[0].owner.username);
			if(currentRoom.controller != null && targetCreep.owner.name != 'Invader')
				Game.notify(currentRoom + ' has ' + targetCreep.length + ' creeps with ' + totalHostileBody + ' hostile body, first unit owned by ' + targetCreep[0].owner.username, reportTime);
			if(currentRoom.memory.threat != null && currentRoom.memory.threat < 7)
			{
				if(currentRoom.memory.threat <= 4)
				{
					//TO DO: Previous threat didn't exist, it now does (between 10-19)
				}
				else if(currentRoom.memory.threat == 5 || currentRoom.memory.threat == 9)
				{
					//TO DO: Previous threat was between 1-4, now grew to 10-19
				}
				else if(currentRoom.memory.threat == 6 || currentRoom.memory.threat == 10)
				{
					//TO DO: Previous threat was between 5-9, now grew to 10-19
				}
				return(11);
			}
			return(7);
		}
		else
		{
			console.log(currentRoom + ' has ' + targetCreep.length + ' creeps with ' + totalHostileBody + ' hostile body, first unit owned by ' + targetCreep[0].owner.username);
			if(currentRoom.controller != null && targetCreep.owner.name != 'Invader')
				Game.notify(currentRoom + ' has ' + targetCreep.length + ' creeps with ' + totalHostileBody + ' hostile body, first unit owned by ' + targetCreep[0].owner.username, reportTime);
			if(currentRoom.memory.threat != null && currentRoom.memory.threat < 8)
			{
				if(currentRoom.memory.threat <= 4)
				{
					//TO DO: Previous threat didn't exist, it now does 20+
				}
				else if(currentRoom.memory.threat == 5 || currentRoom.memory.threat == 9)
				{
					//TO DO: Previous threat was between 1-4, now grew to 20+
				}
				else if(currentRoom.memory.threat == 6 || currentRoom.memory.threat == 10)
				{
					//TO DO: Previous threat was between 5-9, now grew to 20+
				}
				else if(currentRoom.memory.threat == 7 || currentRoom.memory.threat == 11)
				{
					//TO DO: Previous threat was between 10-19, now grew to 20+
				}
				return(12);
			}
			return(8);
		}
	}
	else
	{
		if(currentRoom.controller != null && currentRoom.controller.owner != null && currentRoom.controller.owner.username == 'RaskVann')
		{
			//console.log(currentRoom + ' Room controlled by me, no enemy creeps found');
			//Game.notify(currentRoom + ' Room controlled by me, no enemy creeps found', reportTime);
			return(-1);	//Room controlled by me, no enemy creeps found
		}
		else if(currentRoom.controller == null || (currentRoom.controller != null && currentRoom.controller.owner == null))
		{
			//console.log(currentRoom + ' No enemy creeps found, not controlled');
			//Game.notify(currentRoom + ' No enemy creeps found, not controlled', reportTime);
			return(0);	//No enemy creeps found, not controlled, threat 0
		}
		else if(currentRoom.controller.owner != null && currentRoom.controller.owner.username != 'RaskVann')
		{
			//console.log(currentRoom + ' No enemy creeps found, controlled by: ' + currentRoom.controller.owner.username);
			//Game.notify(currentRoom + ' No enemy creeps found, controlled by: ' + currentRoom.controller.owner.username, reportTime);
			return(1);	//No enemy creeps found, controlled by someone else, threat 1
		}
	}
 }

 function updateDistanceMoved(unit)
 {
	if(unit.memory.distanceMoved == null)
	{
		unit.memory.distanceMoved = 0;
	}
	if(unit.memory.pathLength != null)
	{
		unit.memory.distanceMoved += unit.memory.pathLength;
	}
 }

 function reportInjury(unit)
 {
	if(unit.hits < unit.hitsMax)
	{
		//Report was attacked (and they couldn't insta-kill with damage)
		var rangedTargets = unit.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
		var reportTime = 720;
		if(rangedTargets.length > 0)
		{
			var owners = '';
			for(var x in rangedTargets)
			{
				owners += rangedTargets[x].owner.username + ', ';
			}
			if(owners.indexOf('Invader') == -1)
				Game.notify('Enemy found after injuring: ' + unit.name + ' of owners: ' + owners + ' in room: ' + unit.room.name, reportTime);
		}
		else
		{
			//Game.notify('No enemy found after injuring: ' + unit.name + ' in room: ' + unit.room.name, reportTime);
		}
	}
 }

 function getSpawnId(unit)
 {
	//The scouts throw back requests to spawn other scouts to continue their search. This populates a saved ID
	//to the spawner in the room where this scout came from so this can continue. Also double checks the spawner
	//if it's ready for more requests before the scouts go out and do more work so we don't overload the spawner
	//with requests it can't deal with right now.
	var useSpawn;
	if(unit.memory.spawnId != null)
	{
		useSpawn = Game.getObjectById(unit.memory.spawnId);	//Spawn new units at this spawn
	}
	else	//Populate spawnId
	{
		//For some stupid reason Game.spawns[0] doesn't work, but passing it a aguement from a for(var x in y) does
		for(var x in Game.spawns)
		{
			if(unit.room.name == Game.spawns[x].room.name)
			{
				//console.log(unit.name + ' setting spawn id. ' + Game.spawns[x].id + ' has memory? ' + Game.spawns[x].memory);
				unit.memory.spawnId = Game.spawns[x].id;	//Spawn new units at the last spawn the scout has seen
				useSpawn = Game.spawns[x];
				break;
			}
		}
	}

	if(useSpawn == null)
	{
		console.log(unit.name + ' did not find a spawn to use in ' + unit.room.name + ' or id: ' + unit.memory.spawnId);
	}
	else if(useSpawn.memory == null)
	{
		console.log(unit.name + ' found spawn, null memory from id ' + unit.memory.spawnId + ' while in room: ' + unit.room.name + '.');
	}
	return(useSpawn);
 }

 function getPreviousRoom(unit)
 {
	if(unit.memory.roomName != null && unit.room.name != unit.memory.roomName &&
		unit.memory.roomName != 'changeRouteFromDeadEnd')
	{
		//If we enter in the function while roomName hasn't updated then memory.roomName is the previousRoom
		return(unit.memory.roomName);
	}
	else if(unit.memory.previousRoom != null && unit.room.name == unit.memory.roomName &&
			unit.memory.previousRoom != unit.room.name && unit.memory.previousRoom != 'changeRouteFromDeadEnd')
	{
		//Otherwise the previousValue is updated and we can use it.
		return(unit.memory.previousRoom);
	}
	else if(unit.memory.previousRoom != null && unit.memory.previousRoom != unit.room.name &&
		unit.memory.roomName == 'changeRouteFromDeadEnd' &&
		unit.memory.usingSourceId == 'changeRouteFromDeadEnd' &&
		unit.memory.previousRoom != 'changeRouteFromDeadEnd')
	{
		//Assumes previous room was updated properly, but we blew away the roomName for this so either change how this is defined
		//or this will work
		return(unit.memory.previousRoom);
	}
	//console.log(unit.name + ' found roomName and previousRoom not defined.');
	return(null);
 }

 function scoutsInEachRoom(unit)
 {
	var lastScout = unit;
	var count = 0;
	var limit = 50;

	while(lastScout != null && getPreviousRoom(lastScout) != null && count++ < limit)
	{
		lastScout = scoutFromRoomName(getPreviousRoom(lastScout));
	}

	if(lastScout != null)
	{
		if(lastScout.room.controller != null &&
			lastScout.room.controller.owner != null &&
			lastScout.room.controller.owner.username == 'RaskVann')
		{
			//console.log('Starting from ' + unit.name + ' there is a scout in each room ending at ' + lastScout.name + ' in my room');
			return(true);
		}
		else
		{
			//console.log('Starting from ' + unit.name + ' in ' + unit.room.name + ' looking at ' + getPreviousRoom(unit) + ' there is a scout in each room ending at ' + lastScout.name + ' in ' + lastScout.room.name + ' looking at ' + getPreviousRoom(lastScout));
			return(false);
		}
	}
	else
	{
		var lookAtRoom = Game.rooms[getPreviousRoom(unit)];
		if(lookAtRoom != null &&
			lookAtRoom.controller != null &&
			lookAtRoom.controller.owner != null &&
			lookAtRoom.controller.owner.username == 'RaskVann')
		{
			//console.log(unit.name + ' found home but no scout.');
			var allSpawns = lookAtRoom.find(FIND_MY_SPAWNS);
			for(var spawns in allSpawns)
			{
				var selectSpawn = allSpawns[spawns];
				if(selectSpawn.memory.master == null || selectSpawn.memory.master == true)
				{
					//console.log(selectSpawn + ' requesting new scout');
					selectSpawn.memory.requestScout = 1;
				}
			}
		}
		else
		{
			//console.log(unit.name + ' in ' + unit.room.name + ' trying to find scout in ' + getPreviousRoom(unit) + ' failed in ' + unit.memory.previousRoom + ' or in subsequent room.');
		}
	}

	if(count+1 >= limit)
	{
		console.log(unit.name + ' ran into infinite loop looking through previousRoom');
	}
	return(false);
 }

 //We store the last room the scout came from in unit.memory.previousRoom. We pass that value in
 //here to get the room we're trying to do something in and return back a unit from that room
 function scoutFromRoomName(roomName)
 {
	if(roomName != null)
	{
		for(var scouts in Game.creeps)
		{
			if(Game.creeps[scouts].memory.role == 'scout' &&
				Game.creeps[scouts].room.name == roomName)
			{
				return(Game.creeps[scouts]);
			}
		}
		//console.log('scoutFromRoomName: could not find scout in ' + roomName + ' needed for creation of route.');
	}
	return(null);
 }

 function removeRouteLocation(routeLocation)
 {
	if(Memory.scoutRoute != null && Memory.scoutRoute.length != null && routeLocation != null)
	{
		for(var x = routeLocation; x < Memory.scoutRoute.length; x++)
		{
			if(x+1 < Memory.scoutRoute.length)
			{
				//console.log('Route[' + x + ']: ' + Memory.scoutRoute[x] + ' replaced by route[' + x+1 + ']: ' + Memory.scoutRoute[x+1]);
				Memory.scoutRoute[x] = Memory.scoutRoute[x+1];
			}
			else
			{
				//console.log('End of list, deleting last entry[' + x + ']: ' + Memory.scoutRoute[x] + ' and updating length from ' + Memory.scoutRoute.length);
				delete Memory.scoutRoute[--Memory.scoutRoute.length];
			}
		}
		return(true);
	}
	return(false);
 }

 //returns location of route that matches the room we send in
 function getRouteFromRoom(findRoomName)
 {
	if(Memory.scoutRoute != null && Memory.scoutRoute.length != null)
	{
		for(var x = 0; x < Memory.scoutRoute.length; x++)
		{
			var route = Memory.scoutRoute[x][0];
			//console.log('Trying to find roomName: ' + findRoomName + ' in pos[' + x + ']: ' + route.routeStart);
			if(route.routeStart != null && route.routeStart.roomName == findRoomName)
			{
				return(x);	//Retrieve with Memory.scoutRoute[x]
			}
			else if(route.routeStart == null || route == "test")
			{
				//console.log('Searching through stored route found bad information[' + x + ']: ' + Memory.scoutRoute[x]);
				removeRouteLocation(x);
			}
		}
	}
	return(null);
 }

 function getRoutePos(pos)
 {
	if(Memory.scoutRoute != null && Memory.scoutRoute.length != null &&
		pos != null && pos < Memory.scoutRoute.length)
	{
		return(Memory.scoutRoute[pos]);
	}
	return(null);
 }

 //Checks Memory.scoutRoute to see if it has information to use or not. Used to spawn scouting routes after the
 //scouts have found and stored routes.
 function isScoutRouteEmpty()
 {
	if(Memory.scoutRoute == null || (Memory.scoutRoute.length != null && Memory.scoutRoute.length <= 0))
	{
		return(true);
	}
	else
	{
		return(false);
	}
 }

 //Assumes: route = [ { routeStart: startPosition, routeEnd: exit, usingSourceId: id } ];
 function addRoute(route)
 {
	if(Memory.scoutRoute == null)
	{
		Memory.scoutRoute = ['test'];
		Memory.scoutRoute[0] = route;
		Memory.scoutRoute.length = 1;
	}
	else
	{
		if(Memory.scoutRoute != null && Memory.scoutRoute.length == null)
		{
			//Memory.scoutRoute.length = 1;
		}
		Memory.scoutRoute[Memory.scoutRoute.length++] = route;
	}
 }

 function storeRoute(unit, id, capRoute, useId)
 {
	var exit;
	if(unit == null || unit.memory.startPos == null)
	{
		return(false);
	}
	var startPosition = new RoomPosition(unit.memory.startPos.x, unit.memory.startPos.y, unit.memory.startPos.roomName);

	var routeToExit;
	if(useId == true)
	{
		routeToExit = Game.map.findExit(unit.room.name, id);
		exit = startPosition.findClosestByRange(routeToExit);
	}
	else
	{
		var source = Game.getObjectById(id);
		if(source != null && source.room.name == unit.room.name)
		{
			exit = source.pos;
		}
		else if(source != null && unit.room.memory.exitsVisited != null)
		{
			routeToExit = Game.map.findExit(unit.room.name, getRoomForExit(unit, unit.room.memory.exitsVisited));
			exit = startPosition.findClosestByRange(routeToExit);
		}
		else
		{
			console.log(unit.name + ' scout ran out of exits to assign for route (storeRoute())');
			exit = null;
		}
	}

	//If starting position and exit position match the last entered value
	if(Memory.scoutRoute != null && Memory.scoutRoute.length != null &&
		Memory.scoutRoute[Memory.scoutRoute.length-1] != null &&
		(//Memory.scoutRoute[Memory.scoutRoute.length-1][0].routeStart.x == startPosition.x &&
		//Memory.scoutRoute[Memory.scoutRoute.length-1][0].routeStart.y == startPosition.y &&
		//Memory.scoutRoute[Memory.scoutRoute.length-1][0].routeStart.roomName == startPosition.roomName &&
		Memory.scoutRoute[Memory.scoutRoute.length-1][0].routeEnd.x == exit.x &&
		Memory.scoutRoute[Memory.scoutRoute.length-1][0].routeEnd.y == exit.y &&
		Memory.scoutRoute[Memory.scoutRoute.length-1][0].routeEnd.roomName == exit.roomName))
	{
		//Already entered this into storage, reject another entry.
		return(false);
	}

	if(startPosition != null && exit != null && startPosition.x == exit.x && startPosition.y == exit.y)
	{
		console.log(unit.name + ' in ' + unit.room.name + ' trying to set route that starts and ends in same place.');
		return(false);
	}
	else if(startPosition == null || exit == null || id == null)
	{
		console.log(unit.name + ' in ' + unit.room.name + ' trying to save null in route.');
		return(false);
	}

	var route = [ { routeStart: startPosition, routeEnd: exit, usingSourceId: id, cap: capRoute } ];

	addRoute(route);
	return(true);
 }

 //Checks the direction of unit to see if it's moving towards the scout. If the scout is in the way
 //it is sent a move command to move towards the unit so they can move through one another and return true
 //otherwise nothing happens and returns false.
 function creepDirectionTowards(unit, scout)
 {
	var direction = unit.memory.direction;
    if(unit != null && direction != null && scout != null)
    {
        var posX = unit.pos.x;
        var posY = unit.pos.y;
		var directionTowards;
        if(direction == TOP)
        {
            posY--;
			directionTowards = BOTTOM;
        }
        else if(direction == TOP_RIGHT)
        {
            posX++;
            posY--;
			directionTowards = BOTTOM_LEFT;
        }
        else if(direction == RIGHT)
        {
            posX++;
			directionTowards = LEFT;
        }
        else if(direction == BOTTOM_RIGHT)
        {
            posX++;
            posY++;
			directionTowards = TOP_LEFT;
        }
        else if(direction == BOTTOM)
        {
            posY++;
			directionTowards = TOP;
        }
        else if(direction == BOTTOM_LEFT)
        {
            posX--;
            posY++;
			directionTowards = TOP_RIGHT;
        }
        else if(direction == LEFT)
        {
            posX--;
			directionTowards = RIGHT;
        }
        else if(direction == TOP_LEFT)
        {
            posX--;
            posY--;
			directionTowards = BOTTOM_RIGHT;
        }
        else
        {
            return(null);
        }

		if(scout.pos.x == posX && scout.pos.y == posY)
		{
			scout.move(directionTowards);
			var moveBack;
			if(directionTowards > 4)
			{
				moveBack = directionTowards - 4;
			}
			else
			{
				moveBack = directionTowards + 4;
			}
			scout.memory.moveBack = moveBack;
			return(true);
		}
    }
	return(false);
 }

 //Returns true if we can find the sourceId already existing in the creeps we've stored in memory.
 //Used since we only want scouts to create new creeps once and not to duplicate creeps forever
 //when the creation of routes/flags lags up.
 function foundIdInCreeps(sourceId)
 {
	for(var creeps in Memory.creeps)
	{
		if(Memory.creeps[creeps] != null && sourceId != null &&
			Memory.creeps[creeps].usingSourceId == sourceId)
			return(true);
	}
	return(false);
 }

 //Used to spawn another role 'attackPower' or 'healPower' but can be modified slightly to spawn any temporary unit.
 function spawnTempUnit(role, useSpawn, memoryForTempUnit)
 {
	if(useSpawn.createTempCreep(role, memoryForTempUnit, useSpawn.room.name) == true)
	{
		//Success, otherwise we have to spawn it when we have enough power
		return(true);
	}
	else
	{
		var name = findNextUnusedName(role, useSpawn.room.name);
		Memory.creeps[name] = memoryForTempUnit;

		//TO DO: Find 'name' in memory and spawn when able, remove name from requestCreep
		//when successful. Use equivalent to createTempCreep but with name.
		if(useSpawn.memory.requestCreep == null)
		{
			useSpawn.memory.requestCreep = name+',';
		}
		else
		{
			useSpawn.memory.requestCreep += name+',';
		}
		console.log(useSpawn.name + ' placed ' + name + ' in creep memory, after finding bank, needs spawned.');
		return(true);
	}
	return(false);
 }

 function storeBank(unit, currentRoom, useSpawn)
 {
	if(currentRoom.controller == null)
	{
		var bank = currentRoom.find(STRUCTURE_POWER_BANK);
		//If less then 1500 we're deeming this impossible to gather
		if(bank.length > 0 && (bank[0].ticksToDecay > 2000 || bank[0].hits < bank[0].hitsMax))
		{
			console.log('Found Power Bank ' + bank[0] + ' in ' + bank[0].room + ' power: ' + bank[0].power + ' (' + bank[0].hits + '/' + bank[0].hitsMax + ')');
			if(currentRoom.memory.bank == null || (currentRoom.memory.bank != null && currentRoom.memory.bank.id != bank[0].id))
			{
				if(currentRoom.memory.bank != null)
					console.log('found bank ' + bank[0].id + ' match memory: ' + currentRoom.memory.bank.id + '<- shouldnt be null');

				//Can get how long until death by deathTime-Game.time. If negative, already dead
				var timeTillDeath = bank[0].ticksToDecay + Game.time;
				var healthRatio = bank[0].hits / bank[0].hitsMax;

				//When these entries are found, spawn 2 power, 2 heal and send them to the roomName, when they have identical room names, go to id
				currentRoom.memory.bank = { id: bank[0].id, power: bank[0].power, deathTime: timeTillDeath, roomName: bank[0].room.name, health: healthRatio };
				//currentRoom.memory.bank = [ id: bank[0].id, power: bank[0].power, deathTime: timeTillDeath, roomName: bank[0].room.name, health: healthRatio ];
				//currentRoom.memory.bank = [ { id: bank[0].id, power: bank[0].power, deathTime: timeTillDeath, roomName: bank[0].room.name, health: healthRatio } ];

				//If the controller advanced to level 8. See if we can spawn
				if(useSpawn.room.controller != null &&
					useSpawn.room.controller.owner != null &&
					useSpawn.room.controller.owner.username == 'RaskVann' &&
					useSpawn.room.controller.level >= 8)
				{
					//var role = 'attackPower';
					var role = 'rangedPower';
					//var memoryForTempUnit = {'role': role, 'usingSourceId': currentRoom.name, 'spawnId': useSpawn.id, 'bankId': bank[0].id};
					var memoryForTempUnit = {'role': role, 'usingSourceId': unit.memory.usingSourceId, 'spawnId': useSpawn.id, 'bankId': bank[0].id};
					//We need 3 attackPower units for each bank (at 2M hit points)
					//Need 8 ranged to clear each bank
					/**
					spawnTempUnit(role, useSpawn, memoryForTempUnit);
					spawnTempUnit(role, useSpawn, memoryForTempUnit);
					spawnTempUnit(role, useSpawn, memoryForTempUnit);
					spawnTempUnit(role, useSpawn, memoryForTempUnit);
					spawnTempUnit(role, useSpawn, memoryForTempUnit);
					spawnTempUnit(role, useSpawn, memoryForTempUnit);
					spawnTempUnit(role, useSpawn, memoryForTempUnit);
					spawnTempUnit(role, useSpawn, memoryForTempUnit);
					**/
					console.log('found bank but ive disabled ' + role + ' units. Would have had mem: ' + memoryForTempUnit);
				}
			}
			else
			{
				console.log('found bank but had matching id ' + currentRoom.memory.bank.id + ' skipping logic for spawn powerSpawn');
			}
		}
		else if(currentRoom.memory.bank != null)	//bank exists and no bank found
		{
			delete currentRoom.memory.bank;
		}
	}
 }

 function scout(unit, previousScoutState)
 {
	var initialize = Game.cpu.getUsed();
	if(removeUnitNearDeath(unit) == 'death')
	{	//Unit ran out of time, could still have more room to explore so we're not calling exploreEnd
		//This should be fixed to call removeScout(unit) when the scouts are properly working
		//console.log(unit.name + ' attempted to remove memory ' + Memory.creeps[unit.name] + ' before death.');
		return('travel');
	}
	else
	{
		reportInjury(unit);
	}

	if(previousScoutState == 'ready' || previousScoutState == 'travel')
	{
		//Everything going well, continue on with regular scout logic
	}
	else if(previousScoutState == 'exploreEnd')
	{
		//unit.room.memory.exitsVisited++;	//Code tied to visiting room increases exitsVistited for me

		//Change the name of the room stored here, this is a cheap way to trigger
		//the 'im in a new room' code below to generate a new route if needed and follow it.
		unit.memory.roomName = 'changeRouteFromDeadEnd';
		unit.memory.usingSourceId = 'changeRouteFromDeadEnd';
		//TO DO: If position is messed up or want to make sure startPos is maintained since it's
		//still valid, copy the same code here as the roomChange and remove the uncessary bits
	}
	else if(previousScoutState != null)
	{
		console.log('DEPRECATED, STOP THE SOURCE');
		console.log(unit.name + ' creating path: ' + previousScoutState + ' in ' + unit.room + ' usedCpu: ' + Game.cpu.getUsed() + ' limit: ' + Game.cpuLimit);
		//If got this far then we've sent a new id to be implemented in a route, create it and
		//send to the next scout waiting further behind
		return(createPathToExit(unit, unit.room, previousScoutState));
	}

	//Here just in case, will overwrite logic so be careful with this flag.
	if(Game.flags.Scout != null)
	{
		unit.moveTo(Game.flags.Scout);
	}

	var scoutInit = Game.cpu.getUsed() - initialize;

	var currentRoom = unit.room;
	var useSpawn = getSpawnId(unit);
	var scoutsInAllPreviousRooms = scoutsInEachRoom(unit);
	var roomNameMem = unit.memory.roomName;
	var usingSourceId = unit.memory.usingSourceId;
	var reportTime = 720;

	var searchRoom = Game.cpu.getUsed() - initialize - scoutInit;
	//When entering a new room and if the room is the room we intended and there are scouts
	//in all previous rooms for us to send information to.
	//TO DO: Potentially reach a state in that roomName is changed but the path isn't created. May want to check
	//		if the flag isn't found and create a path independent of entering a new room.
	if(((roomNameMem != unit.room.name) || (roomNameMem == null || roomNameMem == 'changeRouteFromDeadEnd')) &&
		(unit.room.name == usingSourceId || (usingSourceId == null || usingSourceId == 'changeRouteFromDeadEnd')) &&
		scoutsInAllPreviousRooms)// &&
	{
		//Visited all exits from this room, we need to find another room, hopefully down this path
		//and go to that room to continue exploring
		if(roomNameMem != null)
		{
			//Look for scouts here when regressively creating paths
			//By design is empty when in first room (mine) as it's checked for to trigger effects later
			unit.memory.previousRoom = roomNameMem;
		}
		roomNameMem = unit.room.name;
		unit.memory.startPos = unit.pos;
		unit.memory.roomName = roomNameMem;

		var scoutNewRoomInit = Game.cpu.getUsed() - initialize - scoutInit - searchRoom;
		var updateRoom = Game.cpu.getUsed() - initialize - scoutInit - searchRoom - scoutNewRoomInit;

		var newExit = nextRoomManager(unit, currentRoom, useSpawn);
		if(newExit == 'exploreEnd')
			return(newExit);	//Dead - End found. Stop here

		if(newExit.name != null)
			console.log(unit.name + ', ' + currentRoom.name + ', ' + useSpawn.name + ' returned non-room-name: ' + newExit + ' want: ' + newExit.name);

		if(currentRoom.memory.exitsVisited < currentRoom.memory.exitMax)
		{
			if(unit.memory.roomsMoved == null)
			{
				unit.memory.roomsMoved = 0;
			}
			else
			{
				unit.memory.roomsMoved++;
			}

			//Where newExit was

			console.log('NewExit2? ' + newExit + ' name: ' + newExit.name);
			//All following scouts should find a flag underneath to follow, TO DO: error if not
			var foundFlag = followFlagForward.findFlag(unit, newExit)
			if(newExit == null)
			{
				console.log('Cant find exit: ' + newExit + ', or flag: ' + foundFlag + ', or spawn: ' + useSpawn + ', for scout: ' + unit.name + ', in room: ' + currentRoom.name);
				//TO DO: Suicide point for scout?
				//var report = removeScout(unit);
				//return(report);
			}
			else if(foundFlag != null)
			{
				//console.log(unit.name + ' found flag with path: ' + newExit + ' move to this flag and follow it.');
				//Found a existing flag for this path, follow it instead of creating a new one.
				usingSourceId = newExit;
				unit.memory.usingSourceId = newExit;
				//This flag may have more up to date information then what we have saved, save it before updating in the next function
				unit.memory.pathLength = foundFlag.memory.pathLength;
				updateDistanceMoved(unit);
				delete unit.memory.direction;	//Shouldn't be needed, but flags are spawning in wrong place, temp fix
			}
			//All lead scouts should not find a flag and so should create a new path to next room
			else if(useSpawn != null)
			{
				//console.log(unit.name + ' creating another scout, creating path to ' + newExit);
				//Get another scout on the field. We'll be moving to the next room and we'll need another
				//scout to take up the former location so we can pass new paths to it.

				//First this unit creates a path to sources[x] in currentRoom, then we go to the previousRoom and get a unit
				//there that creates a path going to the current exit/path in the previous room. We keep going to previous rooms
				//and create paths to this new place for as long as there is a new previousRoom
				//var nextSourceId = createPathToExit(unit, currentRoom, newExit);
				if(storeRoute(unit, newExit, false, true) == true)
				{
					useSpawn.memory.requestScout = 1;
				}

				updateDistanceMoved(unit);
				usingSourceId = newExit;
				unit.memory.usingSourceId = newExit;
				delete unit.memory.direction;	//Attach self to new route

				if(unit.memory.previousRoom != null)
				{
					for(var nextScout = scoutFromRoomName(unit.memory.previousRoom); nextScout != null; nextScout = scoutFromRoomName(nextScout.memory.previousRoom))
					{
						console.log(unit.name + ' creating path in room ' + currentRoom.name + '. ' + nextScout + ' now creating ' + newExit + ' in ' + nextScout.room);
						//TO DO: Should be able to append information or place new flags onto all places in this room where
						//		nextScout.memory.usingSourceId is found on flags since a route was previously laid out.
						//nextSourceId = createPathToExit(nextScout, nextScout.room, newExit);
						storeRoute(nextScout, newExit, false, true);
					}
					console.log(unit.name + ' creating path in room ' + currentRoom.name);
				}
				else if(currentRoom.controller != null &&
						currentRoom.controller.owner != null &&
						currentRoom.controller.owner.username == 'RaskVann')
				{
					//This is a potential home so it's fine if there is no previousRoom, another way is to check spawnId.room.name == currentRoom.name but
					//that's a lot of cpu for this checker code.
				}
				else
				{
					console.log(unit.name + ' was going to create a new path but no found previousRoom. If ' + currentRoom.name + ' is home? then fine');
				}

				//TO DO: New code for 'we are creating paths'?
				return('travel');
			}
		}
	}
	//If the scout is in a new room and it's the room we intend to be in and it's
	//found that there isn't scouts in all the rooms we need, the spawn isn't spawning
	//anything (not needed, but this ensures it will react within 1 tick), and there
	//isn't a scout in the spawn room, spawn a scout
	else if(roomNameMem != currentRoom.name &&
			(currentRoom.name == usingSourceId || usingSourceId == null) &&
			scoutsInAllPreviousRooms == false && useSpawn != null && useSpawn.spawning == null &&
			scoutFromRoomName(useSpawn.room.name) == null)
	{
		//useSpawn.memory.requestScout = 1;
	}

	var newRoom = Game.cpu.getUsed() - initialize - scoutInit - searchRoom;
	if(scoutInit + searchRoom + newRoom > 15)
	{
		//console.log(unit.name + ' scoutInit: ' + scoutInit + 'searchRooms: ' + searchRoom + ' newRoom: ' + newRoom);
		//Game.notify(unit.name + ' scoutInit: ' + scoutInit + 'searchRooms: ' + searchRoom + ' newRoom: ' + newRoom, reportTime);
	}

	//This unit shouldn't be created until the spawner has the chance to set everything it needs in the core room. This is for every other room the scout visits.
	//Create harvesters and gatherers needed for this room if it hasn't done so already. This only happens once on first entering the room for the first time.
	//if(currentRoom.controller != null && isScoutsReady(useSpawn) && Game.cpuLimit >= 500)
	if(currentRoom.controller != null && scoutsInAllPreviousRooms && Game.cpuLimit >= 500)
	{
		//With how intensive this may be, we delay this procedure until we are at a state
		//where we have a ton of resources so this can complete
		//This first if statement checks if we've found a unclaimed room with energy sources in it and
		//the spawn is in a state it can accept more harvesters/gatherers, it queues up the units and
		//creates the paths in this room for the harvesters/gatherers to use
		if(currentRoom.controller.owner == null)
		{
			//WARNING: If secondary paths in previous rooms aren't being established then it's probably
			//		because we're running out of CPU. may want to move this check elsewhere specifically
			//		for 'later' scouts that are picking up and creating additional paths.
			var sources = currentRoom.find(FIND_SOURCES);
			var pathLength = 1;
			//Only the first scout should be performing the creation of harvesters, gatherers and initial paths
			//TO DO: Only do if passed in status of all scouts is 'ready'
			for(var x = 0; unit.memory.scoutLead == true && x < sources.length && Game.cpu.getUsed() < 10; x++)
			{
				//console.log('Scout-Room: ' + currentRoom.name + ' with sources: ' + sources.length + ' cpu: ' + Game.cpu.getUsed());
				if(harvestIdInList(useSpawn, sources[x].id) ||
					followFlagForward.findFlag(unit, sources[x].id) != null ||
					foundIdInCreeps(sources[x].id) == true)
				{
					//Found a flag that goes to this source already, ignore creation for this source.
					continue;
				}
				var startPosition = new RoomPosition(unit.memory.startPos.x, unit.memory.startPos.y, unit.memory.startPos.roomName);
				var pathToSource = startPosition.findPathTo(sources[x], {maxOps: 2000, ignoreCreeps: true});
				pathLength = pathToSource.length + unit.memory.distanceMoved;

				console.log(unit.name + ' has recorded distance: ' + unit.memory.distanceMoved + ' and distance to next source: ' + pathToSource.length);
				//Around length 160-180 we hit twice as much profit as the cost to extract that node, cut off sending harvesters at this point.
				//I'm assuming I'm more then half efficient with harvesting and so this will net a profit. Inefficiency in gatherers going where
				//a harvester isn't or vice versa will create some amount of waste but don't know how much.
				if(pathLength < 160)
				{
					//console.log(unit.name + ' trying to create path to source ' + sources[x].id + ' and add units to spawners list');

					//followFlagForward.createDefinedPath(currentRoom, pathToSource, sources[x].id, true, startPosition);
					storeRoute(unit, sources[x].id, true, false);
					//followFlagForward.updatePathLength(sources[x].id, pathLength);

					addHarvestId(useSpawn, sources[x].id);
					addNeedHarvest(useSpawn, 2);	//Only need 1, but add another in memory so we can have one spawn when the other is dieing
					//Alternative Gatherer per Harvester= ABSOLUTE(ROUND_UP((HarvestRate*(DistanceToNode*2))/CapacityPerGatherer))
					//A quirk of gatherer capacity with CARRY,MOVE pattern is energy cost/2 is equivalent to their carry capacity(10*2*2)
					//We then have to fit all of this within the largest unit we can possibly use which happens to be a 50 unit gatherer that
					//costs 2550, use energyCapacity if that happens to be lower however.
					var maxCapacity = Math.min(2550, useSpawn.room.energyCapacityAvailable);
					var gatherAmount = Math.abs(Math.ceil(40.0*pathLength/maxCapacity));
					addNeedGather(useSpawn, gatherAmount+1);	//Only need gatherAmount but add another in memory so we can have one spawn when the other is dieing

					//console.log(unit.name + ' success, added harvester for: ' + sources[x].id + ' and gatherer(s): ' + gatherAmount + ' to pending list for creation in spawn ' + useSpawn);

					//First this unit creates a path to sources[x] in currentRoom, then we go to the previousRoom and get a unit
					//there that creates a path going to the current exit/path in the previous room. We keep going to previous rooms
					//and create paths to this new place for as long as there is a new previousRoom
					if(unit.memory.previousRoom != null)
					{
						//var nextSourceId = 1;
						//WARNING: There is a danger this is cyclical if a previousRoom points to a room we've already created a path in
						//TO DO: Validate first by going through the path, ensuring the last one points at controller.owner.username = 'RaskVann'
						//and isn't endless (end after a few dozen checks)
						for(var nextScout = scoutFromRoomName(unit.memory.previousRoom); nextScout != null; nextScout = scoutFromRoomName(nextScout.memory.previousRoom))
						{
							//TO DO: Should be able to append information or place new flags onto all places in this room where
							//		nextScout.memory.usingSourceId is found on flags since a route was previously laid out.
							console.log(unit.name + ' creating path in room ' + currentRoom.name + '. ' + nextScout + ' now creating ' + newExit + ' in ' + nextScout.room);
							//nextSourceId = createPathToExit(nextScout, nextScout.room, sources[x].id);
							storeRoute(nextScout, sources[x].id, false, false);
						}
						console.log(unit.name + ' creating path in room ' + currentRoom.name);
					}
					else
					{
						//console.log(unit.name + ' was going to create a new path but no found previousRoom. If ' + currentRoom.name + ' is home? then fine');
					}

					return('travel');	//Creating path, may want another code
				}
				else
				{
					console.log(unit.name + ' trying to path to ' + sources[x] + ' but path is to long: ' + pathLength + ' from scout length: ' + unit.memory.distanceMoved);
				}
			}
		}
		else if(currentRoom.controller.owner != null && currentRoom.controller.owner.username == 'RaskVann')
		{
			//Happens when enter a room I control. Moved code above to where unit.memory.spawnId == null it then
			//looks for a spawn that unit shares the same room with and assigns that ID.

			//If scout has returned to the spawn room again, reset the distance counter to outer rooms
			if(unit.memory.distanceMoved == null)
			{
				unit.memory.distanceMoved = 0;
			}
			else
			{
				//console.log(unit.name + ' is in ' + currentRoom.name + ' (I control).');
			}
		}
		else if(currentRoom.controller.owner != null)
		{
			//console.log('Scout-Room: ' + currentRoom.name + ' with owner: ' + currentRoom.controller.owner.username + ', ignoring it for harvesting.');
			Game.notify('Scout-Room: ' + currentRoom.name + ' with owner: ' + currentRoom.controller.owner.username + ', send message to user about expansion.', reportTime);

			//TO DO: Create another unit type after all exploration is done, he moves to all the stored user occupied rooms and sits there
			//		for a certain amount of time looking for attackers and auto spawning attackers (potentially add a attack/ranged/heal
			//		body to trigger it on purpose. Send back findings and set a threat level accordingly,
			currentRoom.memory.owner = currentRoom.controller.owner.username;
			currentRoom.memory.threat = evaluateThreat(currentRoom);
			return(requestScout(unit, useSpawn));
		}
		else
		{
			//currentRoom.memory.threat = evaluateThreat(currentRoom);
			console.log('Scout abandoned creating paths, most likely cpu is to high or is traveling');
		}
	}
	//Here to catch when a scout finds a populated room, don't bother waiting for units to catch up in previous
	//rooms, just mark this as a dead end, get what information we can and kill the unit.
	else if(currentRoom.controller != null && currentRoom.controller.owner != null &&
			currentRoom.controller.owner.username != 'RaskVann')
	{
		currentRoom.memory.owner = currentRoom.controller.owner.username;
		currentRoom.memory.threat = evaluateThreat(currentRoom);
		populateExitMax(currentRoom);
		currentRoom.memory.exitsVisited = currentRoom.memory.exitMax;
		return(requestScout(unit, useSpawn));
	}
	else if(currentRoom.controller == null)
	{
		storeBank(unit, currentRoom, useSpawn);

		//Is evaluated once when a 'no controller' room is entered and defines the threat value and again in the next tick
		//to find if there is a source defined and populates that if needed (more CPU effective this way)
		if(currentRoom.memory.sources == null)
		{
			if(currentRoom.memory.threat == null)
			{
				var threat = evaluateThreat(currentRoom);

				//console.log('Scout-Room: ' + currentRoom.name + ' threat: ' + threatString(threat));
				Game.notify('Scout-Room: ' + currentRoom.name + ' threat: ' + threatString(threat), reportTime);
				currentRoom.memory.threat = threat;
			}
			else
			{
				var sources = currentRoom.find(FIND_SOURCES);
				if(sources != null)
				{
					//console.log('Scout-Room: ' + currentRoom.name + ' AI Room with sources: ' + sources.length);
					Game.notify('Scout-Room: ' + currentRoom.name + ' AI Room with sources: ' + sources.length, reportTime);
					currentRoom.memory.sources = sources.length;

					//var threat = evaluateThreat(currentRoom);
					//currentRoom.memory.threat = threat;
					//if(threat > 4)	//Enemy units with attacking body found, we could try to outrun them but we'll skip to the next scout instead
					//{
						//var report = removeScout(unit);
						//return(report);	//This is a defended room, explore another route for now
					//}
				}
				else
				{
					console.log(unit.name + ' no sources found in ' + currentRoom.name);
					currentRoom.memory.sources = 0;
				}
			}
		}
		else
		{
			//console.log(unit.name + ' already recorded sources in room ' + currentRoom.name + ' skipping logic to assign this.');
			//TO DO: Save this room, when have plenty of resources continually send attackers to this room until can explore past it.
		}
	}

	var newSource = Game.cpu.getUsed() - initialize - scoutInit - searchRoom - newRoom;
	if(scoutInit + searchRoom + newRoom + newSource > 15)
	{
		//console.log(unit.name + ' scoutInit: ' + scoutInit + ' searchRoom: ' + searchRoom +  ' newRoom: ' + newRoom + ' newSource: ' + newSource);
		//Game.notify(unit.name + ' scoutInit: ' + scoutInit + ' searchRoom: ' + searchRoom +  ' newRoom: ' + newRoom + ' newSource: ' + newSource, reportTime);
	}

	//If at edge of map, move until off of edge,
	//OR
	//If this is the lead scout and it's had a chance to run the 'ive entered a new room' code
	//(leader doesn't fit in the logic we have for 'trail behind the previous unit by 1 room' logic)
	//OR
	//If the spawner isn't trying to spawn anything and we've had a chance to handle 'i am in a new room'
	//logic. We should be free to travel if there is an appropriate number of scouts alive compared to
	//the number of rooms this unit has moved. (Need 1 unit in each room, following leader 0).
	if(canScoutMove(unit, useSpawn, scoutsSeen))
	{
		followFlagForward(unit, true);

		var move = Game.cpu.getUsed() - initialize - scoutInit - searchRoom - newRoom - newSource;
		if(scoutInit + searchRoom + newRoom + newSource + move > 15)
		{
			//console.log(unit.name + ' scoutInit: ' + scoutInit + ' searchRoom: ' + searchRoom +  ' newRoom: ' + newRoom + ' newSource: ' + newSource + ' FlagMove: ' + move);
			//Game.notify(unit.name + ' scoutInit: ' + scoutInit + ' searchRoom: ' + searchRoom +  ' newRoom: ' + newRoom + ' newSource: ' + newSource + ' FlagMove: ' + move, reportTime);
		}
		return('travel');
	}
	else	//Wait for permission to move
	{
		var rangePosition;
		if(unit.memory.startPos != null)
		{
			//If startPos hasn't been updated yet, use the current pos just so other units can pass through.
			if(unit.memory.startPos.roomName != currentRoom.name)
			{
				//Note: This will invalidate the given startPos, when it appears
				rangePosition = new RoomPosition(unit.pos.x, unit.pos.y, currentRoom.roomName);
			}
			else
			{
				rangePosition = new RoomPosition(unit.memory.startPos.x, unit.memory.startPos.y, unit.memory.startPos.roomName);
			}
		}
		//As long as the startPos exists check if scout is in the way of other unit movements. Since this is stalling pathing for other units
		if(rangePosition != null)
		{
			var searchWithinRange = 1;
			//If the unit is sitting on the startPos, look for another unit that is trying to move
			//and scout is in the way of that move, if so move towards that unit to let it past
			if(unit.pos.getRangeTo(rangePosition) <= searchWithinRange)
			{
				unit.memory.moveBack = -1;	//Within range of start pos, no need to return anymore
				var friendlies = unit.pos.findInRange(FIND_MY_CREEPS, 1);
				for(var adjacent in friendlies)
				{
					//Go through all the creeps surrounding the scout and see if they are trying to move
					//through the scout, if so the scout will move in the opposite direction to allow them
					//passage.
					if(creepDirectionTowards(friendlies[adjacent], unit) == true)
					{
						//console.log(unit.name + ' moving towards: ' + friendlies[adjacent].name);
						break;
					}
				}
			}
			//Otherwise scout is away from startPos, move towards startPos
			else if(unit.memory.moveBack != null && unit.memory.moveBack != -1)// &&
					//unit.pos.getRangeTo(rangePosition) > searchWithinRange)
			{
				//TO DO: If opposite direction stored, move that direction and delete.
				//We've moved away from the startPos. Return to this location
				//console.log(unit.name + ' moving from: ' + unit.pos + ' to ' + rangePosition + ' with direction ' + unit.memory.moveBack);

				unit.move(unit.memory.moveBack);
				//unit.moveByPath(unit.pos.findPathTo(rangePosition), {maxOps: 100, ignoreCreeps: true});
				//unit.moveTo(rangePosition);
			}
		}
		var move = Game.cpu.getUsed() - initialize - scoutInit - searchRoom - newRoom - newSource;
		if(scoutInit + searchRoom + newRoom + newSource + move > 15)
		{
			//console.log(unit.name + ' scoutInit: ' + scoutInit + ' searchRoom: ' + searchRoom +  ' newRoom: ' + newRoom + ' newSource: ' + newSource + ' moveBack: ' + move);
			//Game.notify(unit.name + ' scoutInit: ' + scoutInit + ' searchRoom: ' + searchRoom +  ' newRoom: ' + newRoom + ' newSource: ' + newSource + ' moveBack: ' + move, reportTime);
		}
		return('ready');
	}
	return('ready');
 }

 function scoutInPreviousRoom(unit)
 {
	if(unit.memory.previousRoom == null)
	{
		return(true);
	}
	else
	{
		var previousRoom = Game.rooms[unit.memory.previousRoom];
		if(previousRoom == null)
		{
			console.log(unit.name + ' could not retrieve room: ' + unit.memory.previousRoom);
			return(false);
		}

		var findScout = previousRoom.find(FIND_MY_CREEPS, {
			filter: function(object) {
				return(object.memory.role == 'scout');
			}
		});

		return(findScout.length > 0);
	}
 }

 //If at edge of map, move until off of edge,
 //OR
 //If this is the lead scout and it's had a chance to run the 'ive entered a new room' code
 //(leader doesn't fit in the logic we have for 'trail behind the previous unit by 1 room' logic)
 //OR
 //If the spawner isn't trying to spawn anything and we've had a chance to handle 'i am in a new room'
 //logic. We should be free to travel if there is an appropriate number of scouts alive compared to
 //the number of rooms this unit has moved. (Need 1 unit in each room, following leader 0).
 ////This isn't used anywhere but followFlagForward but it was so unweildly I seperated into its own function
 function canScoutMove(unit, useSpawn, scoutsSeen)
 {
	var unitRoomName = unit.memory.roomName;
	var edgeOfMap = (1 > unit.pos.x || unit.pos.x > 48 || 1 > unit.pos.y || unit.pos.y > 48);
	var harvestEmptyAndRoomUpdated = (harvestEmpty(useSpawn) &&
									unitRoomName != null && unitRoomName == unit.room.name);
	var nextRoomMove;
	var scoutsAlive = useSpawn.memory.scoutsAlive;
	var roomsMoved = unit.memory.roomsMoved;
	if(unit.memory.scoutLead == true)	//If the leader
	{
		nextRoomMove = scoutsAlive != null && roomsMoved != null && (scoutsAlive-roomsMoved > 0);
	}
	else
	{
		nextRoomMove = scoutsAlive != null && roomsMoved != null && (scoutsAlive-roomsMoved > scoutsSeen+1);//Linear room distance to spawn?
	}
	//TO DO: Fix, should have 1 unit behind(unless at spawn) but don't want to move to next room if the unit ahead hasn't made it out yet (unless its lead)
	//Possibly move if more then 1 unit in the room, failing that move if have unit in previous room (unless in spawn, just move)
	//nextRoomMove = scoutInPreviousRoom(unit);	//Move if can find a scout in the room this unit just came from (or just spawned)

	return(edgeOfMap || (harvestEmptyAndRoomUpdated && nextRoomMove));
 }

 //Finds the closest enemy (if one exists) and returns him, calls reinforcements if found
 function detectEnemyCreep(unit)
 {
	var targetCreep;
	var reportRoom;
	if(unit != null)
	{
		//Kill any unit with the capacity to heal, otherwise kill any unit that can attack and has the ability to move
		targetCreep = unit.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
			filter: function(object) {
				return(object.getActiveBodyparts(HEAL) > 0 ||
						((object.getActiveBodyparts(ATTACK) > 0 || object.getActiveBodyparts(RANGED_ATTACK) > 0 || object.getActiveBodyparts(WORK) > 0 || object.getActiveBodyparts(CLAIM) > 0) &&
						object.getActiveBodyparts(MOVE) > 0));
			}
		});
		reportRoom = unit.room;
	}
	else
	{
		//Look through all spawns for a enemy creep, report the last one found.
		for(var x in Game.spawns)
		{
			//Kill any unit with the capacity to heal, otherwise kill any unit that can attack and has the ability to move
			var findEnemy = Game.spawns[x].room.find(FIND_HOSTILE_CREEPS, {
				filter: function(object) {
					return(object.getActiveBodyparts(HEAL) > 0 ||
						((object.getActiveBodyparts(ATTACK) > 0 || object.getActiveBodyparts(RANGED_ATTACK) > 0 || object.getActiveBodyparts(WORK) > 0 || object.getActiveBodyparts(CLAIM) > 0) &&
						object.getActiveBodyparts(MOVE) > 0));
				}
			});

			//If find an enemy, check if we need more defenders
			if(findEnemy.length > 0)
			{
				//TO DO: Only request if don't already exceed the amount of attacking body
				//If find an enemy and we don't have at least as many allies in that room, spawn another defender
				var findAlly = Game.spawns[x].room.find(FIND_MY_CREEPS, {
					filter: function(object) {
						return(object.memory.role == 'attack' || object.memory.role == 'defend');
					}
				});

				if(findAlly.length < findEnemy.length)
				{
					targetCreep = findEnemy[0];
					reportRoom = findEnemy[0].room;

					var spawner = require('Spawner');
					spawner.createTempCreep('defend', {'role': 'defend', 'usingSourceId': reportRoom, 'spawnId': Game.spawns[x].id}, Game.spawns[x].room.name);
				}
			}
			else
			{
				Game.spawns[x].room.memory.requestDefender = 0;
			}
		}
	}

	if(targetCreep != null && reportRoom != null)
	{
		//TO DO: Only request if don't already exceed the amount of attacking body
		reportRoom.memory.requestDefender = 1;

		var rangedAttack = targetCreep.getActiveBodyparts(RANGED_ATTACK);
		var attack = targetCreep.getActiveBodyparts(ATTACK);
		if(rangedAttack > 0 || attack > 0)	//If this unit has offensive capabilities, report in 10 minutes
		{
			if(targetCreep.owner.username != 'Invader')
			{
				Game.notify('owner: ' + targetCreep.owner.username + ', has OFFENSIVE creep, has body length: ' + targetCreep.body.length + ' in room ' + targetCreep.room.name, 10);
				Game.notify('OFFENSIVE target has active MOVE: ' + targetCreep.getActiveBodyparts(MOVE) + ', WORK: ' + targetCreep.getActiveBodyparts(WORK) +
							', CARRY: ' + targetCreep.getActiveBodyparts(CARRY) + ', ATTACK: ' + attack + ', RANGED_ATTACK: ' +
							rangedAttack + ', HEAL: ' + targetCreep.getActiveBodyparts(HEAL) + ', TOUGH: ' +
							targetCreep.getActiveBodyparts(TOUGH), 60);
			}
		}
		else	//If this is a passive unit, report every 24 hours
		{
			if(targetCreep.owner.username != 'Invader')
			{
				Game.notify('owner: ' + targetCreep.owner.username + ', has passive creep, has body length: ' + targetCreep.body.length + ' in room ' + targetCreep.room.name, 1440);
				Game.notify('Passive target has active MOVE: ' + targetCreep.getActiveBodyparts(MOVE) + ', WORK: ' + targetCreep.getActiveBodyparts(WORK) +
							', CARRY: ' + targetCreep.getActiveBodyparts(CARRY) + ', HEAL: ' + targetCreep.getActiveBodyparts(HEAL) +
							', TOUGH: ' + targetCreep.getActiveBodyparts(TOUGH), 1440);
			}
		}
	}
	else if(reportRoom != null)
	{
		reportRoom.memory.requestDefender = 0;
	}

	return(targetCreep);
 }

 function removeUnitNearDeath(unit)
 {
	if(unit.ticksToLive <= 2)
	{
		//A emergency unit has reached end of life, remove it from records.
		//This won't help us for units that die due to fighting.
		console.log(unit.name + ' attempted to remove memory ' + Memory.creeps[unit.name] + ' before death.');
		delete Memory.creeps[unit.name];
		unit.suicide();
		return('death');
	}
 }

 function defendBase(unit)
 {
	if(unit.memory.role == 'defend')
	{
		removeUnitNearDeath(unit);
	}
	else
	{
		reportInjury(unit);
	}

	if(unit.memory.usingSourceId != null &&
		unit.memory.usingSourceId != unit.room.name)
	{
		followFlagForward(unit, true);
	}
    else if(Game.flags.Attack != null)
    {
        if(Math.abs(unit.pos.getRangeTo(Game.flags.Attack)) > 1)
        {
			unit.moveTo(Game.flags.Attack);
        }
		else
		{
			var attackCreep = Game.flags.Attack.pos.lookFor('creep');
			var attackStruct = Game.flags.Attack.pos.lookFor('structure');
			var attackAt;
			if(attackCreep.length > 0 && attackCreep[0].my == false)
			{
				attackAt = attackCreep[0];
				var attackCode = unit.attack(attackAt);
			}
			else if(attackStruct.length > 0 && attackStruct[0].my == false)
			{
				attackAt = attackStruct[0];
				var attackCode = unit.attack(attackAt);
			}
		}
    }

    if(unit.getActiveBodyparts(RANGED_ATTACK) > 0)
	{
		//Kill any unit that can heal or can attack and still has capacity to move
		var rangedTargets = unit.pos.findInRange(FIND_HOSTILE_CREEPS, 3, {
			filter: function(object) {
				return(object.getActiveBodyparts(HEAL) > 0 ||
						((object.getActiveBodyparts(ATTACK) > 0 || object.getActiveBodyparts(RANGED_ATTACK) > 0 || object.getActiveBodyparts(WORK) > 0 || object.getActiveBodyparts(CLAIM) > 0) &&
						object.getActiveBodyparts(MOVE) > 0));
			}
		});
		if(rangedTargets.length > 0)	//Report getting close to a offensive unit (I potentially attacked it) every hour.
		{
			if(rangedTargets[0].owner.username != 'Invader')
			{
				Game.notify('owner: ' + rangedTargets[0].owner.username + ', has ' + rangedTargets.length + 'creeps within range 3, has body length: ' + rangedTargets[0].body.length + ' in room ' + unit.room.name, 480);
			}
			if(unit.rangedAttack(rangedTargets[0]) == ERR_NOT_IN_RANGE)
			{
				unit.moveTo(rangedTargets[0]);
				return('travel');
			}
		}
	}

	if(unit.getActiveBodyparts(ATTACK) > 0)
	{
		var targetCreep = detectEnemyCreep(unit);

		if(targetCreep != null)
		{
			if(unit.pos.getRangeTo(targetCreep) > 1)
			{
				unit.moveTo(targetCreep);
				return('travel');
			}
			else
			{
				unit.attack(targetCreep);
			}
		}
		else
		{
			var targetSpawn = unit.room.find(FIND_HOSTILE_SPAWNS);
			//var targetStructure = unit.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
			//TO DO: check if have valid path, ignore if do not
			if(targetSpawn.length)
			{
				var path = unit.pos.findPathTo(targetSpawn[0], {maxOps: 200});
				if( !path.length || !targetSpawn[0].equalsTo(path[path.length - 1]) )
				{
					//No path could be found,
					console.log(unit.name + ' blocked by structure. ' + unit.room.name + ' to target ' + targetSpawn[0]);
					//TO DO: blocked by structure, find weakest way through and target that.
					//path = unit.pos.findPathTo(target, {maxOps: 1000, ignoreDestructibleStructures: true});
				}

				if(unit.attack(targetSpawn[0]) == ERR_NOT_IN_RANGE)
				{
					unit.moveTo(targetSpawn[0]);
					return('travel');
				}
			}
			else if(Game.flags.Guard != null)
			{
				unit.moveTo(Game.flags.Guard);
				return('travel');
			}
		}
	}
	else if(unit.getActiveBodyparts(HEAL) > 0)
	{
		var healComponents = unit.getActiveBodyparts(HEAL);
		var healedUnits = unit.room.find(FIND_MY_CREEPS, {
			filter: function(object) {
				return(object.hits < object.hitsMax);
			}
		});

		//TO DO: Change to store most damaged unit first and heal that first, do we take effectiveness into account?
		//Go through all hurt units and heal them if completely effective (healing wouldn't be wasted). Move closer
		//to one of these units if these conditions are satisfied and not within range 1
		for(var heal in healedUnits)
		{
			var checkUnit = healedUnits[heal];
			if(checkUnit.hits <= checkUnit.hitsMax-(4*healComponents))
			{
				var rangeUnit = unit.pos.getRangeTo(checkUnit);
				//12 Heal per component
				if(rangeUnit <= 1 && checkUnit.hits <= checkUnit.hitsMax-(12*healComponents))
				{
					unit.heal(checkUnit);
				}
				//4 Heal per component
				else if(rangeUnit <= 3 && checkUnit.hits <= checkUnit.hitsMax-(4*healComponents))
				{
					unit.moveTo(checkUnit);
					unit.rangedHeal(checkUnit);
				}
				else
				{
					unit.moveTo(checkUnit);
				}
				break;
			}
		}
	}

	if(Game.flags.Hold != null)
	{
		unit.moveTo(Game.flags.Hold);	//Make unit passive, goes to flag and ignores all previous moves, probably won't attack either.
		return('travel');
	}
	return('attack');
 }

 function healPower(unit)
 {
	removeUnitNearDeath(unit);
	var useSpawn = getSpawnId(unit);
	var bank = Game.getObjectById(unit.memory.bankId);

	if(unit.room.name != bank.room.name)
	{
		followFlagForward(unit, true);
	}
	else
	{
		//Once we are in the right room, move with range of the bank and wait for a pairing unit to show up.
		if(bank != null && unit.pos.getRangeTo(bank) > 2)
		{
			unit.moveTo(bank);
		}
		else if(bank != null)	//And within range
		{
			//We're near the bank at this point, look for the attacker we're paired with
			if(unit.memory.pair != null)
			{
				var pairedUnit = Game.getObjectById(unit.memory.pair);
				//As long as we've found a unit and we're in the same room, go towards it and heal when possible
				if(pairedUnit != null && pairedUnit.room.name == unit.room.name)
				{	//Once paired, move within 1 unit of the paired unit and heal him forever
					var rangeToAttack = unit.pos.getRangeTo(pairedUnit.pos);
					if(rangeToAttack > 3)
					{
						unit.moveTo(pairedUnit);
					}
					else if(rangeToAttack > 1)
					{
						unit.moveTo(pairedUnit);

						//Heal the main unit with rangedHeal if hurt
						if(pairedUnit.hits < pairedUnit.hitsMax)
						{
							unit.rangedHeal(pairedUnit);
						}
						else	//If there is a hurt adjacent unit that is more hurt then the assigned unit, heal it instead
						{
							var nearby = unit.pos.findInRange(FIND_MY_CREEPS, 1, {
								filter: function(object) {
									return(object.hits < object.hitsMax);
								}
							});

							for(var x in nearby)
							{
								if(nearby[x].hits/nearby[x].hitsMax < unit.hits/unit.hitsMax)
								{
									unit.heal(nearby[x]);
									return(true);	//Nothing else needs doing, get out of function
								}
							}
						}
					}
					else if(pairedUnit.hits < pairedUnit.hitsMax)
					{
						//TO DO: If not healing fast enough, check for units that need healing next to the unit and heal them instead (at lower health)
						unit.heal(pairedUnit);
					}
					else	//Next to pairedUnit but it doesn't need healing
					{
						var nearby = unit.pos.findInRange(FIND_MY_CREEPS, 1, {
							filter: function(object) {
								return(object.hits < object.hitsMax);
							}
						});

						for(var x in nearby)
						{
							if(nearby[x].hits/nearby[x].hitsMax < unit.hits/unit.hitsMax)
							{
								unit.heal(nearby[x]);
								return(true);	//Nothing else needs doing, get out of function
							}
						}
					}
				}
			}
			else
			{
				console.log(unit.name + ' either doesnt have heal or assigned pair for healPower');
			}
		}
		else
		{
			console.log(unit.name + ' no found bank in healPower.');
		}
	}
 }

 function rangedPower(unit)
 {
	removeUnitNearDeath(unit);

	//When these entries are found, spawn 2 power, 2 heal and send them to the roomName, when they have identical room names, go to id
	//unit.room.memory.bank = { id: bank[0].id, power: bank[0].power, deathTime: timeTillDeath, roomName: bank[0].room.name, health: healthRatio };
	detectEnemyCreep(unit);

	var useSpawn = getSpawnId(unit);
	var bank;
	//If hasn't been assigned to anywhere, look in memory for a bank to raid, select the first one found and store it in this units memory
	if(unit.memory.usingSourceId == null)
	{
		for(var x in Memory.rooms)
		{
			bank = Memory.rooms[x].bank;
			if(bank != null && bank.deathTime-Game.time > 1500)
			{
				unit.memory.usingSourceId = bank.roomName;
				unit.memory.bankId = bank.id;
				break;
			}
		}
		followFlagForward(unit, true);
	}
	else
	{
		bank = Game.getObjectById(unit.memory.bankId);
		var attack = unit.getActiveComponents(RANGED_ATTACK);

		//As long as we aren't in the right room yet, just follow the path to the appropriate room
		if(unit.room.name != bank.room.name)
		{	//WARNING: Move out of border first? In check above?
			if(unit.hits < unit.hitsMax)
			{
				unit.heal(unit);
			}

			followFlagForward(unit, true);
		}
		else
		{
			//Once we are in the right room, move with range of the bank and wait for a pairing unit to show up.
			var rangeToBank = unit.pos.getRangeTo(bank);
			if(unit.hits < unit.hitsMax)
			{
				unit.heal(unit);
			}

			if(bank != null && rangeToBank > 3)
			{
				unit.moveTo(bank);
			}
			else if(bank != null)	//And within range
			{	//Attack as long as we have over half health
				if(unit.hits/unit.hitsMax > .5 && unit.rangedAttack(bank) == 0 &&
						bank.hits/(attack*10) < unit.memory.pathLength+(3*bank.power/25))
				{
					//hits/attack is how long it will take this unit to destroy the structure
					//If this is less then the time it would to spawn a unit and have him travel over here
					//Spawn a unit and send him this direction.

					//TO DO:
					//Give gathers or power gathers logic enough to go to a power source and return when there is no more
					//on the ground, or when the capacity is full.

					//We're capped at 50 body which caps gather costs at 2550 or if capacity is lower then that, use that.
					var ceiling = Math.min(2550, useSpawn.room.energyCapacityAvailable);
					var gatherAmount = Math.ceil(2.0*bank.power/ceiling) + 1;
					console.log(unit.name + ' is asking for gathers: ' + gatherAmount + ' for power: ' + bank.power);

					var role = 'gather';
					//name = findNextUnusedName(role, useSpawn.room.name);
					var memoryForTempUnit = {'role': role, 'usingSourceId': unit.memory.usingSourceId, 'spawnId': useSpawn.id, 'pathLength': unit.memory.pathLength};

					//Find how many temp gathers we have for this bank, if we don't hit the threshold, attempt to spawn another gather.
					var countTotalGathers;
					if(bank.room.memory.bank.totalGathers != null)
					{
						countTotalGathers = bank.room.memory.bank.totalGathers;
					}
					else
					{
						countTotalGathers = 0;
					}

					//use the role provided and the memory provided for a temp unit. Updating how many gathers we have for this bank.
					if(countTotalGathers < gatherAmount && spawnTempUnit(role, useSpawn, memoryForTempUnit) == true)
					{
						if(bank.room.memory.bank.totalGathers != null)
						{
							bank.room.memory.bank.totalGathers++;
						}
						else
						{
							bank.room.memory.bank.totalGathers = 1;
						}
						console.log('Check for null totalGathers(BAD): ' + bank.room.memory.bank.totalGathers);
					}
				}
			}
			else
			{
				//Bank doesn't exist anymore, if power is on the ground call for a gatherer if needed, otherwise we got here to late
				//or need further orders
				console.log(unit.name + ' power attacker no longer has a bank to attack');

				for(var x in Memory.rooms)
				{
					bank = Memory.rooms[x].bank;
					if(bank != null && bank.id == unit.memory.bankId)
					{
						console.log(unit.name + ' deleting bank id: ' + bank.id);
						delete Memory.rooms[x].bank;
						break;
					}
				}
				//Can use usingSourceId and followFlagForward(unit,false); to return to spawn if desired
				unit.memory.role = 'attack';	//This unit isn't any real use anymore, either kill or translate into attacker to defend the area
			}
		}
	}
 }

 function attackPower(unit)
 {
	removeUnitNearDeath(unit);

	//When these entries are found, spawn 2 power, 2 heal and send them to the roomName, when they have identical room names, go to id
	//unit.room.memory.bank = { id: bank[0].id, power: bank[0].power, deathTime: timeTillDeath, roomName: bank[0].room.name, health: healthRatio };
	detectEnemyCreep(unit);

	var useSpawn = getSpawnId(unit);
	var bank;
	//If hasn't been assigned to anywhere, look in memory for a bank to raid, select the first one found and store it in this units memory
	if(unit.memory.usingSourceId == null)
	{
		for(var x in Memory.rooms)
		{
			bank = Memory.rooms[x].bank;
			if(bank != null && bank.deathTime-Game.time > 1500)
			{
				unit.memory.usingSourceId = bank.roomName;
				unit.memory.bankId = bank.id;
				break;
			}
		}
		followFlagForward(unit, true);
	}
	else
	{
		var attack = unit.getActiveComponents(ATTACK);
		bank = Game.getObjectById(unit.memory.bankId);

		//As long as we aren't in the right room yet, just follow the path to the appropriate room
		if(unit.room.name != bank.room.name)
		{	//WARNING: Move out of border first? In check above?
			//Keep track of how many units we've spawned to heal this attacker, spawn temp healers until we hit 3 of them
			if(attack > 0)
			{
				if(unit.memory.healers == null)
				{
					unit.memory.healers = 0;
				}
				//Spawn 2 healers for each attackPower unit
				if(unit.memory.healers < 1)
				{
					var role = 'healPower';
					//name = findNextUnusedName(role, useSpawn.room.name);
					var memoryForTempUnit = {'role': role, 'usingSourceId': unit.memory.usingSourceId, 'spawnId': useSpawn.id, 'bankId': unit.memory.bankId, 'pair': unit.id};
					if(spawnTempUnit(role, useSpawn, memoryForTempUnit) == true)
					{
						unit.memory.healers++;	//Unit is spawning or in queue to spawn
					}
				}
			}

			followFlagForward(unit, true);
		}
		else
		{
			//Once we are in the right room, move with range of the bank and wait for a pairing unit to show up.
			var rangeToBank = unit.pos.getRangeTo(bank);

			if(bank != null && rangeToBank > 2)
			{
				unit.moveTo(bank);
			}
			else if(bank != null && attack > 0)	//And within range
			{	//If this is a attacker, look for a healer in the room that hasn't been paired and pair him
				if(rangeToBank > 1)
				{
					unit.moveTo(bank);
				}
				else if(unit.hits/unit.hitsMax > .5 && unit.attack(bank) == 0 &&
						bank.hits/(attack*30) < unit.memory.pathLength+(3*bank.power/25))
				{
					//hits/attack is how long it will take this unit to destroy the structure
					//If this is less then the time it would to spawn a unit and have him travel over here
					//Spawn a unit and send him this direction.

					//TO DO:
					//Give gathers or power gathers logic enough to go to a power source and return when there is no more
					//on the ground, or when the capacity is full.

					//We're capped at 50 body which caps gather costs at 2550 or if capacity is lower then that, use that.
					var ceiling = Math.min(2550, useSpawn.room.energyCapacityAvailable);
					var gatherAmount = Math.ceil(2.0*bank.power/ceiling) + 1;
					console.log(unit.name + ' is asking for gathers: ' + gatherAmount + ' for power: ' + bank.power);

					var role = 'gather';
					//name = findNextUnusedName(role, useSpawn.room.name);
					var memoryForTempUnit = {'role': role, 'usingSourceId': unit.memory.usingSourceId, 'spawnId': useSpawn.id, 'pathLength': unit.memory.pathLength};

					//Find how many temp gathers we have for this bank, if we don't hit the threshold, attempt to spawn another gather.
					var countTotalGathers;
					if(bank.room.memory.bank.totalGathers != null)
					{
						countTotalGathers = bank.room.memory.bank.totalGathers;
					}
					else
					{
						countTotalGathers = 0;
					}

					//use the role provided and the memory provided for a temp unit. Updating how many gathers we have for this bank.
					if(countTotalGathers < gatherAmount && spawnTempUnit(role, useSpawn, memoryForTempUnit) == true)
					{
						if(bank.room.memory.bank.totalGathers != null)
						{
							bank.room.memory.bank.totalGathers++;
						}
						else
						{
							bank.room.memory.bank.totalGathers = 1;
						}
						console.log('Check for null totalGathers(BAD): ' + bank.room.memory.bank.totalGathers);
					}
				}
			}
			else
			{
				//Bank doesn't exist anymore, if power is on the ground call for a gatherer if needed, otherwise we got here to late
				//or need further orders
				console.log(unit.name + ' power attacker no longer has a bank to attack');

				for(var x in Memory.rooms)
				{
					bank = Memory.rooms[x].bank;
					if(bank != null && bank.id == unit.memory.bankId)
					{
						console.log(unit.name + ' deleting bank id: ' + bank.id);
						delete Memory.rooms[x].bank;
						break;
					}
				}
				//Can use usingSourceId and followFlagForward(unit,false); to return to spawn if desired
				unit.memory.role = 'attack';	//This unit isn't any real use anymore, either kill or translate into attacker to defend the area
			}
		}
	}
 }

 //Room names are structured like a compass such that 'E/W-###-N/S-###' where
 //a higher number indicates its more North if N is higher or more West if W is higher
 //At the center of the world is E0N0, W0N0, E0S0, W0S0 as they transition over
 //This search from the lowest possible bounds within the observers range (###
 //is as low as possible for both coordinates) and goes through each room and gets a room
 //for the observer to look at, it auto translates if it goes over the border such that
 //low bounds W5S-3 because we started at W10S2 would return W5N2
 function roomNameAtPos(nextRoomName, accessRoom, observerLength, observerRange)
 {
	//Seperate out all of the individual aspects of the startRoom (whether
	//it is N or S, whether it is E or W and how far along that axis.
	var northSouth = nextRoomName.indexOf("N");
	if(northSouth < 0)
	{
		northSouth = nextRoomName.indexOf("S");
	}
	var eastWestLetter = nextRoomName.substring(0, 1);
	var eastWestNum = (nextRoomName.substring(1, northSouth))*1;
	var northSouthLetter = nextRoomName.substring(northSouth, northSouth+1);
	var northSouthNum = (nextRoomName.substring(northSouth+1))*1;

	//console.log(eastWestLetter + '-' + eastWestNum + '-' + northSouthLetter + '-' + northSouthNum);

	//All rooms within range 5 are accessible (11x11 grid) = 121 rooms
	//6th row, 6th column is the starting room (5*11+6) = Room 61
	var roomRow = Math.floor(1.0*accessRoom/observerLength);
	var columnRow = accessRoom - (roomRow*observerLength);
	//The numbers we retrieve below need to move by the mod amount
	var modRowFromStart = roomRow - (observerRange);
	var modColumnFromStart = columnRow - (observerRange);

	//console.log(accessRoom + ' Add to row: ' + modRowFromStart + ' add to column ' + modColumnFromStart);

	//Modify the Num values by the mod values we just found
	eastWestNum += modRowFromStart;
	northSouthNum += modColumnFromStart;
	if(eastWestNum < 0)
	{
		if(eastWestLetter == "E")
		{
			eastWestLetter = "W";
		}
		else if(eastWestLetter == "W")
		{
			eastWestLetter = "E";
		}
		else
		{
			console.log('Found east/west letter ' + eastWestLetter + ' we werent expecting. fix in defense.observe');
		}
		eastWestNum = Math.abs(eastWestNum)-1;
	}
	if(northSouthNum < 0)
	{
		if(northSouthNum == "N")
		{
			northSouthNum = "S";
		}
		else if(northSouthNum == "S")
		{
			northSouthNum = "N";
		}
		else
		{
			console.log('Found north/south letter ' + northSouthNum + ' we werent expecting. fix in defense.observe');
		}
		northSouthNum = Math.abs(northSouthNum)-1;
	}

	//console.log('After modding, looking at:' + eastWestLetter + '-' + eastWestNum + '-' + northSouthLetter + '-' + northSouthNum);
	return(eastWestLetter + eastWestNum + northSouthLetter + northSouthNum);
 }

module.exports.tower = function(nextRoom, enemyInSpawn)
{
	if(nextRoom.controller != null &&
		nextRoom.controller.level >= 3 &&
		nextRoom.controller.owner != null &&
		nextRoom.controller.owner.username == 'RaskVann')
	{
		//tower.energy
		//tower.energyCapacity
		//tower.attack()
		//tower.heal()
		//tower.repair()

		//Level 3-5: 1 Tower, Level 6-7: 2 Towers, Level 8: 4 Towers
    var towers = _.filter(Game.structures, function(object) {
      return(object.room.name == nextRoom.name &&
            object.structureType == STRUCTURE_TOWER);
    });

		if(towers.length > 0)
		{
			//if(enemyInSpawn == null || (enemyInSpawn != null && enemyInSpawn.room.name == towers[0].room.name))
			if(enemyInSpawn != null && enemyInSpawn.room.name == towers[0].room.name)
			{
				//var enemyInSpawn = towers[0].findClosestByRange(FIND_HOSTILE_CREEPS, {
				//	filter: function(object) {
				//		return(object.getActiveBodyparts(ATTACK) > 0 || object.getActiveBodyparts(RANGED_ATTACK) > 0 || object.getActiveBodyparts(HEAL) > 0 ||
				//				object.getActiveBodyparts(WORK) > 0 || object.getActiveBodyparts(CLAIM) > 0);
				//	}
				//});

				for(var tow in towers)
				{
					towers[tow].attack(enemyInSpawn);
				}
			}
			else if(towers[0].room.memory.buildRatio != null)
			{
				var repairThis;
				var buildRatio = towers[0].room.memory.buildRatio;
				//var repairTargets = towers[0].room.find(FIND_MY_STRUCTURES, {
				//	filter: function(object) {
				//		return(object.hits < object.hitsMax && object.hits < object.hitsMax*buildRatio);
				//	}
				//});
        //Finds walls which is the main problem here
        var findMyStructure = _.filter(Game.structures, function(object) {
          return(object.room.name == nextRoom.name &&
            object.hits < object.hitsMax &&
            object.hits < object.hitsMax*buildRatio);
        });
        //TODO: If this is time consuming place it inside the if statement below and move the outside
        //else if just below it as well so we only do a find if findMyStructure fails and then this next
        //find fails as well we go ahead and up the build ratio.
				var findStructure = towers[0].room.find(FIND_STRUCTURES, {
					filter: function(object) {
						return(object.room.name == nextRoom.name &&
              object.hits < object.hitsMax &&
              object.hits < object.hitsMax*buildRatio &&
              (object.structureType == STRUCTURE_CONTAINER || object.structureType == STRUCTURE_WALL));
					}
				});

				if(findStructure.length > 0 || findMyStructure.length > 0)
				{
          if(findMyStructure.length > 0)
          {
            repairThis = _.min(findMyStructure, 'hits');
          }
          else if(findStructure > 0)
          {
            repairThis = _.min(findStructure, 'hits');
          }

					var repairCode;

					for(var tow in towers)
					{
						//Keep some amount of energy in the towers for offence if needed.
						if(towers[tow].energy > (TOWER_CAPACITY * .5))
						{
							repairCode = towers[tow].repair(repairThis);
							//console.log('Tower[' + towers[tow].id + '] repair code: ' + repairCode + ', repairing: ' + repairThis);
						}
					}
				}
				else if(towers[0].room.memory.buildRatio < 1)
				{
					console.log('Towers unable to find new structure to repair. Raising build ratio.');
					towers[0].room.memory.buildRatio += .01;
				}
			}
			else
			{
				console.log('Towers unable to find build ratio?');
				//towers[0].room.memory.buildRatio = .01;
			}
		}
	}
}

module.exports.observe = function(nextRoom)
{
	if(nextRoom.controller != null && nextRoom.controller.owner != null &&
			nextRoom.controller.owner.username == 'RaskVann' && nextRoom.controller.level == 8)
	{
		var observers = nextRoom.find(FIND_MY_STRUCTURES, {
			filter: { structureType: STRUCTURE_OBSERVER }
		});

		if(observers.length > 0)
		{
			var observer = observers[0];
			var observerRange = 5;
			var observerLength = observerRange*2 + 1;
			var observerSize = Math.pow(observerLength, 2);

			var accessRoom = Game.time % observerSize;
			var previousRoom = accessRoom-1;
			var reportTime = 720;
			//Look at the last position in this array if we went just returned from there
			if(previousRoom < 0)
			{
				previousRoom = observerSize-1;
			}

			var lookAtRoom = roomNameAtPos(nextRoom.name, accessRoom, observerLength, observerRange);
			var analyzeRoom = roomNameAtPos(nextRoom.name, previousRoom, observerLength, observerRange);

			//If I don't have access to this room already, observe the room
			if(Game.rooms[lookAtRoom] == null)
				observer.observeRoom(lookAtRoom);

			var analyzeRoomObject = Game.rooms[analyzeRoom];
			if(analyzeRoomObject != null)
			{
				//Evaluate threat of room and notify of changes in threat
				var threatVal = evaluateThreat(analyzeRoomObject);
				if(Memory.rooms[analyzeRoom] == null)
				{
					Memory.rooms[analyzeRoom] = { threat: threatVal };
				}
				else if(threatVal != Memory.rooms[analyzeRoom].threat)
				{
					if(analyzeRoomObject.controller != null)
						Game.notify('Room: ' + analyzeRoom + ' PrevThreat: ' + threatString(Memory.rooms[analyzeRoom].threat) + ', CurrThreat: ' + threatString(threatVal), reportTime);
					Memory.rooms[analyzeRoom].threat = threatVal;
				}

				//Store owner of room and notify of changes in ownership
				if(analyzeRoomObject.controller != null && analyzeRoomObject.controller.owner != null &&
					analyzeRoomObject.controller.owner.username != "RaskVann")
				{
					if(Memory.rooms[analyzeRoom] == null)
					{
						Memory.rooms[analyzeRoom] = { owner: analyzeRoomObject.controller.owner.username };
					}
					else if(Memory.rooms[analyzeRoom].owner != analyzeRoomObject.controller.owner.username)
					{
						Game.notify('Room: ' + analyzeRoom + ' used to have owner ' + Memory.rooms[analyzeRoom].owner + ' now has owner ' + analyzeRoomObject.controller.owner.username, reportTime);
						Memory.rooms[analyzeRoom].owner = analyzeRoomObject.controller.owner.username;
					}
				}
				else if(analyzeRoomObject.controller == null)
				{
					//TO DO: Retrieve master spawn in observers room and pass it in, find way to correctly set usingSourceId without unit's input.
					//storeBank(unit, analyzeRoomObject, useSpawn);
				}
			}
			else
			{
				console.log('Should be able to see ' + analyzeRoom + ' but cannot. Something stopped the observer from looking at it.');
			}

			//TO DO: Else have everything in memory, go through the flagged rooms and just analyze them every so often.
		}
	}
}

module.exports.attackPower = function(unit)
{
	if(unit.memory.role == 'attackPower')
		return(attackPower(unit));
	else if(unit.memory.role == 'healPower')
		return(healPower(unit));
	else if(unit.memory.role == 'rangedPower')
		return(rangedPower(unit));
}

module.exports.detectEnemyCreep = function()
{
	return(detectEnemyCreep(null));
}

module.exports.attack = function(unit, attackersSeen)
{
    if((unit.memory.role == 'attack' || unit.memory.role == 'defend') && !unit.spawning)
    {
        return(defendBase(unit));
    }
	return(null);
}

 //If consecutiveReady > scoutSpawn.memory.maxScouts then all scouts have been ready for at least 1 round
 function trackScoutReadiness(unit, previousScoutState)
 {
	if(unit.memory.spawnId != null)
	{
		var scoutSpawn = Game.getObjectById(unit.memory.spawnId);
		if(previousScoutState != 'ready')
		{
			scoutSpawn.memory.consecutiveReady = 0;
		}
		else if(scoutSpawn.memory.consecutiveReady == null)
		{
			scoutSpawn.memory.consecutiveReady = 1;
		}
		else
		{
			scoutSpawn.memory.consecutiveReady++;
		}
	}
 }

 //Used to determine if all scouts are ready for major moves (next room, path creation, etc.)
 function isScoutsReady(scoutSpawn)
 {
	if(scoutSpawn == null || scoutSpawn.memory == null)
	{
		console.log(scoutSpawn + ' is trying to check for scouts being ready but scoutSpawn is null or undefined.');
		return(false);
	}
	//First run of this goes before trackScoutReadiness which normally populates consecutiveReady
	//we populate the entry in this first instance so we have something to reference below.
	else if(scoutSpawn.memory.consecutiveReady === undefined || scoutSpawn.memory.consecutiveReady === null)
	// !scoutSpawn.memory.consecutiveReady) scoutSpawn.memory.consecutiveReady === "undefined"
	{
		scoutSpawn.memory.consecutiveReady = 0;
	}

	//console.log(scoutSpawn + ' isScoutReady, ' + scoutSpawn.memory.consecutiveReady);
	if(scoutSpawn.memory.scoutsAlive != null)
	{
		//Because every scout checks for the readiness and you retrieve the readiness after the scout is complete
		//we send in a 'ready' for the first scout so he doesn't stall since he won't have any valid readiness to
		//pull from for the first tick. So we'll tell all scouts they are ready if they go through 2 full cycles
		//of all scouts reporting ready to ensure we've retrieved a valid 'ready' status from all scouts.

		//If all scouts reported 'ready', give a go ahead for any advanced functionality.
		return(scoutSpawn.memory.consecutiveReady > (scoutSpawn.memory.scoutsAlive));
	}
	return(false);	//one of the checks we need haven't been made yet.
 }
var scoutsSeen = 1; //TODO : Update this to pull from room information. see getRoleCount() in spawner
module.exports.scout = function(unit, previousScoutState)
{
  if(unit.memory.role == 'scout')
  {
    //Clean up and setup from either the creep first spawning, or coming from a past life.
    if(unit.spawning == true)
    {
      //Delete previous data from the past life.
      if(unit.memory.scoutLead != null)
      {
        delete unit.memory.scoutLead;
      }
      //Can reference this from spawn.room.memory.scoutLeadId later
      if(unit.room.memory.scoutLeadId == null)
      {
          unit.room.memory.scoutLeadId = unit.id;
          unit.memory.scoutLead = true;
      }
      else
      {
        unit.memory.scoutLead = false;
      }
      //TODO : Cleanup scoutLeadId from past lives? This needs to be taken care of as soon as he dies through
      //so we'll need to clean up or fix some other way.
    }
  	else if(!unit.spawning)
  	{
  		var pastState = scout(unit, previousScoutState);
  		trackScoutReadiness(unit, pastState);

  		//If we have plenty of cpu time left, create memory for units to go to this room
  		if(Game.cpu.getUsed() < 10)
  		{
  			createMemoryNew(unit);
  		}

  		//Spawn a route if this unit is in a room we have a pending route to be created (and it doesn't already exist)
  		if(isScoutRouteEmpty() == false)
  		{
  			createPreviousExit(unit);
  		}

  		return(pastState);
  	}
  }
	return(null);
}
