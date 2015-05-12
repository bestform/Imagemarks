var firefox_search_callback = null;

var bridge = {

    openTab: function(url){
        self.port.emit("open_url", url);
    },

    traverseBookmarksTree: function(callback){
        firefox_search_callback = callback;
        self.port.emit("search");
    }
};

var initialized = false;

self.port.on("show", function() {
    if(false === initialized){
        $("#nextpage").click(function(){
            dumpBookmarks(1);
        });
        $("#previouspage").click(function(){
            dumpBookmarks(-1);
        });
        initialized = true;
    }
    dumpBookmarks(0);

});

self.port.on("search_done", function(data){
    firefox_search_callback(data);
});
