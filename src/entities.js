const helpers = require("./helpers");
const consts = require("../res/consts").consts;
const GameConsole = require("./game-console");
const StatsComponentManager = require("./components/stats-component");

exports.Entities = Entities;

function Entities(game) {
    /*
    Manager for the base class for moving markers on the map, with stats like health etc
    
    game = Game instance
    */
    this.game = game;

    this.entityList = {}; // general pool, key: entity.id, value: object composing of an entity

    this.componentIds = { // do not clear these by setting it to an empty array
        stats: [],
        movement: [],
        graphial: [],
        ai: [],
        input: []
    };

    this.componentManagers = {
        stats: new StatsComponentManager.StatsComponentManager(this.game)
    };

    this.game.gameConsole.addEventListener(GameConsole.events.game.gameStart, this.onGameStart.bind(this));
}

Entities.prototype.onGameStart = function() {
    // TODO: clear all entities to start afresh
    // (youll have to go through things like map markers and clear those)
    for(let entity of this.entityList) {
        this.remove(entity);
    }

}

Entities.prototype.create = function(type, typeRef) {
    /*
    returns a new entity (which has been shoved into the entity pool object)

    type = int
        reference consts.js file for entity types

    typeRef object: the object that contains this new entity you want, eg,
    the Player() class instance's "this" context
    */
    params.game = this.game;
    const entity = new Entity(type, typeRef);
    this.entityList[entity.id] = entity;
    return entity;
}

Entities.prototype.remove = function(entity) {
    /*
    entity object: Entity reference
    */
    for(let components of this.componentIds) {
        try {
            components.splice(components.indexOf(entity.id));
        }
        catch(e) {
            ;
        }
    }
    delete this.entityList[entity.id];
}

Entities.prototype.getEntityData = function(entity) {
    /*
    returns an object with all the juicy, minimalist info you need to save
    its state

    entity object: Entity instance
    */

    let output = {};
    output.entity = {
        id: entity.id,
        type: entity.type
    };
    for(let component of entity.components) {
        // TODO: export an entity's essential data for saving
    }
}

Entities.prototype.tick = function() {
    for(let manager of this.componentManagers) {
        manager.tick();
    }
}

function Entity(type, typeRef) {
    /*
    type = number (Reference consts.js for entity types)
    
    typeRef = the object that created the new entity (eg Player() instance)
    */
    this.id = helpers.uuid();
    this.type = type;
    this.typeRef = typeRef;
    console.log("I am a new entity! with id " + this.id + " and type " + this.type);
}