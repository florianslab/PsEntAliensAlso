// #################  HELPER TO BUILD ALIEN IMAGES #################
//
// Version 1.0 - 08.16.2016
//
// getUrlPic("file.png")
//   used for the 'background(-image)' CSS property. Need to have 'host' defined elsewhere.
function getUrlPic(picture) { return "url("+picture+")"; }

// newCalendar([
//               ["alien_blue.png", "alien_blue.png"],
//               ["alien_blue.png", "alien_green.png"],
//               ["alien_green.png", "alien_green.png"]
//             ]);
//   returns a clic2uncover complex picture showing 3 thinking aliens.
function newAliens(arrayOfColorTriples, planets, id) {
    
    var background = "planets.png", // The picture used as a background 
        arrows = "arrow.png";       // The picture of the arrow between each alien in a row
    
    var backgroundWidth = 720,
        backgroundHeight = 464;

    var yoffset = 20; // The number of pixels separating each row

    var arrowWidth = 170,     // The width of the arrow image as to be printed on the screen
        arrowXOffset = -15,   // The horizontal offset for positionning the arrow between two aliens
        alienLeft = {left: 105, top: 60, width: 80, height:50},
        alienMiddle = {left:alienLeft.left+alienLeft.width+arrowWidth+2*arrowXOffset, top: 60, width: 80, height:50},
        alienRight = {left: alienMiddle.left+alienMiddle.width+arrowWidth+2*arrowXOffset, top: 60, width: 80, height:50}; 
    
    if (typeof id != "string") id = "alien";     // Giving an ID to the picture
    
    // patches is the array of objects representing the different DIV in the click2uncover element
    var patches = [];

        // Adding the background picture
    patches.push({id: id+"background", background: getUrlPic(background),
                  top: 0, left: 0, width: backgroundWidth, height: backgroundHeight});

    // Going through each triple (should be a total of 7)
    for (triple in arrayOfColorTriples) {

        // patchAlienLeft, patchAlienMiddle and patchAlienRight are the objects corresponding to the DIVs currently processed
        var patchAlienLeft, patchAlienMiddle, patchAlienRight,
            arrowLeftMiddle, arrowMiddleRight;
        
        patchAlienLeft = $().extend({id: id+"AlienLeft"+triple, background: getUrlPic(arrayOfColorTriples[triple][0])}, alienLeft);
        patchAlienMiddle = $().extend({id: id+"AlienMiddle"+triple, background: getUrlPic(arrayOfColorTriples[triple][1])}, alienMiddle);
        patchAlienRight = $().extend({id: id+"AlienRight"+triple, background: getUrlPic(arrayOfColorTriples[triple][2])}, alienRight);
        
        // Adding an offset if several aliens
        patchAlienLeft.top += (alienLeft.height + yoffset) * triple;
        patchAlienMiddle.top += (alienMiddle.height + yoffset) * triple;
        patchAlienRight.top += (alienRight.height + yoffset) * triple;

        // Adjusting the size of the background picture to its frame
        patchAlienLeft["background-size"] = "cover";
        patchAlienMiddle["background-size"] = "cover";
        patchAlienRight["background-size"] = "cover";

        // Adding arrows between the aliens
        arrowLeftMiddle = {id: id+"ArrowLeftMiddle"+triple, background: getUrlPic(arrows), 
                           left: patchAlienLeft.left+patchAlienLeft.width+arrowXOffset, width:arrowWidth,
                           top: patchAlienLeft.top+(patchAlienLeft.height/4), height: patchAlienLeft.height/2};
        arrowMiddleRight = {id: id+"ArrowMiddleRight"+triple, background: getUrlPic(arrows), 
                           left: patchAlienMiddle.left+patchAlienMiddle.width+arrowXOffset, width:arrowWidth,
                           top: patchAlienMiddle.top+(patchAlienMiddle.height/4), height: patchAlienMiddle.height/2};

        arrowLeftMiddle["background-size"] = "cover";
        arrowMiddleRight["background-size"] = "cover";

        
        // Adding each image to the c2p
        patches.push(patchAlienLeft);
        patches.push(patchAlienMiddle);
        patches.push(patchAlienRight);
        patches.push(arrowMiddleRight);
        patches.push(arrowLeftMiddle);
    }

    patches.push({left:80, top:425, width:140, height:30, id:"homePlanet"}); 
    patches.push({left:295, top:425, width:140, height:30, id:"planetA"}); 
    patches.push({left:505, top:425, width:140, height:30, id:"planetB"});

    var picture = c2u.newPicture(patches, {width: backgroundWidth, height: backgroundHeight});

    var homePlanet = "Home", planetA = "Planet A", planetB = "Planet B";

    if (Array.isArray(planets) && planets.length == 2){
        if (typeof planets[0] == "string") planetA = planets[0];
        if (typeof planets[1] == "string") planetB = planets[1];
    }

    picture.children("#homePlanet").html(homePlanet).css("border","solid 1px black");
    picture.children("#planetA").html(planetA).css("border","solid 1px black");
    picture.children("#planetB").html(planetB).css("border","solid 1px black");

    // Returns the click2uncover element, containing the patches, and whose size is determined by bigAlien
    return picture;
}
//
// ##################################################################