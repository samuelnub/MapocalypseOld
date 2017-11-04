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