(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const config = {
    debug: true
};
exports.config = config;
},{}],2:[function(require,module,exports){
const helpers = require("../src/helpers");

const events = {
    /*
    Houses eventnames that can/will be executed along the way by some function
    Commands doesnt need one of 
    these lists cause the commandsElement.commandListeners 
    has them all already

    syntax:
    events: object
        class (camelCase): object
            eventName: string (uuid)
            ...
        ...
    */
    game: {
        gameStart: helpers.uuid() // this makes the other classes read from the savedata of gamedata
    }
};
exports.events = events;
},{"../src/helpers":9}],3:[function(require,module,exports){
const locale = {
    /*
    Strings for every string that appears in the game/webpage (except the warning lmao)
    structure:
    locales: object
        language: object
            class (camelCase): object
                stringName: string (if it's a Documentation, prefix it with doc
                and suffix with Cmd/Args (array of strings)/Desc)
                ...
            ...
        ...
    */
    gameConsole: {
        docIntroCmd: "intro",
        docIntroArgs: [""],
        docIntroDesc: "Spells out the intro to you, yet again!",
        docHelpCmd: "help",
        docHelpArgs: ["command"],
        docHelpDesc: "Provides help for a particular command",
        docSayCmd: "say",
        docSayArgs: ["message"],
        docSayDesc: "Says something to the console!",
        docUnimplementedCmd: "unimplemented",
        docUnimplementedArgs: [""],
        docUnimplementedDesc: "An unimplemented command - tell Sam that he needs to work harder!",
        exitSubroutineCommand: "exit",
        unrecognisedCommand: "Sorry, that wasn't a recognised command! Try 'help' for a list of them!",
        intro: [
            "Welcome to the Mapocalypse, you lonely creature!",
            "Type 'start new' to begin a new adventure,",
            "or alternatively, 'start save [your savedata]' to",
            "hopefully resume your journey!",
            "If you neeed help, just type 'help' and some underpaid",
            "civil service workers will come to your assistance!",
            "Good luck, buddy."
        ].join("<br>"),
        helpHelpFor: "Help for ",
        helpSyntax: "Syntax: ",
        youCanAskForHelpFor: "You can as for help regarding:<br>",
        sayCommandYou: "[You] "
    },
    gameData: {
        docLoadCmd: "load",
        docLoadArgs: ["savedata"],
        docLoadDesc: "Loads savedata (does not override your current game state) (does not do much of anything to you - the user)",
        docSaveCmd: "save",
        docSaveCmd: [""],
        docSaveDesc: "Saves and outputs the savedata for you to keep",
        saveCommandHereYouGo: "Here's your savedata. Keep it safe in a local text file or something (or maybe write it on paper - you do you, my dude)",
        saveCommandCopyButton: "Copy",
        loadCommandSuccessful: "Loaded save successfully!",
        loadCommandFailed: "Couldn't load savedata!"
    },
    gameMap: {
        
    },
    game: {
        docStartCmd: "start",
        docStartArgs: ["new | save", "save: savedata"],
        docStartDesc: "Either starts a new game, or loads a savefile that you provide.",
        startCommandNoArgs: "Do you want a [new] game or one from a previous [save]?",
        startCommandNewArg: "new",
        startCommandSaveArg: "save"
    }
};
exports.locale = locale;
},{}],4:[function(require,module,exports){
const mapStyle = [
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
];
exports.mapStyle = mapStyle;
},{}],5:[function(require,module,exports){
const locale = require("../res/localisation").locale;
const helpers = require("./helpers");

exports.GameConsole = GameConsole;
exports.Documentation = Documentation;

function GameConsole(game) {
    /*
    Handles commands and general event dispatching

    game = Game instance
    */
    this.commandsElement = document.createElement("div"); // ghost element, oooo
    this.commandsElement.commandListeners = {}; // key: command string, value: documentation
    this.eventsElement = document.createElement("div"); // internal -non console accessible commands essentially
    this.subroutineIds = []; // array of uuid strings, if it's empty, the console is not claimed

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

    this.onEnter(function() {
        if(this.subroutineIds.length === 0) {
            const line = this.readLine();
            if(line === "") {
                return;
            }
            else if(line === locale.gameConsole.exitSubroutineCommand) {
                this.subroutineIds.splice(0, this.subroutineIds.length);
                return;
            }
            const inputs = line.split(" ");
            const command = inputs[0];
            const args = inputs.splice(1, inputs.length-1);
            this.executeCommand(command, args);
        }
    }.bind(this), true);
    this.textAreaDiv.appendChild(this.textAreaInputDiv);

    this.setuDefaultCommands();
}

GameConsole.prototype.writeLine = function(line, doNotSanitize, callback) {
    /*
    line = string (duh)

    doNotSanitize = boolean (explicitly not sanitize... for linebreaks and html elements)

    callback function:
        element = P element that contains the line just written
    */
    let lineP = document.createElement("p");
    lineP.classList.add("console-line");
    lineP.innerHTML = (doNotSanitize ? line : helpers.sanitizeInput(line));
    this.textAreaLogDiv.appendChild(lineP);
    if(typeof callback === "function") {
        setTimeout(function() {
            callback(lineP);
        }, 0);
    }
}

GameConsole.prototype.readLine = function(doNotClear) {
    /*
    doNotClear = boolean

    returns line = string
    */
    const line = helpers.sanitizeInput(this.textAreaInputDiv.value);
    if(!doNotClear) {
        this.textAreaInputDiv.value = "";
    }
    return line;
}

GameConsole.prototype.onEnter = function(callback, dontRemoveEventListener) {
    /*
    When user presses enter, what do you wanna do? (mostly for subroutines)

    callback function:
        -no arguments (but you may want to read line within your callback, i assume)
    
    dontRemoveEventListener = boolean (probably dont configure this externally)
    */
    const callCallback = function(e) {
        e.preventDefault();
        if (e.keyCode === 13 && typeof callback === "function") {
            setTimeout(function () {
                callback();
            }.bind(this), 0);
            if(dontRemoveEventListener) {
               return; 
            }
            else {
                this.textAreaInputDiv.removeEventListener("keyup", callCallbackBound, true);
            }
        }
    }
    const callCallbackBound = callCallback.bind(this);
    this.textAreaInputDiv.addEventListener("keyup", callCallbackBound, true);
    //TODO: broken af
}

GameConsole.prototype.executeCommand = function(command, args) {
    /*
    A command is something the user can execute via the console
    emits an event of the command
    (either some class is going to pick it up, or nothing's gonna happen)

    command = string

    args = array of strings
    */
    const event = new CustomEvent(command, { detail: { args: args}});
    this.commandsElement.dispatchEvent(event);
    if(!(command in this.commandsElement.commandListeners) && this.subroutineIds.length === 0) {
        this.writeLine(locale.gameConsole.unrecognisedCommand);
    }
}

GameConsole.prototype.executeEvent = function(eventName, items) {
    /*
    Pretty much an event emitter like the executeCommand, but not a command
    that can be listed from the console (internal broadcasts)

    event = string

    items object
        anything that you want the picker-uppers to get
    */
    const event = new CustomEvent(eventName, { detail: { items: items || {}}});
    this.eventsElement.dispatchEvent(event);
    console.log(eventName + " has just been emitted as an event");
}

GameConsole.prototype.addCommandListener = function(documentation) {
    /*
    documentation = Documentation instance
    */
    this.commandsElement.commandListeners[documentation.command] = documentation;
    this.commandsElement.addEventListener(documentation.command, function(e) {
        if(typeof documentation.callback === "function") {
            documentation.callback(e.detail.args);
        }
    }.bind(this));
}

GameConsole.prototype.addEventListener = function(eventName, callback) {
    /*
    since it's internal, you dont need any documentation that the user needs
    to see

    callback function:
        items object:
            just items passed by the emitter
    */
    if(typeof callback === "function") {
        this.eventsElement.addEventListener(eventName, callback);
    }
}

GameConsole.prototype.startSubroutine = function(subroutine) {
    /*
    If you want to use the console's input for multiple lines in your subroutine
    Remember to endSubroutine() afterwards!

    subroutine function:
        subroutineId = string (uuid)
    */
    if(typeof subroutine === "function") {
        let uuid = helpers.uuid();
        this.subroutineIds.push(uuid);
        setTimeout(function() {
            subroutine(uuid);
        }.bind(this), 0);
    }
}

GameConsole.prototype.endSubroutine = function(subroutineId) {
    /*
    When your subroutine's done, remember to call this
    */
    this.subroutineIds.splice(this.subroutineIds.indexOf(subroutineId), 1);
}

GameConsole.prototype.setuDefaultCommands = function() {
    const introCommand = new Documentation(
        locale.gameConsole.docIntroCmd,
        locale.gameConsole.docIntroArgs,
        locale.gameConsole.docIntroDesc,
        function(args) {
            this.writeLine(locale.gameConsole.intro, true);
        }.bind(this)
    );
    this.addCommandListener(introCommand);
    this.executeCommand(introCommand.command);

    const helpCommand = new Documentation(
        locale.gameConsole.docHelpCmd,
        locale.gameConsole.docHelpArgs,
        locale.gameConsole.docHelpDesc,
        function(args) {
            if(args[0] in this.commandsElement.commandListeners) {
                let commandDocumentation = this.commandsElement.commandListeners[args[0]];
                let output = locale.gameConsole.helpHelpFor + commandDocumentation.command + "<br>";
                output += "'" + commandDocumentation.description + "'<br>";
                output += locale.gameConsole.helpSyntax + commandDocumentation.command + " " + helpers.sanitizeInput(commandDocumentation.args);
                this.writeLine(output, true);
            }
            else {
                if(args.length === 0) {
                    let output = locale.gameConsole.youCanAskForHelpFor;
                    for(const key of Object.keys(this.commandsElement.commandListeners)) {
                        output += "'" + key + "' ";
                    }
                    this.writeLine(output, true);
                }
                else {
                    this.writeLine(locale.gameConsole.unrecognisedCommand);
                }
            }
        }.bind(this)
    );
    this.addCommandListener(helpCommand);

    const sayCommand = new Documentation(
        locale.gameConsole.docSayCmd,
        locale.gameConsole.docSayArgs,
        locale.gameConsole.docSayDesc,
        function(args) {
            this.writeLine(locale.gameConsole.sayCommandYou + args.join(" "));
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
    self.command = command || locale.gameConsole.docUnimplementedCmd;
    self.args = args || locale.gameConsole.docUnimplementedArgs;
    self.description = description || locale.gameConsole.docUnimplementedDesc;
    self.callback = callback || function() { console.log("Unimplemented documentation of " + self.command); };
}
},{"../res/localisation":3,"./helpers":9}],6:[function(require,module,exports){
const locale = require("../res/localisation").locale;
const helpers = require("./helpers");
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
        checkNumber: 123456789
    };

    this.setupCommands();
}

GameData.prototype.setupCommands = function() {
    const loadCommand = new GameConsole.Documentation(
        locale.gameData.docLoadCmd,
        locale.gameData.docLoadArgs,
        locale.gameData.docLoadDesc,
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
                let outputLine = [
                    locale.gameData.saveCommandHereYouGo,
                    savedata
                ].join("<br>");
                this.game.gameConsole.writeLine(outputLine, true, function(element) {
                    element.innerHTML += "<br>";
                    let copyButton = helpers.createButton(locale.gameData.saveCommandCopyButton, function(button) {
                        helpers.copyToClipboard(savedata);
                    });
                    element.appendChild(copyButton);
                }.bind(this));
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
            
            if("checkNumber" in loadedData && loadedData.checkNumber === this.savedata.checkNumber) {
                this.savedata = Object.assign({}, loadedData);
                this.game.gameConsole.writeLine(locale.gameData.loadCommandSuccessful);
            }
            else {
                throw "Something didn't quite match up when loading the savedata";
            }

        } 
        catch(e) {
            this.game.gameConsole.writeLine(locale.gameData.loadCommandFailed);
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
},{"../res/localisation":3,"./game-console":5,"./helpers":9}],7:[function(require,module,exports){


exports.GameMap = GameMap;

function GameMap(game) {
    /*
    Container and manager of the google maps object

    game = Game instance
    */
    this.mapDiv = document.createElement("div");
    this.mapDiv.id = "map";
    const mapocalypseMapStyle = new google.maps.StyledMapType(
        require("../res/map-style").mapStyle, {name: "Mapocalypse Style"});
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


},{"../res/map-style":4}],8:[function(require,module,exports){
const locale = require("../res/localisation").locale;
const eventsList = require("../res/events-list").events;
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
            else if(args[0] === locale.game.startCommandNewArg) {
                (function startNewGame() {
                    this.gameConsole.startSubroutine();

                    
                })(this);
            }
            else if(args[0] === locale.game.startCommandSaveArg) {
                this.gameData.load(args[1]);
                this.gameConsole.executeEvent(eventsList.game.gameStart); // no items passed - assume that other classes will read off of savedata in gamedata
            }
        }.bind(this)
    );
    this.gameConsole.addCommandListener(startCommand);
}
},{"../res/events-list":2,"../res/localisation":3,"./game-console":5,"./game-data":6,"./game-map":7,"./helpers":9,"./tests":11}],9:[function(require,module,exports){

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

exports.createButton = createButton;
function createButton(text, callback) {
    /*
    Mostly for use within the console (make sure you disable
    sanitization when you writeline())

    text = string

    callback function:
        button element that was clicked

    returns a butt-on lol
    */
    let butt = document.createElement("button");
    butt.innerHTML = text;
    butt.addEventListener("click", function(e) {
        if(typeof callback === "function") {
            callback(butt);
        }
    });
    return butt;
}

exports.uuid = uuid;
function uuid() {
    // v4, from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

exports.copyToClipboard = copyToClipboard;
function copyToClipboard(text) {
    var textArea = document.createElement("textarea");
    // Obtained from https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a flash,
    // so some of these are just precautions. However in IE the element
    // is visible whilst the popup box asking the user for permission for
    // the web page to copy to the clipboard.
    //
  
    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
  
    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';
  
    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;
  
    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
  
    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';
  
  
    textArea.value = text;
  
    document.body.appendChild(textArea);
  
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
  
    document.body.removeChild(textArea);
  }
},{}],10:[function(require,module,exports){
const Game = require("./game");

window.onload = init;
function init() {
	const game = new Game.Game();
	if(require("../res/config").config.debug) {
		window.mapocalypseInstance = game;
	}
}


},{"../res/config":1,"./game":8}],11:[function(require,module,exports){
const GameConsole = require("./game-console");

exports.Tests = Tests;
function Tests(game) {
    /*
    Just for testing purposes
    (not localised: too lazy :( )

    game = Game instance
    */
    if(!require("../res/config").config.debug) {
        return;
    }
    let inp1, inp2;
    game.gameConsole.addCommandListener(new GameConsole.Documentation(
        "test",
        [""],
        "A test command for... testy purposes",
        function (args) {
            console.log(game.gameConsole.readLine(true) + " is what's in the readline");
            game.gameConsole.startSubroutine(function(subroutineId) {
                game.gameConsole.writeLine("Okay, give me the first number you want to add");
                game.gameConsole.onEnter(function() {
                    inp1 = game.gameConsole.readLine();
                    game.gameConsole.writeLine("okay, give me the second number");
                    game.gameConsole.onEnter(function() {
                        inp2 = game.gameConsole.readLine();
                        game.gameConsole.writeLine("lol you gave me " + inp1 + " and " + inp2 + " but i cant add them lmao");
                        game.gameConsole.endSubroutine(subroutineId);
                        console.log(inp1 + " and " + inp2);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }.bind(this)
    ));

    game.gameConsole.addCommandListener(new GameConsole.Documentation(
        "hacker",
        ["characters"],
        "Be a sweet hacker",
        function(args) {
            game.gameConsole.writeLine("", false, function(lineP) {
                for(let i = 0; i < parseInt(args[0]); i++) {
                    setTimeout(function() {
                        lineP.innerHTML += (Math.random() < 0.5 ? "0" : "1");
                        lineP.innerHTML += (Math.random() < 0.5 ? "" : " ");
                        lineP.innerHTML += (Math.random() < 0.0001 ? "segfault" : "");
                    }.bind(this), i+10);
                }
            }.bind(this));
        }.bind(this)
    ));
}
},{"../res/config":1,"./game-console":5}]},{},[10]);
