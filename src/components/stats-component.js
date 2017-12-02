
exports.StatsComponentManager = StatsComponentManager;

function StatsComponentManager(game) {                                                                  
    /*
    game object: Game reference
    */
    this.game = game;
    this.entityList = game.entities.entityList;
    this.entityIdList = game.entities.componentIds.stats;
}

StatsComponentManager.prototype.create = function(entityId, params) {
    /*
    returns a new statsComponent that's been properly linked

    entityId = string
    */
    let statsComponent = new StatsComponent(entityId, params);
    this.entityIdList.push(entityId);
    return statsComponent;
}

StatsComponentManager.prototype.tick = function() {
    for(let entityId of this.entityIdList) {
        let entity = this.entityList[entityId];
        // TODO: do your thang
    }
}

function StatsComponent(entityId, params) {
    /*
    should have no functions, just pure data

    entityId = string: entity reference (the entity that this will be attached to)
    
      
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

    this.entityId = entityId;

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