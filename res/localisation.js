const locale = {
    /*
    Strings for every string that appears in the game/webpage (except the warning lmao)
    structure:
    locales: object
        language: object
            class (camelCase): object
                stringName: string (if it's a Documentation, prefix it with doc
                and suffix with Cmd/Args (array of strings)/Desc)
                ...
            ...
        ...
    */
    entities: { // for printing to screen, remember!
        names: {
            player: "Player",
            enemy: "Enemy",
            goal: "Goal",
            point: "Selected point"
        },
        player: {
            moveToButton: "Travel here"
        },
        goal: {

        }
    },
    gameConsole: {
        docIntroCmd: "intro",
        docIntroArgs: [""],
        docIntroDesc: "Spells out the intro to you, yet again!",
        docHelpCmd: "help",
        docHelpArgs: ["command"],
        docHelpDesc: "Provides help for a particular command",
        docSayCmd: "say",
        docSayArgs: ["message"],
        docSayDesc: "Says something to the console!",
        docUnimplementedCmd: "unimplemented",
        docUnimplementedArgs: [""],
        docUnimplementedDesc: "An unimplemented command - tell Sam that he needs to work harder!",
        exitSubroutineCommand: "exit",
        get unrecognisedCommand() {
            return "Sorry, that wasn't a recognised command! Try '" + locale.gameConsole.docHelpCmd + "' for a list of them!";
        },
        get intro() {
            return [
                "Welcome to the Mapocalypse, you lonely creature!",
                "Type '" + locale.game.docStartCmd + "' to begin a new journey (or resume one)",
                "If you neeed help, just type '" + locale.gameConsole.docHelpCmd + "',",
                "and some underpaid civil service workers will come to your assistance!",
                "Good luck, buddy."
            ].join("<br>");
        },
        helpHelpFor: "Help for ",
        helpSyntax: "Syntax: ",
        youCanAskForHelpFor: "You can ask for help regarding:<br>",
        sayCommandYou: "[You] "
    },
    gameData: {
        docLoadCmd: "load",
        docLoadArgs: ["savedata"],
        docLoadDesc: "Loads savedata (does not override your current game state) (does not do much of anything to you - the user)",
        docSaveCmd: "save",
        docSaveCmd: [""],
        docSaveDesc: "Saves and outputs the savedata for you to keep",
        saveCommandHereYouGo: "Here's your savedata. Keep it safe in a local text file or something (or maybe write it on paper - you do you, my dude)",
        saveCommandCopyButton: "Copy",
        loadCommandSuccessful: "Loaded save successfully!",
        loadCommandFailed: "Couldn't load savedata!"
    },
    gameMap: {
        contextMenuInfoPretext: "Menu for selection at "
    },
    game: {
        docStartCmd: "start",
        docStartArgs: ["new | load", "load: savedata"],
        docStartDesc: "Either starts a new game, or loads a savefile that you provide.",
        get startCommandNoArgs() {
            return "Do you want to " + locale.game.docStartCmd + " [" + locale.game.startCommandNewArg + "] or one from a previous [" + locale.game.startCommandLoadArg + "]?";
        },
        startCommandNewArg: "new",
        startCommandLoadArg: "load",
        startCommandNewSpawn: "Click the position you want to spawn at.",
        startCommandNewGoal: "Now click the position you're going to aim for. (Preferably a reasonable distance away from your spawn position - but hey, who am I to judge?)",
        get startCommandNewSpawnButton() {
            return locale.general.select + " this as the spawn position";
        },
        get startCommandNewGoalButton() {
            return locale.general.select + " this as the goal position";
        }
    },
    general: {
        programName: "Mapocalypse",
        console: "Console",
        copy: "Copy",
        close: "Close",
        placeholder: "Unimplemented",
        nothing: "",
        select: "Select",
        noThatsWater: "Nope, that's water!",
        noThatsTooFar: "Nope, that's too far!"
    },
    files: { // mostly in the /res folder
        iconsPath: "./res/icons/",
        iconFiletype: ".svg",
        icons: { // svg files
            player: "player",
            enemy: "enemy",
            unknown: "unknown",
            point: "point",
            goal: "goal"
        }
    }
};
exports.locale = locale;