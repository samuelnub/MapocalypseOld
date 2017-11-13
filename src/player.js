const GameConsole = require("./game-console");

exports.Player = Player;
function Player(game) {
    /*
    Yea, the player

    game = Game instance
    */
    this.game = game;

    this.entity = null;

    this.game.gameConsole.addEventListener(GameConsole.events.game.gameStart, this.onGameStart.bind(this));
}

Player.prototype.onGameStart = function() {
    console.log("Game starting! the player has heard that");
}