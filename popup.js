var page = -1;
var pagesize = 11;
var globalcounter = 0;
var IMAGE_WIDTH = 110;

// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(step) {
    page = Math.max(0, page+step);
    globalcounter = 0;
    var images = $('img');
    $.each(images, function() {
        $(this).attr('src', '');
    });
    document.getElementById("bookmarks").innerHTML = '';
    var bookmarkTreeNodes = chrome.bookmarks.getTree(
        function(bookmarkTreeNodes) {
            dumpTreeNodes(bookmarkTreeNodes, $('#bookmarks'));
        });
}

function dumpTreeNodes(bookmarkNodes, wrapper, counter) {
    var i;
    var completesize = bookmarkNodes.length-1;
    for (i = completesize; i >= 0; i--) {
        dumpNode(bookmarkNodes[i], wrapper);
    }
}

function isImage(bookmarkNode) {
    if(!bookmarkNode.url){
        return false;
    }
    var imageEndings = [".jpg", ".jpeg", ".png", ".gif"];
    for(var i = 0; i < imageEndings.length; i++){

        if(bookmarkNode.url.indexOf(imageEndings[i]) == bookmarkNode.url.length - imageEndings[i].length){
            return true;
        }
    }
    return false;
}
function dumpNode(bookmarkNode, wrapper) {

    if(globalcounter > (pagesize+1) * page + pagesize){
        return;
    }
    if(!bookmarkNode.title){
      bookmarkNode.title = "no title";
    }


    if(isImage(bookmarkNode)){
        if(globalcounter < (pagesize+1) * page){
            globalcounter++;
            return;
        }
        var span = $('<div>');

        var previewDiv = $("#preview");
        var anchor = $('<a>');
        anchor.attr('href', bookmarkNode.url);

        var imageNode = $('<img />');
        var imageId = guid();

        imageNode.attr("src", bookmarkNode.url);
        imageNode.attr("id", imageId);
        imageNode.css("max-width", IMAGE_WIDTH);
        imageNode.css("max-height", IMAGE_WIDTH);
        imageNode.css("display", "none");

        anchor.append(imageNode);
        anchor.click(function() {
          chrome.tabs.create({url: bookmarkNode.url});
        });

        var canvas = $("<canvas />");
        canvas.attr("width", IMAGE_WIDTH);
        canvas.attr("height", IMAGE_WIDTH);
        var canvasId = guid();
        canvas.attr("id", canvasId);

        anchor.append(canvas);

        imageNode.on("load", function(){
            var canvas = document.getElementById(canvasId);
            var image = document.getElementById(imageId);

            var width = image.naturalWidth;
            var height = image.naturalHeight;

            var factor = 1;
            if(width < height){
                factor = IMAGE_WIDTH/width;
            } else {
                factor = IMAGE_WIDTH/height;
            }
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, width*factor, height*factor);
        });


        span.mouseover(function(){
            $("#"+canvasId).css("display", "none");
            $("#"+imageId).css("display", "inline-block");
        });
        span.mouseout(function(){
            $("#"+imageId).css("display", "none");
            $("#"+canvasId).css("display", "inline-block");
        });


        span.append(anchor);
        span.attr("class", "image");
        span.css("display", "inline-block");
        span.css("width", IMAGE_WIDTH);
        span.css("height", IMAGE_WIDTH);
        wrapper.append(span);


        globalcounter++;
    }

    if (bookmarkNode.children && bookmarkNode.children.length > 0) {
        dumpTreeNodes(bookmarkNode.children, wrapper);
    }

}

function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

document.addEventListener('DOMContentLoaded', function () {
    $("#nextpage").click(function(){
        dumpBookmarks(1);
    });
    $("#previouspage").click(function(){
        dumpBookmarks(-1);
    });
    dumpBookmarks(1);
});
