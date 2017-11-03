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

