

exports.Entities = Entities;
exports.Entity = Entity;
function Entities(game) {
    /*
    Manager for the base class for moving markers on the map, with stats like health etc
    
    game = Game instance
    */
    this.game = game;
    this.entityList = []; // may use a quadnode in the future
}

Entities.prototype.onGameStart = function() {
    // clear all entities to start afresh
}

Entities.prototype.create = function(params) {
    params.game = this.game;
    this.entityList.push(new Entity(params));
}

function Entity(params) {
    /*
    The player steps the game's time forward, and all other entities do their things
    within that timeframe

    params object:
        game: Game instance (given automatically)
        position: LatLng object (google maps),
        icon: string (link to the icon image),

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
    this.mapMarker = game.gameMap.addMarker(latLng, icon);
    
    this.health = params.health || 1.0;
    this.blood = params.blood || 1.0;
    this.stamina = params.stamina || 1.0;
    this.hunger = params.hunger || 0.0;
    this.thirst = params.thirst || 0.0;
    this.happiness = params.happiness || 0.5;
    this.alertness = params.alertness || 0.5;
    this.temperature = params.temperature || 0.5;
    this.inventory = params.inventory || [];
    this.effects = params.effects || [];
}

Entity.prototype.move = function(latLng) {
    /*
    Will move based on stamina/alertness etc
    */
}