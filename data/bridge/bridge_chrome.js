var bridge = {

    openTab: function(url){
        chrome.tabs.create({url: url});
    },

    traverseBookmarksTree: function(callback){
        chrome.bookmarks.getTree(callback);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    $("#nextpage").click(function(){
        dumpBookmarks(1);
    });
    $("#previouspage").click(function(){
        dumpBookmarks(-1);
    });
    dumpBookmarks(1);
});

