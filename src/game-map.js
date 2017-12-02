const helpers = require("./helpers")
const locale = require("../res/localisation").locale;
const GameConsole = require("./game-console");
const SlidingMarker = require("marker-animate-unobtrusive");

exports.GameMap = GameMap;

function GameMap(game) {
    /*
    Container of the google maps object, and also map-stuff like 

    game = Game instance
    */
    this.game = game;

    this.markers = {}; // key: entityId, value: marker object

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

    this.mapContextMenuLineP = null; // remember to set this to null whenever you remove lineP from the console!
    this.onClick(function(e) {
        this.printMapContextMenu(e);
    }.bind(this));

    game.mainDiv.appendChild(this.mapDiv);

    game.gameConsole.addEventListener(GameConsole.events.game.gameStart, this.onGameStart.bind(this));
}

GameMap.prototype.onGameStart = function() {
    console.log("Game starting! the map has heard that");
}

GameMap.prototype.printMapContextMenu = function(contextEvent, entity) {
    /*
    will emit a GameConsole.events.gameMap.printMapContextMenu event, with items (check
    implementation to see, search "items")

    contextEvent = click event instance (with .lagLng)
    entity = entity instance reference (optional)
    */
    if(this.mapContextMenuLineP) {
        this.game.gameConsole.removeLine(this.mapContextMenuLineP);
        this.mapContextMenuLineP = null;
    }
    this.game.gameConsole.writeLine(locale.general.placeholder, false, function(lineP) {
        lineP.innerHTML = "";
        this.mapContextMenuLineP = lineP;
        // general info and a close button
        const closeButtonDiv = document.createElement("div");
        closeButtonDiv.align = "right";
        closeButtonDiv.appendChild(helpers.createButton(locale.general.close, function() {
            this.game.gameConsole.removeLine(lineP);
            this.mapContextMenuLineP = null;
        }.bind(this)));
        lineP.appendChild(closeButtonDiv);

        const infoDiv = document.createElement("div");
        infoDiv.innerHTML = locale.gameMap.contextMenuInfoPretext + contextEvent.latLng.lat() + " " + contextEvent.latLng.lng() + " ";
        lineP.appendChild(infoDiv);
        
        const appendOption = function(params) {
            /*
            params object:
                text = string
                callback = function, arguments:
                    event = click event details (.latLng properties etc)
            */
            const optionButt = helpers.createButton(params.text || locale.general.placeholder, function() {
                if(typeof params.callback === "function") {
                    params.callback(e);
                }
                this.game.gameConsole.removeLine(lineP);
                this.mapContextMenuLineP = null;
            }.bind(this));
            const listEle = document.createElement("li");
            listEle.appendChild(optionButt);
            // TODO: sort and insert list element
        }.bind(this);
    
        const items = { // to be passed with the event emission
            contextEvent: contextEvent,
            appendOption: appendOption,
            placeId: contextEvent.placeId || null,
            entity: entity || null
        };

        this.game.gameConsole.executeEvent(GameConsole.events.gameMap.printMapContextMenu, items);
    }.bind(this));
}

GameMap.prototype.addMarkerComponent = function(params) {
    /*
    returns a google maps marker object

    params object:
        entityId = string (uuid of the entity that owns this component)
        position = LatLng object
        icon = string (just the ../res/icon's name, without the file extension)
        onClickCallback = function (callback) arguments:
            event = event object (with .latLng properties etc)
        printMapContextMenuOnClick = boolean
    */
    let marker = new SlidingMarker({
        position: params.position || new google.maps.LatLng(0, 0),
        icon: {
            url: locale.files.iconsPath + (params.icon ? params.icon : locale.files.icons.unknown) + locale.files.iconFiletype
        },
        title: params.title || locale.general.placeholder
        map: this.map
    });
    if(typeof params.onClickCallback === "function" || params.printMapContextMenuOnClick) {
        marker.addListener("click", function(e) {
            if(typeof params.onClickCallback === "function") {
                params.onClickCallback(e);
            }
            if(params.printMapContextMenuOnClick) {
                this.printMapContextMenu(e);
            }
        }.bind(this));
    }
    this.markers[params.entityId] = marker;
    return marker;
}

GameMap.prototype.onClick = function(callback) {
    /*
    returns google eventListener for you to keep track of, if you want to remove it
    you probably won't use this externally, as you'll just listen to the printMapContextMenu event

    callback function:
        event = event object (has .latLng properties)
    */
    let eventListener;
    const callCallback = function(e) {
        if(typeof callback === "function") {
            callback(e);
        }
    };
    const callCallbackBound = callCallback.bind(this);
    eventListener = google.maps.event.addListener(this.map, "click", callCallbackBound);
    return eventListener;
}

GameMap.prototype.removeOnClick = function(eventListener) {
    /*
    eventListener = google.maps.event EventListener
    */
    google.maps.event.removeListener(eventListener);
}