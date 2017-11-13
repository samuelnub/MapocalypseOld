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
        unrecognisedCommand: "Sorry, that wasn't a recognised command! Try 'help' for a list of them!",
        intro: [
            "Welcome to the Mapocalypse, you lonely creature!",
            "Type 'start new' to begin a new adventure,",
            "or alternatively, 'start save [your savedata]' to",
            "hopefully resume your journey!",
            "If you neeed help, just type 'help' and some underpaid",
            "civil service workers will come to your assistance!",
            "Good luck, buddy."
        ].join("<br>"),
        helpHelpFor: "Help for ",
        helpSyntax: "Syntax: ",
        youCanAskForHelpFor: "You can as for help regarding:<br>",
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
        
    },
    game: {
        docStartCmd: "start",
        docStartArgs: ["new | save", "save: savedata"],
        docStartDesc: "Either starts a new game, or loads a savefile that you provide.",
        startCommandNoArgs: "Do you want a [new] game or one from a previous [save]?",
        startCommandNewArg: "new",
        startCommandSaveArg: "save"
    }
};
exports.locale = locale;