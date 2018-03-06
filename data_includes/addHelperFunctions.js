// Custom Ibex type predicate matching critical items and
// non-check items over 18 (4+5 true and false depending on group)
//
// Requires items to be labeled with the following format
//    ItemXXCOND
// e.g.
//    Item12Critical
function isCriticalOrControlOver18(){
  return function(s) {
    if (typeof(s) != "string") 
      return false;
    else {
      var m = s.match(/Item(\d+)(\w+)$/);
      if (!m) return false;
      if (m[2].match(/Check/)) return false;
      if (m[2].match(/Critical/) || Number(m[1])>18) return true;
      return false;
    }
  };
}
function isCheckOrControlAtMost18(){
  return function(s) {
    if (typeof(s) != "string") 
      return false;
    else {
      var m = s.match(/Item(\d+)(\w+)$/);
      if (!m) return false;
      if (m[2].match(/Check/)) return true;
      if (m[2].match(/True|False/) && Number(m[1])<=18) return true;
      return false;
    }
  };
}

// Converts a string of the format "AABB"
// into an array of the format [0,0,1,1]
String.prototype.toNumberArray = function(){
  var ret = this.split("");
  for (el in ret)
    ret[el] = ret[el].charCodeAt(0)-65;
  return ret;
}

var planetNames = ["Home","Transit","Destination"];

// getTenAliens(["alien_blue.png","alien_red.png"], [0,0,0,0], [0.6, 0.4], {x: 150, y: 0, w: 200, h:200}, "XR")
var getTenAliens = function(colors, fourAliensColors, proportions, frame, planetName){
  // Size Settings
  var alienW = 35, alienH = 50;
  var shipW = 159, shipH = 242, shipOffsetX = 37, shipOffsetY = 15;
  var xOffset = 2, yOffset = 2;
  // Creation of the aliens array
  var aliens = [];
  for (alien in fourAliensColors) aliens.push(colors[fourAliensColors[alien]]);
  var remainingAliens = [];
  for (i = 4; i < 10; i++) {
    for (p in proportions){
      if (proportions[p] > aliens.concat(remainingAliens).filter(function(x){return x==colors[p]}).length/10) break;
    }
    remainingAliens.push(colors[p]);
  }
  fisherYates(remainingAliens);
  aliens = aliens.concat(remainingAliens);
  console.log("TEST");
  // Creation of the positions
  var pos = [[(frame.w-alienW)/2, frame.h/2-2*alienH-1.5*yOffset], // Centered top
             [(frame.w-alienW)/2, frame.h/2-alienH-0.5*yOffset], // Centered middle-top
             [(frame.w-alienW)/2, frame.h/2+0.5*yOffset], // Centered middle-bottom
             [(frame.w-alienW)/2, frame.h/2+alienH+1.5*yOffset], // Centered bottom
             [(frame.w-alienW)/2-alienW-1.5*xOffset, frame.h/2-alienH-0.5*yOffset], // Left middle-top
             [(frame.w-alienW)/2-alienW-6*xOffset, frame.h/2+0.5*yOffset], // Left middle-bottom
             [(frame.w-alienW)/2-2*(alienW+xOffset), frame.h/2-0.5*alienH], // Left centered
             [(frame.w-alienW)/2+alienW+1.5*xOffset, frame.h/2-alienH-0.5*yOffset], // Right middle-top
             [(frame.w-alienW)/2+alienW+6*xOffset, frame.h/2+0.5*yOffset], // Right middle-bottom
             [(frame.w-alienW)/2+2*(alienW+xOffset), frame.h/2-0.5*alienH]]; // Right centered
  // Going through pos to create the return value
  var shipImgName = "3ships.png";
  if (colors.length==1) shipImgName = "3shipsBW.png";
  var ret = [{id: "ships", "background-image": "url('"+shipImgName+"')", "background-size": "100% 100%", 
              width: shipW, height: shipH, left:frame.x+shipOffsetX, top:frame.y+shipOffsetY}];
  for (i in pos) 
      ret.push({id:"alien"+("0"+i).slice(-2), "background-image": "url('"+aliens[i]+"')", "background-size": "100% 100%",
                                width: alienW, height: alienH, left: frame.x+pos[i][0], top: frame.y+pos[i][1]});
  // Adding the name of the Planet
  ret.push({id:"planetName"+planetName, width: frame.w, height: 20, left: frame.x, top: frame.h-20});
  // Creation of the picture
  return ret;
};


var highlight = function(element, onOff) {
  return function(t){
    if (typeof(onOff) == "undefined" || onOff == true)
        $(element).css("border", "dotted 2px blue");
    else
        $(element).css("border", "none");
  };
};


// getPicture(["alien_blue.png","alien_red.png","alien_gray.png"], ["XR","UM","HS"], [
//                                                                                     {test: [0,0,0,0], prop: [0.6,0.4,0]},
//                                                                                     {test: [2,2,2,2], prop: [1,0,0]},
//                                                                                     {test: [0,0,1,0], prop: [0.6,0.4,0]} ])
var getPicture = function(colors, planetNames, fourAliensColors, continuous){
  // Size Settings
  var picW = 660, picH = 300;
  var xOffsets = [-20, -10, 0];
  var arrowW = 60, arrowH = 12, arrowYOffset = picH-20;
  // planets
  var planet1 = getTenAliens(colors, fourAliensColors[0].test, fourAliensColors[0].prop, {x: xOffsets[0], y: 0, w: picW/3, h:picH}, planetNames[0]),
      planet2 = getTenAliens(colors, fourAliensColors[1].test, fourAliensColors[1].prop, {x: picW/3+xOffsets[1], y: 0, w: picW/3, h:picH}, planetNames[1]),
      planet3 = getTenAliens(colors, fourAliensColors[2].test, fourAliensColors[2].prop, {x: 2*picW/3+xOffsets[2], y: 0, w: picW/3, h:picH}, planetNames[2]);
  if (continuous) {
      for (patch in planet2){
          if (planet2[patch].id.match(/alien/)) planet2[patch]["background-image"] = planet1[patch]["background-image"];
      }
  }
  var planetImgName = "planetsLarger.png";
  if (colors.length==1) planetImgName = "planetsLargerBW.png"
  // 10 aliens per planet
  var picture = [{id:"planetBg", "background-image": "url('"+planetImgName+"')", "background-size": "100% 100%",
                                width: picW, height: picH, left: 0, top: 0}]
                .concat(planet1).concat(planet2).concat(planet3)
                .concat([{id:"arrow1", "background-image": "url('arrow.png')", "background-size": "100% 100%", 
                          width: arrowW, height: arrowH, left: (xOffsets[0]+xOffsets[1])/2+picW/3-arrowW/2, top: arrowYOffset},
                         {id:"arrow2", "background-image": "url('arrow.png')", "background-size": "100% 100%",
                          width: arrowW, height: arrowH, left: (xOffsets[1]+xOffsets[2])/2+2*picW/3-arrowW/2, top: arrowYOffset}]);
  // Creation of the picture
  var pic = c2u.newPicture(picture, {width: picW, height: picH, margin: "auto"});
  pic.find("#planetName"+planetNames[0]).html(planetNames[0]).css("font-weight","bold");
  pic.find("#planetName"+planetNames[1]).html(planetNames[1]).css("font-weight","bold");
  pic.find("#planetName"+planetNames[2]).html(planetNames[2]).css("font-weight","bold");
  pic.find("#ships").addClass("ship");
  return pic;
};

// getSentences(["blue","red", "Exactly one alien still was red on Planet UM", true)
var getSentences = function(colors, trigger, continuous){
    var test = "In this group, exactly one alien was "+colors[0]+" on the <b>destination</b> planet.",
        second2 = "after temporarily disappearing on the transit planet.</p>";
    if (continuous) second2 = "though they had remained the same on the <b>transit</b> planet.</p>";
    switch (trigger) {
      case "Again":
        test = test.replace("on the","again on the");
        break;
      case "Also":
        test = test.replace("alien was","alien also was");
        break;
      case "As well":
        test = test.replace("on the","as well on the");
        break;
      case "Still":
        test = test.replace("alien was","alien still was");
        break;
    }
    return $("<div>")
            .append($("<p id='first'>These aliens used these 3 ships to leave their <b>home</b> planet and move to a new one,<br />passing through another planet in <b>transit</b>.</p>"))
            .append($("<p id='second'>Upon arrival on the <b>destination</b> planet their colors were randomly affected, <br />"+second2).css("display", "none"))
            .append($("<p id='third'>Initially, on their <b>home</b> planet some of them were "+colors[0]+", and others "+colors[1]+".</p>").css("display", "none"))
            .append($("<p id='fourth'>"+test+"</p>").css("display", "none"))
        .addClass("DynamicQuestion-rawText");
};