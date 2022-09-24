var htmlspecialchars = function (string) {
  var escapedString = string;
  htmlspecialchars.specialchars = [
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"],
    ['"', "&quot;"],
  ];
  var len = htmlspecialchars.specialchars.length;
  for (var x = 0; x < len; x++) {
    escapedString = escapedString.replace(
      new RegExp(htmlspecialchars.specialchars[x][0], "g"),
      htmlspecialchars.specialchars[x][1]
    );
  }
  return escapedString;
};

var htmlspecialchars_decode = function (string) {
  var unescapedString = string;
  htmlspecialchars_decode.specialchars = [
    ['"', "&quot;"],
    [">", "&gt;"],
    ["<", "&lt;"],
    ["&", "&amp;"],
  ];
  var len = htmlspecialchars_decode.specialchars.length;
  for (var x = 0; x < len; x++) {
    unescapedString = unescapedString.replace(
      new RegExp(htmlspecialchars_decode.specialchars[x][1], "g"),
      htmlspecialchars_decode.specialchars[x][0]
    );
  }
  return unescapedString;
};

module.exports = { htmlspecialchars, htmlspecialchars_decode };
