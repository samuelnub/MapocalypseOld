const GameConsole = require("./game-console");

exports.Player = Player;
function Player(game) {
    /*
    Yea, the player

    game = Game instance
    */
    this.game = game;

    this.entity = this.game.entities.create({});

    // test
    this.game.gameMap.onClick(function(e){
        this.game.gameMap.addMarker(e.latLng, "enemy");
    }.bind(this));
}