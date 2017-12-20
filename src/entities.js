const helpers = require("./helpers");
const locale = require("../res/localisation").locale;
const GameConsole = require("./game-console");

const PlayerManager = require("./entities/player-manager");

exports.Entities = Entities;
exports.Entity = Entity;

const maxMoveRadiusKm = 5;
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
        [entityTypes.player]: new PlayerManager.PlayerManager(game)
    };
    
    this.setupEventListeners();
}

Entities.prototype.setupEventListeners = function() {
    this.game.gameConsole.addEventListener(GameConsole.events.game.gameStartNew, function(items) {
        this.onGameStart(items).bind(this);
    }.bind(this));
    this.game.gameConsole.addEventListener(GameConsole.events.game.gameStartLoad, function() {
        this.onGameStart().bind(this);
    }.bind(this));

    this.game.gameConsole.addEventListener(GameConsole.events.gameMap.printMapContextMenu, function(items) {
        // because clicking the map isn't directly related to the player
        // entity, we need to listen out for general map clicks
        if(this.entityManagers[entityTypes.player].entityIds.size > 0) {
            // the player exists, cool
            let playerEntity = this.entityList[this.entityManagers[entityTypes.player].getPlayerEntityId()];
            let newPosAttempt = items.contextEvent.latLng;
            let curPos = playerEntity.stats.position;

            items.appendOption({
                text: locale.entities.player.moveToButton,
                callback: function(e) {
                    
                    if(helpers.distBetweenLatLngKm(curPos, newPosAttempt) > maxMoveRadiusKm) {
                        this.game.gameConsole.writeLine(locale.general.noThatsTooFar);
                        return;
                    }
                    this.game.gameMap.isPosWater(newPosAttempt, function(isWater) {
                        if(isWater) {
                            this.game.gameConsole.writeLine(locale.general.noThatsWater);
                            return;
                        }
                        playerEntity.move(newPosAttempt, true, function(e) {
                            console.log("Player just finished moving (should tick now)");
                        });
                    }.bind(this));
                }.bind(this)
            });
        }
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

    if(items) { // from new
        let playerEntity = new Entity({
            game: this.game,
            type: entityTypes.player,
            stats: {
                position: items.spawnPos
            }
        });
    }
    else { // from load

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
    */
    this.game = params.game;
    this.id = params.id || helpers.uuid();
    this.type = params.type;

    this.game.entities.entityList[this.id] = this;
    this.game.entities.entityManagers[this.type].entityIds.add(this.id);

    this.stats = {
        position: params.stats.position || new google.maps.LatLng(0, 0),
        health: params.stats.health || 1.0,
        blood: params.stats.blood || 1.0,
        stamina: params.stats.stamina || 1.0,
        hunger: params.stats.hunger || 0.0,
        thirst: params.stats.thirst || 0.0,
        happiness: params.stats.happiness || 0.5,
        alertness: params.stats.alertness || 0.5,
        temperature: params.stats.temperature || 0.5,
        inventory: params.stats.inventory || [],
        effects: params.stats.effects || []
    };

    let markerParams = entityTypesMarkerParams[this.type];
    markerParams.position = this.stats.position;
    markerParams.id = this.id;
    markerParams.onClickCallback = function() {
        this.game.entities.entityManagers[this.type].onClick(this);
    }.bind(this);
    markerParams.printMapContextMenuOnClick = true;
    this.marker = this.game.gameMap.createMarker(markerParams);
}

Entity.prototype.move = function(position, adjustStats, callback) {
    /*
    Moves the entity's marker and stats position.
    if adjustStats is true, it'll also decrement/increment stats

    position: latLng
    adjustStats: bool
    callback: function
        newPos = latLng
    */

    this.marker.setPosition(position);
    this.stats.position = position;

    if(adjustStats) {
        // TODO: complex shazam
    }
    // update stats.position too
}

Entity.prototype.export = function() {
    /*
    returns an object that just has the things you need
    */
    return {
        id: this.id,
        type: this.type,
        stats: this.stats
    };
}
