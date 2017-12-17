const locale = require("../res/localisation").locale;
const helpers = require("./helpers");

exports.GameConsole = GameConsole;
exports.Documentation = Documentation;
exports.events = {
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
        gameStartNew: helpers.uuid(), 
        gameStartLoad: helpers.uuid() // this makes the other classes read from the savedata of gamedata
    },
    gameMap: {
        printMapContextMenu: helpers.uuid()
    }
};

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
	consoleHeaderDiv.innerHTML = locale.general.console;
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
            } // TODO: implement properly
            const inputs = line.split(" ");
            const command = inputs[0];
            const args = inputs.splice(1, inputs.length-1);
            this.executeCommand(command, args);
        }
    }.bind(this), true);
    this.textAreaDiv.appendChild(this.textAreaInputDiv);

    this.setupDefaultCommands();
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

GameConsole.prototype.removeLine = function(lineP) {
    /*
    removes the specified line paragraph element from the log div
    */
    this.textAreaLogDiv.removeChild(lineP);
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

GameConsole.prototype.onEnter = function(callback, notOnce) {
    /*
    When user presses enter, what do you wanna do? (mostly for subroutines)

    callback function:
        -no arguments (but you may want to read line within your callback, i assume)
    
    notOnce = boolean (probably dont configure this externally)
    */
    const callCallback = function(e) {
        e.preventDefault();
        if (e.keyCode === 13 && typeof callback === "function") {
            setTimeout(function () {
                callback();
            }.bind(this), 0);
            if(notOnce) {
               return; 
            }
            else {
                this.textAreaInputDiv.removeEventListener("keyup", callCallbackBound, true);
            }
        }
    }
    const callCallbackBound = callCallback.bind(this);
    this.textAreaInputDiv.addEventListener("keyup", callCallbackBound, true);
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

GameConsole.prototype.addEventListener = function(eventName, callback, once) {
    /*
    since it's internal, you dont need any documentation that the user needs
    to see

    callback function:
        items object:
            just items passed by the emitter
    once: bool (removes once it's been done)
    */
    const callCallback = function(e) {
        if(typeof callback === "function") {
            callback(e.detail.items);
        }
        if(once) {
            this.eventsElement.removeEventListener(eventName, callCallbackBound);
        }
    };
    const callCallbackBound = callCallback.bind(this);
    this.eventsElement.addEventListener(eventName, callCallbackBound);
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

GameConsole.prototype.setupDefaultCommands = function() {
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