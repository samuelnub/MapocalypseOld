const locale = require("../res/localisation").locale;
const helpers = require("./helpers");
const GameMap = require("./game-map");
const GameConsole = require("./game-console");
const GameData = require("./game-data");
const Entities = require("./entities");

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
    this.entities = new Entities.Entities(this);

    this.tests = new Tests.Tests(this);

    this.setupCommands();
    this.setupEventListeners();
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
            else if(args[0] === locale.game.startCommandNewArg) {
                let spawnPos = null;
                let goalPos = null;

                const getSpawnPos = function() {
                    this.gameConsole.writeLine(locale.game.startCommandNewSpawn);
                    this.gameConsole.addEventListener(GameConsole.events.gameMap.printMapContextMenu, function(items) {
                        items.appendOption({
                            text: locale.game.startCommandNewSpawnButton,
                            callback: function(e) {
                                this.gameMap.isPosWater(items.contextEvent.latLng, function(isWater) {
                                    if(isWater) {
                                        this.gameConsole.writeLine(locale.general.noThatsWater);
                                        getSpawnPos();
                                        return;
                                    }
                                    else {
                                        spawnPos = items.contextEvent.latLng;
                                        getGoalPos();
                                    }
                                }.bind(this));
                            }.bind(this)
                        });
                    }.bind(this), true);
                }.bind(this);

                const getGoalPos = function() {
                    this.gameConsole.writeLine(locale.game.startCommandNewGoal);
                    this.gameConsole.addEventListener(GameConsole.events.gameMap.printMapContextMenu, function(items) {
                        items.appendOption({
                            text: locale.game.startCommandNewGoalButton,
                            callback: function(e) {
                                this.gameMap.isPosWater(items.contextEvent.latLng, function(isWater) {
                                    if(isWater) {
                                        this.gameConsole.writeLine(locale.general.noThatsWater);
                                        getGoalPos();
                                        return;
                                    }
                                    else {
                                        goalPos = items.contextEvent.latLng;
                                        this.gameConsole.executeEvent(GameConsole.events.game.gameStartNew, {
                                            spawnPos: spawnPos,
                                            goalPos: goalPos
                                        });
                                    }
                                }.bind(this));
                            }.bind(this)
                        });
                    }.bind(this), true);
                }.bind(this);

                getSpawnPos();
            }
            else if(args[0] === locale.game.startCommandLoadArg) {
                this.gameData.load(args[1], function(savedata) {
                    this.gameConsole.executeEvent(GameConsole.events.game.gameStartLoad, savedata);                 
                }.bind(this));
            }
        }.bind(this)
    );
    this.gameConsole.addCommandListener(startCommand);
}

Game.prototype.setupEventListeners = function() {
    window.onbeforeunload = function() {
        // remember to save up, boyz
        return locale.general.nothing;
    };

    this.gameConsole.addEventListener(GameConsole.events.entities.goal.finish, function(items) {
        this.gameConsole.executeEvent(GameConsole.events.game.gameFinish);
        this.gameConsole.writeLine(locale.game.gameFinishMessage, true, function(lineP) {
            lineP.classList.add(locale.styling.specialClass);
        });
    }.bind(this));
}