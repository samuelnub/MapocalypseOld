const helpers = require("../src/helpers");

const events = {
    /*
    Houses eventnames that can/will be executed along the way by some function
    Commands doesnt need one of 
    these lists cause the commandsElement.commandListeners 
    has them all already

    syntax:
    events: object
        class (camelCase): object
            eventName: string (uuid)
            ...
        ...
    */
    game: {
        gameStart: helpers.uuid() // this makes the other classes read from the savedata of gamedata
    }
};
exports.events = events;