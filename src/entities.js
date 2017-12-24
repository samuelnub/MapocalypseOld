const helpers = require("./helpers");
const locale = require("../res/localisation").locale;
const GameConsole = require("./game-console");
const GameData = require("./game-data");

const PlayerManager = require("./entities/player-manager");
const GoalManager = require("./entities/goal-manager");

exports.Entities = Entities;
exports.Entity = Entity;

const maxMoveRadiusKm = 10;
exports.maxMoveRadiusKm = maxMoveRadiusKm;

const entityTypes = {
    player: 1,
    goal: 2,
    enemy: 3
};
exports.entityTypes = entityTypes;

const entityTypesMarkerParams = {
    [entityTypes.player]: {
        icon: locale.files.icons.player,
        title: locale.entities.names.player
    },
    [entityTypes.goal]: {
        icon: locale.files.icons.goal,
        title: locale.entities.names.goal
    },
    [entityTypes.enemy]: {
        icon: locale.files.icons.enemy,
        title: locale.entities.names.enemy
    }
};

const entityStatNames = {
    position: "position",
    health: "health",
    blood: "blood",
    stamina: "stamina",
    hunger: "hunger",
    thirst: "thirst",
    happiness: "happiness",
    alertness: "alertness",
    temperature: "temperature",
    inventory: "inventory",
    effects: "effects"
};
exports.entityStatNames = entityStatNames;

function Entities(game) {
    /*
    Manager for the base class for moving markers on the map, with stats like health etc
    
    game = Game instance
    */
    this.game = game;

    this.entityList = {}; // general pool, key: baseEntity.id, value: object composing of an entity

    this.entityManagers = {
        /*
        Manager classes must contain at least:
            this.entityIds = Set()
            this.tick = function(entity)
            this.onClick = function(entity)
        */
        [entityTypes.player]: new PlayerManager.PlayerManager(game),
        [entityTypes.goal]: new GoalManager.GoalManager(game)
    };
    
    this.setupEventListeners();
}

Entities.prototype.setupEventListeners = function() {
    this.game.gameConsole.addEventListener(GameConsole.events.game.gameStartNew, function(items) {
        this.onGameStart(items).bind(this);
    }.bind(this));
    this.game.gameConsole.addEventListener(GameConsole.events.game.gameStartLoad, function(items) {
        this.onGameStart(items).bind(this); // items is savedata
    }.bind(this));
}

Entities.prototype.onGameStart = function(items) {
    /*
    items object: from the event emitted by onGameStartNew
    so if it's from load, no items are passed and you'd just read from savedata
    */
    for(const id of Object.keys(this.entityList)) {
        this.remove(this.entityList[id]);
    }

    if(!items.hasOwnProperty(GameData.savedataLayout.checkNum)) { // from new
        let playerEntity = new Entity({
            game: this.game,
            type: entityTypes.player,
            stats: {
                position: items.spawnPos
            }
        });
        let goalEntity = new Entity({
            game: this.game,
            type: entityTypes.goal,
            stats: {
                position: items.goalPos
            }
        });
    }
    else { // from load
        let entitiesSavedata = items[GameData.savedataLayout.entities];
        for(const id of Object.keys(entitiesSavedata)) {
            let params = entitiesSavedata[id];
            params.stats[entityStatNames.position] = new google.maps.LatLng(params.stats[entityStatNames.position]); // the pain of google's LatLng objects
            params.prevStats[entityStatNames.position] = new google.maps.LatLng(params.prevStats[entityStatNames.position]);            
            params.game = this.game;
            let entity = new Entity(params);
        }
    }
}

Entities.prototype.remove = function(entity) {
    /*
    entity object: entity reference
    */
    this.game.gameMap.removeMarker(entity.marker);
    this.entityManagers[entity.type].entityIds.delete(entity.id);
    delete this.entityList[entity.id];
}

Entities.prototype.tick = function() {
    for(const id of Object.keys(this.entityList)) {
        this.entityManagers[this.entityList[id].type].tick(this.entityList[id]);
    }
}

Entities.prototype.getSavedata = function() {
    /*
    returns the current entities (as their exported form)
    */
    let output = {};
    for(const id of Object.keys(this.entityList)) {
        output[id] = this.entityList[id].export();
    }
    return output;
}

function Entity(params) {
    /*
    params object:
        game = Game instance
        id = string
        type = number
        stats object:
            position: latLng
            health: float,
            blood: float,
            stamina: float,
            hunger: float,
            thirst: float,
            happiness: float,
            alertness: float,
            temperature: float
            inventory: [],
            effects: []
        prevStats object:
            refer to stats
    */
    this.game = params.game;
    this.id = params.id || helpers.uuid();
    this.type = params.type;

    this.game.entities.entityList[this.id] = this;
    this.game.entities.entityManagers[this.type].entityIds.add(this.id);

    this.stats = { // current stats
        [entityStatNames.position]: params.stats.position || new google.maps.LatLng(0, 0),
        [entityStatNames.health]: params.stats.health || 1.0,
        [entityStatNames.blood]: params.stats.blood || 1.0,
        [entityStatNames.stamina]: params.stats.stamina || 1.0,
        [entityStatNames.hunger]: params.stats.hunger || 0.0,
        [entityStatNames.thirst]: params.stats.thirst || 0.0,
        [entityStatNames.happiness]: params.stats.happiness || 0.5,
        [entityStatNames.alertness]: params.stats.alertness || 0.5,
        [entityStatNames.temperature]: params.stats.temperature || 0.5,
        [entityStatNames.inventory]: params.stats.inventory || [],
        [entityStatNames.effects]: params.stats.effects || []
    };

    this.prevStats = {}; // previous attributes for delta, remember to setStats() whenever you wanna change something
    Object.assign(this.prevStats, params.prevStats || this.stats);

    let markerParams = entityTypesMarkerParams[this.type];
    markerParams.position = this.stats.position;
    markerParams.id = this.id;
    markerParams.onClickCallback = function() {
        this.game.entities.entityManagers[this.type].onClick(this);
    }.bind(this);
    markerParams.printMapContextMenuOnClick = true;
    this.marker = this.game.gameMap.createMarker(markerParams);
}

Entity.prototype.move = function(position) {
    /*
    Moves the entity's marker and stats position.
    Reminder: these are animated markers. the getPosition() function will return the ultimate pos,
    but there will be a timespan between you visually seeing the marker move

    position: latLng
    */
    this.setStat(entityStatNames.position, position);
    this.marker.setPosition(position);
}

Entity.prototype.setStat = function(statName, value) {
    /*
    statName: entityStatNames (string)
    value: value you want to set...
    */
    Object.assign(this.prevStats[statName], this.stats[statName]);
    Object.assign(this.stats[statName], value);
}

Entity.prototype.export = function() {
    /*
    returns an object that just has the things you need
    */
    return {
        id: this.id,
        type: this.type,
        stats: this.stats,
        prevStats: this.prevStats
    };
}
