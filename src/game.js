const locale = require("../res/localisation").locale;
const helpers = require("./helpers");
const GameMap = require("./game-map");
const GameConsole = require("./game-console");
const GameData = require("./game-data");

const Tests = require("./tests");

exports.Game = Game;

function Game() {
    /*
    This houses all of the logic and subobjects
    */
    this.mainDiv = document.getElementById("main");
    this.gameConsole = new GameConsole.GameConsole(this); // should be setup first
    this.gameMap = new GameMap.GameMap(this);
    this.gameData = new GameData.GameData(this);

    this.tests = new Tests.Tests(this);

    this.setupCommands();
}

Game.prototype.setupCommands = function() {
    const startCommand = new GameConsole.Documentation(
        locale.game.docStartCmd,
        locale.game.docStartArgs,
        locale.game.docStartDesc,
        function(args) {
            if(args.length === 0) {
                this.gameConsole.writeLine(locale.game.startCommandNoArgs);
            }
            else if(args[0] === "new") {
                
            }
            else if(args[0] === "save") {
                this.startSaveGame(args[1]);
            }
        }.bind(this)
    );
    this.gameConsole.addCommandListener(startCommand);
}

Game.prototype.startSaveGame = function(savedata) {
    this.gameData.load(savedata);
}