const GameConsole = require("./game-console");

exports.Player = Player;
function Player(game) {
    /*
    Yea, the player

    game = Game instance
    */
    this.game = game;

    this.entity = this.game.entities.create({});
}