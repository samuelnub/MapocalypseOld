const GameConsole = require("./game-console");

exports.GameMap = GameMap;

function GameMap(game) {
    /*
    Container of the google maps object, and also map-stuff like 

    game = Game instance
    */
    this.game = game;

    this.markers = [];

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

    game.gameConsole.addEventListener(GameConsole.events.game.gameStart, this.onGameStart.bind(this));
}

GameMap.prototype.onGameStart = function() {
    console.log("Game starting! the map has heard that");
    // test this.addMarker({lat: 0, lng: 0}, "enemy");
}

GameMap.prototype.addMarker = function(latLng, icon) {
    /*
    returns a google maps marker object

    latLng = LatLng object
    icon = string (just the ../res/icon's name, without the file extension)
    */
    let marker = new google.maps.Marker({
        position: latLng,
        icon: {
            url: "./res/icons/" + (icon ? icon : "player-unhappy") + ".svg"
        },
        map: this.map
    });
    this.markers.push(marker);
    return marker;
}

GameMap.prototype.onClick = function(callback) {
    /*
    
    callback function:
        event = event object (has .latLng properties)
    */
    let eventListener;
    const callCallback = function(e) {
        if(typeof callback === "function") {
            console.log("clickity click!");
            callback(e);
        }
        //google.maps.event.removeListener(eventListener);
    };
    const callCallbackBound = callCallback.bind(this);
    eventListener = google.maps.event.addListener(this.map, "click", callCallbackBound);
}