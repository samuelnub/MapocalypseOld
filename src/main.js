const Game = require("./game");

window.onload = init;
function init() {
	const game = new Game.Game();
	if(require("../res/config").config.debug) {
		window.mapocalypseInstance = game;
	}
}

