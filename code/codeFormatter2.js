/**
 * Code Formatter - Version 0.2
 * Soni D.
 */

var Formatter = (function () {
  var g = {
    name    : "pre.codeBlock", /* HTMLElement <pre> and class [codeBlock] */
    blocks  : [], /* List of <pre> blocks */
    cssCodeFont   : "font-family:Monospace; font-size:14px;",
    cssCodeFrame  : "border-radius:6px; box-shadow:0 0 2px 2px rgba(10,10,10,.68); background-color:#2E3436; color:#fff;",
    cssCodeNumTAB : "float:left; border-spacing:0; border-collapse:collapse; margin:0 8px 0 0; color:#000; text-shadow:1px 1px rgba(100,100,100,.9);",
    cssCodeNumTD  : "padding:0 7px 0 4px; text-align:right; background-color:gray;",
    // RegExp for code comments. Support: /*..*/ and //
    // Escape star sign (*) with double-backslash, i.e. * is like \\*
    reComments    : "//[ ]*.*[ ]*[\r\n]"   // Comments in the kind of //...
                  + "|/\\*[ ]*.*[ ]*\\*/" // Comments in the kind of /* .. */
                  + "|/\\*([ ]*.*[ ]*[\r\n])+[ ]*\\*/", // Many lines comments /** .. */
  };
  return {
    init : function () {
      g.blocks = document.querySelectorAll(g.name) ? document.querySelectorAll(g.name) : [];
      if ( g.blocks.length !== 0 ) {
        /* Add new function to String prototype to escape special signs */
        String.prototype.escapeHTML = function () { 
          return (
            this.replace(/<\/.*>(?![^ ])/g, "") // Negated Lookahead x(?:y): 
                                                //    Match any pattern </.*> (e.g. </stdio.h>) only if it is NOT followed 
                                                //    by [^ ] (i.e. a character that is NOT a whitespace).
                                                //    In other words, match any pattern </.*> that is followed by a whitespace.
                .replace(/>/g, "&gt;")   // '>' is replaced by &gt;
                .replace(/</g, "&lt;")   // '<' is replaced by &lt;
          ); // https://developer.mozilla.org/de/docs/Web/JavaScript/Guide/Regular_Expressions
        };
        this.format();
      }
    }, // init
    format : function () {
      var nn = g.blocks.length, ll = 0 /* Number of lines within a code block */, 
          re = null /* RegExp object */, strCode = tmp = null,
          TAB = TR = TD = null,
          parentNode = g.blocks[0].parentNode;
      /* Iterates the code blocks */
      for ( var i = 0; i < nn; ++i ) {
        strCode = g.blocks[i].innerHTML.escapeHTML().trim(); // Get content in code block.
        if ( strCode.length == 0 ) continue;
        re = /\r?\n|\r/g; // Literal Notation 
                          //   => Faster than RegExp-constructor: new RegExp(..)
                          //   => Line-feed / Carriage-return: \r\n (Win/DOS), \r (older Macs), \n (Linux/Unix)
        ll = strCode.split(re).length; // Number of lines within a code block.
        if ( ll < 1 )  continue;
        TAB = document.createElement("table");
        /* Iterates the lines within code block */
        for ( var j = 1; j <= ll; ++j ) {
          TR = document.createElement("tr");
          TD = document.createElement("td");
          tmp = g.cssCodeNumTD;
          if ( j === 1 )  tmp += "border-top-left-radius:6px;";
          if ( j === ll ) tmp += "border-bottom-left-radius:6px;";
          TD.appendChild(document.createTextNode(j));
          TD.setAttribute("style", tmp);
          TR.appendChild(TD);
          TAB.appendChild(TR);
        } // END-for
        parentNode.insertBefore(TAB, g.blocks[i]);
        TAB.setAttribute("style", g.cssCodeNumTAB + g.cssCodeFont);
        g.blocks[i].setAttribute("style", g.cssCodeFrame + g.cssCodeFont);
        /* https://developer.mozilla.org/de/docs/Web/JavaScript/Guide/Regular_Expressions */
        /* https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp */
        /* https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/replace */
        // RegExp for code comments. Support: /*..*/ and //
        re = new RegExp(g.reComments, "gi"); // RegExp object => slower than Literal notation
        strCode = strCode.replace(re, function (match, p, offset, string) {
          return "<span style='color:#40ff00;'>" + match + "</span>";
        });
        g.blocks[i].innerHTML = strCode;
      } // END-for
    }, // format
  };
})();
// document.addEventListener("DOMContentLoaded", () => Formatter.init(), false);
document.addEventListener("DOMContentLoaded", function () { Formatter.init(); }, false);
