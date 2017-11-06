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
    emits an event of the command
    (either some class is going to pick it up, or nothing's gonna happen)

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
            ].join("<br>");
            this.writeLine(output, true);
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
                let output = "Help regarding the " + commandDocumentation.command + " command:<br>";
                output += "'" + commandDocumentation.description + "'<br>";
                output += "Syntax: " + commandDocumentation.command + " " + helpers.sanitizeInput(commandDocumentation.args);
                this.writeLine(output, true);
            }
            else {
                if(args.length === 0) {
                    let output = "You can ask for help regarding:<br>";
                    for(const key of Object.keys(this.eventsElement.commandListeners)) {
                        output += "'" + key + "' ";
                    }
                    this.writeLine(output, true);
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
    self.command = command || "unimplemented";
    self.args = args || [""];
    self.description = description || "Generic description (ask Sam to fill this up, damnit)";
    self.callback = callback || function() { console.log("Unimplemented documentation of " + self.command); };
}