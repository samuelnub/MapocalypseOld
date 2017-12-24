const helpers = require("../helpers");
const Entities = require("../entities");
const locale = require("../../res/localisation").locale;
const GameConsole = require("../game-console");

exports.GoalManager = GoalManager;
function GoalManager(game) {
    /*
    manages the goal entity

    game = game instance
    */

    this.game = game;

    this.entityIds = new Set();
}

GoalManager.prototype.tick = function(entity) {
    /*
    entity = entity that was looped over
    */

}

GoalManager.prototype.onClick = function(entity) {
    /*
    when that particular entity of this type is clicked
    */
    let entityList = this.game.entities.entityList;
    if(helpers.distBetweenLatLngKm(entityList[this.getGoalEntityId()].stats[Entities.entityStatNames.position], entityList[this.game.entities.entityManagers[Entities.entityTypes.player].getPlayerEntityId()].stats[Entities.entityStatNames.position]) < Entities.maxMoveRadiusKm) {
        this.game.gameConsole.addEventListener(GameConsole.events.gameMap.printMapContextMenu, function(items) {
            items.appendOption({
                text: locale.entities.goal.finishButton,
                callback: function(e) {
                    this.game.gameConsole.executeEvent(GameConsole.events.entities.goal.finish);
                }.bind(this)
            });
        }.bind(this), true);
    }
}

GoalManager.prototype.getGoalEntityId = function() {
    /*
    Just your friendly neighbourhood helper
    */
    return this.entityIds.values().next().value;
}