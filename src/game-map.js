const GameConsole = require("./game-console");

exports.GameMap = GameMap;

function GameMap(game) {
    /*
    Container of the google maps object, and also map-stuff like 

    game = Game instance
    */
    this.game = game;

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
}

GameMap.prototype.addMarker = function(latLng, icon) {
    let marker = new google.maps.Marker({
        
    });
}