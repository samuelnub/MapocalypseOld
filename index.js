(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./helpers.js":2}],2:[function(require,module,exports){

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
},{}],3:[function(require,module,exports){
const GameConsole = require("./game-console.js");

const g = {
    mainDiv: document.getElementById("main"),
    mapDiv: document.createElement("div"),
    map: null,
    gameConsole: null
};

window.onload = init;
function init() {
	(function initMap() {
		g.mainDiv.appendChild(g.mapDiv);
		g.mapDiv.id = "map";
		g.map = new google.maps.Map(g.mapDiv, {
			center: new google.maps.LatLng(49.5516746, -33.5842906),
			zoom: 10
		});
	})();

	g.gameConsole = new GameConsole.GameConsole(g);
}


},{"./game-console.js":1}]},{},[3]);
