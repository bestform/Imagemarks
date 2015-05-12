var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var data = require("sdk/self").data;
let { search, UNSORTED } = require("sdk/places/bookmarks");

var popup = require("sdk/panel").Panel({
    contentURL: data.url("popup_firefox.html"),
    contentScriptFile: [
        data.url("lib/jquery.min.js"),
        data.url("bridge/bridge_firefox.js"),
        data.url("popup.js")
    ],
    width: 410,
    height: 580,
    onShow: function(){
        popup.port.emit("show");
    }
});

// button

var button = buttons.ActionButton({
    id: "show-imagemarks",
    label: "Show Imagemarks",
    icon:"./icon.png",
    onClick: handleClick

});

// button handler

function handleClick() {
    popup.show({
        position: button
    });
}

popup.port.on("search", function(){
    search([
        { query: ".gif" },
        { query: ".jpg" },
        { query: ".jpeg" },
        { query: ".png" }
    ], {"sort": "dateAdded"})
        .on("end", function(results){
            popup.port.emit("search_done", results);
        });
});

popup.port.on("open_url", function(url){
   tabs.open(url);
});