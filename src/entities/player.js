const consts = require("../../res/consts").consts;

exports.Player = Player;
function Player(game, params) {
    /*
    The player object, composing of components such as stats, input, etc

    game object = Game instance

    params object:

    */
    this.game = game;

    this.entity = game.entities.create(consts.entities.types.player, this);

    this.components = {
        stats: game.entities.componentManagers.stats.create(this.entity.id, {})
    };
}