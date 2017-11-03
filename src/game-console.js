const helpers = require("./helpers.js");

exports.GameConsole = GameConsole;

function GameConsole(g) {
    /*
    Handles commands and stuff

    g object:
        globals
    */
    this.eventsElement = document.createElement("div"); // ghost element, oooo

	const consoleDiv = document.createElement("div");
	consoleDiv.id = "console";
	const consoleHeaderDiv = document.createElement("div");
	consoleHeaderDiv.id = "console-header";
	consoleHeaderDiv.innerHTML = "Console";
	consoleDiv.appendChild(consoleHeaderDiv);
	g.mainDiv.appendChild(consoleDiv);
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

    // TODO: just make it a separate .setupDefaultCommands() func
    this.addCommandListener("say", function(args) {
        this.writeLine(args.join(" "));
    }.bind(this));
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
    const event = new CustomEvent(command, { detail: { args: args}});
    this.eventsElement.dispatchEvent(event);
    this.textAreaInputDiv.value = "";
}

GameConsole.prototype.addCommandListener = function(command, callback) {
    /*
    command = string

    callback function:
        args = array of strings
    */
    this.eventsElement.addEventListener(command, function(e) {
        if(typeof callback === "function") {
            callback(e.detail.args);
        }
    }.bind(this));
}