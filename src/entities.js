const helpers = require("./helpers");
const consts = require("../res/consts").consts;
const GameConsole = require("./game-console");

exports.Entities = Entities;
exports.Entity = BaseEntity;

function Entities(game) {
    /*
    Manager for the base class for moving markers on the map, with stats like health etc
    
    game = Game instance
    */
    this.game = game;

    this.baseEntityList = {}; // general pool, key: baseEntity.id, value: object composing of an entity

    this.entities = { // actual entities that consist of the BaseEntity
        player: null,
        enemies: [],
        goal: null,
    };

    this.game.gameConsole.addEventListener(GameConsole.events.game.gameStartNew, function(items) {
        this.onGameStartNew(items);
    }.bind(this));
    this.game.gameConsole.addEventListener(GameConsole.events.game.gameStartLoad, function() {
        this.onGameStartLoad();
    }.bind(this));
}

Entities.prototype.onGameStartNew = function(items) {
    /*
    items object: from the event emitted by onGameStartNew
    */
    this.game.gameConsole.writeLine("Haha fools, a new game has begun");
}

Entities.prototype.onGameStartLoad = function() {

}

Entities.prototype.remove = function(entity) {
    /*
    entity object: BaseEntity reference
    */

}

Entities.prototype.tick = function() {

}

function BaseEntity(params) {
    /*
    params object:
        game = Game instance
        type = number
        markerParams object:
            refer to params object
        stats object:
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
    this.id = helpers.uuid();

    this.game.entities.entityList[this.id] = this;

    this.type = params.type;
    this.marker = this.game.gameMap.createMarker(
        params.markerParams || {}
    );

    this.stats = {
        health: params.health || 1.0,
        blood: params.blood || 1.0,
        stamina: params.stamina || 1.0,
        hunger: params.hunger || 0.0,
        thirst: params.thirst || 0.0,
        happiness: params.happiness || 0.5,
        alertness: params.alertness || 0.5,
        temperature: params.temperature || 0.5,
        inventory: params.inventory || [],
        effects: params.effects || []
    };
}

