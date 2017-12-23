const helpers = require("./helpers");
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

    this.markers = {};

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

    this.placesService = new google.maps.places.PlacesService(this.map);

    this.mapContextMenuLineP = null; // remember to set this to null whenever you remove lineP from the console!
    this.onClick(function(e) {
        this.printMapContextMenu(e);
    }.bind(this));

    game.mainDiv.appendChild(this.mapDiv);

    game.gameConsole.addEventListener(GameConsole.events.game.gameStartNew, this.onGameStart.bind(this));
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
        
        const optionsEle = document.createElement("div");
        lineP.appendChild(optionsEle);

        const appendOption = function(params) {
            /*
            params object:
                text = string
                callback = function, arguments:
                    event = contextEvent details (.latLng properties etc) (in case you lose it)
            */
            const optionButt = helpers.createButton(params.text || locale.general.placeholder, function() {
                if(typeof params.callback === "function") {
                    params.callback(contextEvent);
                }
                this.game.gameConsole.removeLine(lineP);
                this.mapContextMenuLineP = null;
            }.bind(this));
            optionsEle.appendChild(optionButt);
            optionsEle.appendChild(document.createElement("br"));
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

GameMap.prototype.createMarker = function(params) {
    /*
    returns a google maps marker object

    params object:
        position = latLng
        id = string (UUID, if you're an entity making a marker, pass your ID.)
        icon = string
        title = string
        onClickCallback = function (callback) arguments:
            event = event object (with .latLng properties etc)
        printMapContextMenuOnClick = boolean
    */
    let marker = new SlidingMarker({
        position: params.position || new google.maps.LatLng(0, 0),
        icon: {
            url: locale.files.iconsPath + (params.icon ? params.icon : locale.files.icons.unknown) + locale.files.iconFiletype
        },
        title: params.title || locale.general.nothing,
        map: this.map
    });
    marker.id = params.id || helpers.uuid();
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
    this.markers[marker.id] = marker;
    return marker;
}

GameMap.prototype.removeMarker = function(marker) {
    /*
    marker: marker you want to remove, duh
    */
    this.markers[marker.id].setMap(null);
    delete this[marker.id];
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

GameMap.prototype.isPosWater = function(position, callback) {
    /*
    obtained from https://stackoverflow.com/questions/35073585/javascript-only-detect-land-or-water-google-maps
    and also https://stackoverflow.com/questions/9644452/verify-if-a-point-is-land-or-water-in-google-maps
    not sure if it's within google's TOCs, but it works really well compared to other hacky wackies

    pos: latLng object

    callback function: args:
        isWater = bool
    */
    let mapUrl = "http://maps.googleapis.com/maps/api/staticmap?center="+position.lat()+","+position.lng()+"&zoom="+this.map.getZoom()+"&size=1x1&maptype=roadmap"
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    let image = new Image();
    image.crossOrigin = "Anonymous"; // dope hack
    image.src = mapUrl;

    image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
        let pixelData = canvas.getContext('2d').getImageData(0, 0, 1, 1).data;
        if( pixelData[0] > 160 && pixelData[0] < 181 && pixelData[1] > 190 && pixelData[1] < 210 ) {
            result = true
        } else {
            result = false;
        }
        if(typeof callback === "function") {
            callback(result);
        }
    }
}