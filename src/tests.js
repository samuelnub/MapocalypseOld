const GameConsole = require("./game-console");

exports.Tests = Tests;
function Tests(game) {
    /*
    Just for testing purposes
    (not localised: too lazy :( )

    game = Game instance
    */
    if(!require("../res/config").config.debug) {
        return;
    }
    let inp1, inp2;
    game.gameConsole.addCommandListener(new GameConsole.Documentation(
        "test",
        [""],
        "A test command for... testy purposes",
        function (args) {
            console.log(game.gameConsole.readLine(true) + " is what's in the readline");
            game.gameConsole.startSubroutine(function(subroutineId) {
                game.gameConsole.writeLine("Okay, give me the first number you want to add");
                game.gameConsole.onEnter(function() {
                    inp1 = game.gameConsole.readLine();
                    game.gameConsole.writeLine("okay, give me the second number");
                    game.gameConsole.onEnter(function() {
                        inp2 = game.gameConsole.readLine();
                        game.gameConsole.writeLine("lol you gave me " + inp1 + " and " + inp2 + " but i cant add them lmao");
                        game.gameConsole.endSubroutine(subroutineId);
                        console.log(inp1 + " and " + inp2);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }.bind(this)
    ));

    game.gameConsole.addCommandListener(new GameConsole.Documentation(
        "hacker",
        ["characters"],
        "Be a sweet hacker",
        function(args) {
            game.gameConsole.writeLine("", false, function(lineP) {
                for(let i = 0; i < parseInt(args[0]); i++) {
                    setTimeout(function() {
                        lineP.innerHTML += (Math.random() < 0.5 ? "0" : "1");
                        lineP.innerHTML += (Math.random() < 0.5 ? "" : " ");
                        lineP.innerHTML += (Math.random() < 0.0001 ? "segfault" : "");
                    }.bind(this), i+10);
                }
            }.bind(this));
        }.bind(this)
    ));
}