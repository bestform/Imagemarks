// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Search the bookmarks when entering the search keyword.
$(function() {
  $('#search').change(function() {
     $('#bookmarks').empty();
     dumpBookmarks($('#search').val());
  });
});
// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      dumpTreeNodes(bookmarkTreeNodes, query, $('#bookmarks'));
    });
}
function dumpTreeNodes(bookmarkNodes, query, wrapper) {

  var i;
  for (i = bookmarkNodes.length-1; i >= 0; i--) {
    dumpNode(bookmarkNodes[i], query, wrapper);
  }

}
function isImage(bookmarkNode) {
    console.log("testing "+ bookmarkNode.title);
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
function dumpNode(bookmarkNode, query, wrapper) {
  if (bookmarkNode.title) {
    if (query && !bookmarkNode.children) {
      if (String(bookmarkNode.title).toLowerCase().indexOf(query.toLowerCase()) == -1) {
        return $('');
      }
    }

    if(isImage(bookmarkNode)){
      var span = $('<div>')
      var titlediv = $('<div class="titlediv">');
      var editdiv = $('<div class="editdiv">');
      var clear = $('<div class="cleardiv">');
      var title = $('<span>');
      title.text(bookmarkNode.title);
      titlediv.append(title);

      var editlink = $('<input type="button" value="Edit">');
      var editspan = $('<span>');
      var editinput = $('<input>');
      var ok = $('<input type="button" value="OK">');
      var cancel = $('<input type="button" value="Cancel">');
      editspan.append(editinput);
      editspan.append(ok);
      editspan.append(cancel);


      span.hover(function() {
        editdiv.append(editlink);
        editlink.click(function() {
          editinput.val(title.text());
          editlink.css('visibility', 'hidden');
          title.hide();
          editdiv.empty();
          editdiv.append(editspan);

          ok.click(function(){
            chrome.bookmarks.update(String(bookmarkNode.id), {
              title: editinput.val()
            });
            title.text(editinput.val());

            editspan.remove();
            editlink.css('visibility', 'visible');
            title.show();
          });

          cancel.click(function(){
            editspan.remove();
            title.show();
            editlink.css('visibility', 'visible');
          });

        });
            editlink.fadeIn();
      },
      // unhover
      function() {
        editlink.remove();
      });

      var anchor = $('<a>');
      anchor.attr('href', bookmarkNode.url);

      var imageNode = $('<img />');
      imageNode.attr("src", bookmarkNode.url);

      anchor.append(imageNode);
      anchor.click(function() {
          chrome.tabs.create({url: bookmarkNode.url});
      });


      span.append(titlediv);
      span.append(editdiv);
      span.append(clear);
      span.append(anchor);
      span.attr("class", "image");
      wrapper.append(span);
    }

  }


  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    dumpTreeNodes(bookmarkNode.children, query, wrapper);
  }

}

document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarks();
});
