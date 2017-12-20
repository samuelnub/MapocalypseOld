const GameConsole = require("../game-console");

exports.PlayerManager = PlayerManager;
function PlayerManager(game) {
    /*
    Player manager

    game object = Game instance
    */
    this.game = game;

    this.entityIds = new Set();
}

PlayerManager.prototype.tick = function(entity) {
    /*
    entity object = entity that has been iterated through during entity.tick()
    */
}

PlayerManager.prototype.onClick = function(entity) {
    /*
    When that entity (that called this) is clicked, what should be done?

    entity object = entity that called this function
    */
    this.game.gameConsole.addEventListener(GameConsole.events.gameMap.printMapContextMenu, function(items) {
        items.appendOption({
            text: "Say hi",
            callback: function(e) {
                this.game.gameConsole.writeLine("hello!");
            }.bind(this)
        });
    }.bind(this), true);
}

PlayerManager.prototype.getPlayerEntityId = function() {
    /*
    Just your friendly neighbourhood helper
    */
    return this.entityIds.values().next().value; // it's a hellhole
}