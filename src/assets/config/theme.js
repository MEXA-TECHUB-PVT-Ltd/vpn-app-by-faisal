import { appImages } from "../utilities";

const theme = {
    light:{
        theme:"light",
        color:"black",
        background:"white",
        backgroundyellow:"#FFFACA",
        crosscontext: appImages.cross,
        settingscontext: appImages.settings,
        playcontext: appImages.play,
        searchcontext: appImages.search,
        categorybox: "#fffaca",
        pinkbox:"#fc6681",
        purplebox:"#b48dff",
        whitebox:"rgba(255, 255, 255, 1)",
        txtblack: "#cbcbcb",
        yellowbox:"#ffe700",
        purplecircle: "rgba(238, 229, 255, 1)"

    },
    dark:{
    theme:"dark",
    color:"white",
    background:"#141414",
    backgroundyellow:"#141414",
    crosscontext: appImages.crossblack,
    settingscontext: appImages.settingsblack,
    playcontext: appImages.playblack,
    searchcontext: appImages.searchblack,
    categorybox: "rgba(255, 250, 202, 0.5)",
    pinkbox:"rgba(252, 102, 129, 0.5)",
   purplebox:"rgba(180, 141, 255, 0.5)",
   whitebox:"rgba(255, 255, 255, 0.75)",
   txtblack: "#000",
   yellowbox:"rgba(255, 231, 0, 0.5)",
   purplecircle: "rgba(238, 229, 255, 0.5)"
    }
};

export default theme;