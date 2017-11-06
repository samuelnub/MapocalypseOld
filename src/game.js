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
        "start",
        ["new | save", "new: easy/normal/hard | save: savedata"],
        "Either starts a new game, or loads a savefile that you provide.",
        function(args) {
            if(args.length === 0) {
                this.gameConsole.writeLine("Do you want a [new] game or one from a [save] data?");
            }
            else if(args[0] === "new") {
                if(args[1] === "easy") {
                    this.startNewGame(0);
                }
                else if(args[1] === "normal") {
                    this.startNewGame(1);
                }
                else if(args[1] === "hard") {
                    this.startNewGame(2);
                }
            }
            else if(args[0] === "save") {
                this.startSaveGame(args[1]);
            }
        }.bind(this)
    );
    this.gameConsole.addCommandListener(startCommand);
}

Game.prototype.startNewGame = function (difficulty) {
    /*
    difficulty = integer (easy = 0/normal = 1/hard = 2)
    */
    this.gameConsole.writeLine("You chose the difficulty setting of: " + difficulty);
}

Game.prototype.startSaveGame = function(savedata) {
    this.gameData.load(savedata);
}