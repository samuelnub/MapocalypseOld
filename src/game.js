const GameMap = require("./game-map");
const GameConsole = require("./game-console");
const GameData = require("./game-data");

exports.Game = Game;

function Game() {
    /*
    This houses all of the logic and subobjects
    */
    this.mainDiv = document.getElementById("main");
    this.gameConsole = new GameConsole.GameConsole(this); // should be setup first
    this.gameMap = new GameMap.GameMap(this);
    this.gameData = new GameData.GameData(this);

    this.setupCommands();
}

Game.prototype.setupCommands = function() {
    const startCommand = new GameConsole.Documentation(
        "start",
        ["new | save", "new: easy/normal/hard | save: savedata"],
        "Either starts a new game, or loads a savefile that you provide.",
        function(args) {
            if(args.length === 0) {
                this.gameConsole.writeLine("Do you want a [new] game or one from a [save] data?");
            }
            else if(args[0] === "new") {
                
            }
            else if(args[0] === "save") {

            }
        }.bind(this)
    );
    this.gameConsole.addCommandListener(startCommand);
}
