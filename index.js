(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const helpers = require("./helpers");

exports.GameConsole = GameConsole;
exports.Documentation = Documentation;

function GameConsole(game) {
    /*
    Handles commands and stuff

    game = Game instance
    */
    this.eventsElement = document.createElement("div"); // ghost element, oooo
    this.eventsElement.commandListeners = {}; // key: command string, value: documentation

	const consoleDiv = document.createElement("div");
	consoleDiv.id = "console";
	const consoleHeaderDiv = document.createElement("div");
	consoleHeaderDiv.id = "console-header";
	consoleHeaderDiv.innerHTML = "Console";
	consoleDiv.appendChild(consoleHeaderDiv);
	game.mainDiv.appendChild(consoleDiv);
    helpers.draggableElement(consoleDiv);
    
    this.textAreaDiv = document.createElement("div");
    this.textAreaDiv.id = "console-text-area";
    consoleDiv.appendChild(this.textAreaDiv);

    this.textAreaLogDiv = document.createElement("div");
    this.textAreaLogDiv.id = "console-text-area-log";
    this.textAreaDiv.appendChild(this.textAreaLogDiv);

    this.textAreaInputDiv = document.createElement("input");
    this.textAreaInputDiv.id = "console-text-area-input";
    this.textAreaInputDiv.type = "text";
    this.textAreaInputDiv.addEventListener("keyup", (e) => {
        e.preventDefault();
        if(e.keyCode === 13) {
            this.readLine();
        }
    });
    this.textAreaDiv.appendChild(this.textAreaInputDiv);

    this.setuDefaultCommands();
}

GameConsole.prototype.writeLine = function(line) {
    /*
    line = string (duh)
    */
    this.textAreaLogDiv.innerText += helpers.sanitizeInput(line) + "\n";
}

GameConsole.prototype.readLine = function() {
    /*
    Processes input and emits an event of the command
    (either some class is going to pick it up, or nothing's gonna happen)
    */
    const inputs = helpers.sanitizeInput(this.textAreaInputDiv.value).split(" ");
    const command = inputs[0];
    const args = inputs.splice(1, inputs.length-1);
    this.executeCommand(command, args);
    this.textAreaInputDiv.value = "";
}

GameConsole.prototype.executeCommand = function(command, args) {
    /*
    command = string

    args = array of strings
    */
    const event = new CustomEvent(command, { detail: { args: args}});
    this.eventsElement.dispatchEvent(event);
}

GameConsole.prototype.addCommandListener = function(documentation) {
    /*
    documentation = Documentation instance
    */
    this.eventsElement.commandListeners[documentation.command] = documentation;
    this.eventsElement.addEventListener(documentation.command, function(e) {
        if(typeof documentation.callback === "function") {
            documentation.callback(e.detail.args);
        }
    }.bind(this));
}

GameConsole.prototype.setuDefaultCommands = function() {
    const introCommand = new Documentation(
        "intro",
        [""],
        "Introduces you to the game, yet again!",
        function(args) {
            const output = [
                "Welcome to the Mapocalypse, you lonely creature!",
                "Type 'start new' to begin a new adventure,",
                "or alternatively, 'start save [your savedata]' to",
                "hopefully resume your journey!",
                "If you neeed help, just type 'help' and some underpaid",
                "civil service workers will come to your assistance!",
                "Good luck, buddy."
            ].join("\n");
            this.writeLine(output);
        }.bind(this)
    );
    this.addCommandListener(introCommand);
    this.executeCommand(introCommand.command);

    const helpCommand = new Documentation(
        "help",
        ["command"],
        "Provides help for a particular command",
        function(args) {
            if(args[0] in this.eventsElement.commandListeners) {
                let commandDocumentation = this.eventsElement.commandListeners[args[0]];
                let output = "Help regarding the " + commandDocumentation.command + " command:\n";
                output += "'" + commandDocumentation.description + "'\n";
                output += "Syntax: " + commandDocumentation.command + " " + helpers.sanitizeInput(commandDocumentation.args);
                this.writeLine(output);
            }
            else {
                if(args.length === 0) {
                    let output = "You can ask for help regarding:\n";
                    for(const key of Object.keys(this.eventsElement.commandListeners)) {
                        output += "'" + key + "' ";
                    }
                    this.writeLine(output);
                }
                else {
                    this.writeLine("Sorry! That command doesn't exist!");
                }
            }
        }.bind(this)
    );
    this.addCommandListener(helpCommand);

    const sayCommand = new Documentation(
        "say",
        ["message"],
        "Print something out into the console",
        function(args) {
            this.writeLine("[You] " + args.join(" "));
        }.bind(this)
    );
    this.addCommandListener(sayCommand);
}

function Documentation(command, args, description, callback) {
    /*
    command = string
    
    args = array of strings (suggested inputs the user should give - not results)

    description = string

    callback = function:
        args = array of strings
    */
    const self = this;
    self.command = command;
    self.args = args;
    self.description = description;
    self.callback = callback;
}
},{"./helpers":5}],2:[function(require,module,exports){
const GameConsole = require("./game-console");

exports.GameData = GameData;

function GameData(game) {
    /*
    Stores data about the game that other classes have constant access to,
    and will save on command
    Compression/Decompression functions obtained from http://rosettacode.org/wiki/LZW_compression#JavaScript
    
    game = Game instance
    */
    this.game = game;

    this.savedata = {
        seed: null, // number
        exploredPlaces: {}, // key: place ID, value: the place's modified stats
        entities: [] // objects of entity's stats
    };

    this.setupCommands();
}

GameData.prototype.setupCommands = function() {
    const loadCommand = new GameConsole.Documentation(
        "load",
        ["savedata"],
        "Loads savedata and gets rid of the current game. Risky biz.",
        function(args) {
            const savedata = args[0];
            this.load(savedata);
        }.bind(this)
    );
    this.game.gameConsole.addCommandListener(loadCommand);

    const saveCommand = new GameConsole.Documentation(
        "save",
        [""],
        "Save and output the savedata for you to keep",
        function(args) {
            this.save(function(savedata) {
                this.game.gameConsole.writeLine([
                    "Here's your savedata. Keep it a local text file or something:",
                    savedata
                ].join("\n"));
            }.bind(this));
        }.bind(this)
    );
    this.game.gameConsole.addCommandListener(saveCommand);
}

GameData.prototype.load = function(savedata) {
    /*
    Loads/decompresses and parses what's given, overriding the current data

    savedata = string
    */
    setTimeout(function() {
        try {
            let compressed = JSON.parse(savedata); // now it's an array of numbers
            let loadedData = JSON.parse(this.decompress(compressed));
            
            //compare the keys of the loaded one and the default one
            let ogKeys = Object.keys(this.savedata).sort();
            let loadedKeys = Object.keys(loadedData).sort();
            if(JSON.stringify(ogKeys) === JSON.stringify(loadedKeys)) {
                this.savedata = Object.assign({}, loadedData);
            }
            else {
                throw "Aw man, the keys don't match";
            }

        } 
        catch(e) {
            this.game.gameConsole.writeLine("Couldn't load savedata!");
        }
    }.bind(this), 0);
}

GameData.prototype.save = function(callback) {
    /*
    Saves the current state of the game
    
    callback function:
        savedata = string
    */
    setTimeout(function() {
        // it returns an array, so we gotta stringify it again lol
        let savedata = JSON.stringify(this.compress(JSON.stringify(this.savedata)));
        if(typeof callback === "function") {
            callback(savedata);
        }
    }.bind(this), 0);
}

GameData.prototype.compress = function(uncompressed) {
    "use strict";
    // Build the dictionary.
    var i,
        dictionary = {},
        c,
        wc,
        w = "",
        result = [],
        dictSize = 256;
    for (i = 0; i < 256; i += 1) {
        dictionary[String.fromCharCode(i)] = i;
    }

    for (i = 0; i < uncompressed.length; i += 1) {
        c = uncompressed.charAt(i);
        wc = w + c;
        //Do not use dictionary[wc] because javascript arrays 
        //will return values for array['pop'], array['push'] etc
       // if (dictionary[wc]) {
        if (dictionary.hasOwnProperty(wc)) {
            w = wc;
        } else {
            result.push(dictionary[w]);
            // Add wc to the dictionary.
            dictionary[wc] = dictSize++;
            w = String(c);
        }
    }

    // Output the code for w.
    if (w !== "") {
        result.push(dictionary[w]);
    }
    return result;
}

GameData.prototype.decompress = function(compressed) {
    "use strict";
    // Build the dictionary.
    var i,
        dictionary = [],
        w,
        result,
        k,
        entry = "",
        dictSize = 256;
    for (i = 0; i < 256; i += 1) {
        dictionary[i] = String.fromCharCode(i);
    }

    w = String.fromCharCode(compressed[0]);
    result = w;
    for (i = 1; i < compressed.length; i += 1) {
        k = compressed[i];
        if (dictionary[k]) {
            entry = dictionary[k];
        } else {
            if (k === dictSize) {
                entry = w + w.charAt(0);
            } else {
                return null;
            }
        }

        result += entry;

        // Add w+entry[0] to the dictionary.
        dictionary[dictSize++] = w + entry.charAt(0);

        w = entry;
    }
    return result;
}
},{"./game-console":1}],3:[function(require,module,exports){


exports.GameMap = GameMap;

function GameMap(game) {
    /*
    Container and manager of the google maps object

    game = Game instance
    */
    this.mapDiv = document.createElement("div");
    this.mapDiv.id = "map";
    const mapocalypseMapStyle = new google.maps.StyledMapType(
        [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#ebe3cd"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#523735"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#f5f1e6"
                }
              ]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#c9b2a6"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#dcd2be"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#ae9e90"
                }
              ]
            },
            {
              "featureType": "landscape.natural",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#cfc8ad"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dfd2ae"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#93817c"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#aab18b"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#447530"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#f5f1e6"
                },
                {
                  "weight": 0.5
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#fdfcf8"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#f8c967"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#e9bc62"
                }
              ]
            },
            {
              "featureType": "road.highway.controlled_access",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#e98d58"
                }
              ]
            },
            {
              "featureType": "road.highway.controlled_access",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#db8555"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#806b63"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dfd2ae"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#8f7d77"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#ebe3cd"
                }
              ]
            },
            {
              "featureType": "transit.station",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dfd2ae"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#b7d5ca"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#92998d"
                }
              ]
            }
          ], {name: "Mapocalypse Style"});
    this.map = new google.maps.Map(this.mapDiv, {
        center: new google.maps.LatLng(53.551458, -1.923063),
        zoom: 10,
        minZoom: 2,
        disableDefaultUI: true,
        mapTypeControlOptions: {
            mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "mapocalypse_style"]
        }
    });
    this.map.mapTypes.set("mapocalypse_style", mapocalypseMapStyle);
    this.map.setMapTypeId("mapocalypse_style");

    game.mainDiv.appendChild(this.mapDiv);

}


},{}],4:[function(require,module,exports){
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

},{"./game-console":1,"./game-data":2,"./game-map":3}],5:[function(require,module,exports){

exports.draggableElement = draggableElement;
function draggableElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "-header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

exports.sanitizeInput = sanitizeInput;
function sanitizeInput(message, charLimit) {
    if (typeof message == "object") {
        message = JSON.stringify(message);
    }
    if (typeof message != "object" && typeof message != "string") {
        return "Hey, someone tried to sanitize some hogwash.";
    }
    if (charLimit) {
        message.slice(0, charLimit);
    }
    return message.replace(/</g, "&lt;"); // TODO: either whitelist acceptable formatting tags, or blacklist bad ones
    // (?!b|\/b|em|\/em|i|\/i|small|\/small|strong|\/strong|sub|\/sub|sup|\/sup|ins|\/ins|del|\/del|mark|\/mark|a|\/a|img|\/img|li|\/li|h|\/h|p|\/p|tt|\/tt|code|\/code|br|\/br|video|\/video|source|\/source)
}

},{}],6:[function(require,module,exports){
const Game = require("./game");

window.onload = init;
function init() {
	const game = new Game.Game();
}


},{"./game":4}]},{},[6]);
