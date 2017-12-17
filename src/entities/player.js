const consts = require("../../res/consts").consts;
const BaseEntity = require("../entities").BaseEntity;

exports.Player = Player;
function Player(game, params) {
    /*
    The player object, composing of components such as stats, input, etc

    game object = Game instance

    params object:
        baseEntityParams: refer to BaseEntities
    */
    this.game = game;

    this.baseEntity = new BaseEntity({
        
    });
}