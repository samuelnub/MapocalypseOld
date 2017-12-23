const locale = require("../../res/localisation").locale;
const helpers = require("../helpers");
const GameConsole = require("../game-console");
const Entities = require("../entities");

exports.PlayerManager = PlayerManager;
function PlayerManager(game) {
    /*
    Player manager

    game object = Game instance
    */
    this.game = game;

    this.entityIds = new Set();

    this.game.gameConsole.addEventListener(GameConsole.events.gameMap.printMapContextMenu, function(items) {
        // because clicking the map isn't directly related to the player
        // entity, we need to listen out for general map clicks
        if(this.entityIds.size > 0) {
            // the player exists, cool
            let playerEntity = this.game.entities.entityList[this.getPlayerEntityId()];
            let newPosAttempt = items.contextEvent.latLng;
            let curPos = playerEntity.stats.position;

            items.appendOption({
                text: locale.entities.player.moveToButton,
                callback: function(e) {
                    
                    if(helpers.distBetweenLatLngKm(curPos, newPosAttempt) > Entities.maxMoveRadiusKm) {
                        this.game.gameConsole.writeLine(locale.general.noThatsTooFar);
                        return;
                    }
                    this.game.gameMap.isPosWater(newPosAttempt, function(isWater) {
                        if(isWater) {
                            this.game.gameConsole.writeLine(locale.general.noThatsWater);
                            return;
                        }
                        playerEntity.move(newPosAttempt);
                        this.game.entities.tick();
                    }.bind(this));
                }.bind(this)
            });
        }
    }.bind(this));
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