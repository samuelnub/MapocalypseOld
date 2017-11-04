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
                let outputLine = [
                    "Here's your savedata. Keep it a local text file or something:",
                    savedata
                ].join("<br>");
                this.game.gameConsole.writeLine(outputLine, true, function(element) {
                    element.innerHTML += "<br>";
                    let copyButton = helpers.createButton("Copy", function(button) {
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
            
            //compare the keys of the loaded one and the default one
            let ogKeys = Object.keys(this.savedata).sort();
            let loadedKeys = Object.keys(loadedData).sort();
            if(JSON.stringify(ogKeys) === JSON.stringify(loadedKeys)) {
                this.savedata = Object.assign({}, loadedData);
                this.game.gameConsole.writeLine("Just loaded your save successfully!");
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