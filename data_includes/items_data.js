data = GetItemsFrom(data, null, {
    ItemGroup: ["item","group"],
    Elements:[
      function(row){return "Item"+row.item+row.Critical;},
      "DynamicQuestion",
      {
        legend: function(row){return[row.item,trigger,row.Expt,row.Critical,
                                     row.Predict,row.group,row.ColorTest,row.ColorFill,row.ColorCheck].join("+");},
        randomOrder: null,
        answers: function(row){
                  var colorList = ["alien_"+row.ColorTest+".png","alien_"+row.ColorFill+".png",
                                   "alien_"+row.ColorCheck+".png","alien_grey.png"],
                      testHome = row.Home.toNumberArray(),
                      testTransit = [2,2,2,2],
                      testDestination = row.Destination.toNumberArray(),
                      propHome = [0.6,0.4,0,0],
                      propTransit = [0,0,0,1],
                      propDestination = [0.4,0.3,0.3,0];
                  if (row.Condition.match("Check")) propHome = [0.4,0.6,0,0];
                  if (continuous) {
                    propTransit = propHome;
                    testTransit = testHome;
                  }
                  return{
                    Target: ["F", getPicture(colorList, 
                                            planetNames, [ {test: testHome, prop: propHome}, 
                                                           {test: testTransit, prop: propTransit},
                                                           {test: testDestination, prop: propDestination} ], continuous)
                            ],
                    Covered: ["J", getPicture(["alien_BW.png"], planetNames,
                                            [ {test: [0,0,0,0], prop: [1]}, 
                                              {test: [0,0,0,0,], prop: [1]}, 
                                              {test: [0,0,0,0], prop: [1]} ], continuous).css({"border":"double"})
                             ]
                  }; 
        },
        enabled: false,   // The user won't validate the trial by clicking/pressing the key.

        sequence: function(x){return[
            [x.item,trigger,x.Expt,x.Critical,x.Predict,x.group,x.ColorTest,x.ColorFill,x.ColorCheck].join("+"),
            getSentences([x.ColorTest,x.ColorFill], trigger, continuous),
            {this: "answers", showKeys: "bottom"},
            {pause: "key ", newRT: true},
            // Mask first sentence, show second sentence
            function(t){ $("p#first").css("display","none"); $("p#second").css("display","block"); },
            {pause: "key ", newRT: true},
            // Mask second sentence, show third sentence
            function(t){ $("p#second").css("display","none"); $("p#third").css("display","block"); },
            {pause: "key ", newRT: true},
            function(t){ 
              $("p#third").css("display","none");   // Mask third sentence
              $("p#fourth").css("display","block"); // Show fourth sentence
              $("#alien04, #alien05, #alien06, #alien07, #alien08, #alien09").css("display", "none"); // Hide side aliens
              // Replace background images to hide side ships
              $("#Target .ship").css("background-image", "url('http://localhost/~jeremyzehr/Images/1ship.png')"); 
              $("#Covered .ship").css("background-image", "url('http://localhost/~jeremyzehr/Images/1shipBW.png')"); 
              // Enable keypress
              t.enabled = true;
            }
          ];
        }
      }
    ]
  }).concat(

 [

  ["practice1", "DynamicQuestion", {

        legend: "practice1",
        randomOrder: null,
        answers: {
                  Target: ["F", getPicture(["alien_blue.png","alien_red.png","alien_grey.png","alien_yellow.png"], 
                                            planetNames, [ {test: [0,1,1,0], prop: [0.6,0.4,0,0]}, 
                                                           {test: [2,2,2,2], prop: [0,0,1,0]}, 
                                                           {test: [0,0,1,0], prop: [0.4,0.3,0,0.3]} ], continuous)
                          ],
                  Covered: ["J", getPicture(["alien_BW.png"], planetNames,
                                            [ {test: [0,0,0,0], prop: [1]}, 
                                              {test: [0,0,0,0,], prop: [1]}, 
                                              {test: [0,0,0,0], prop: [1]} ], continuous).css({"border":"double", "visibility":"hidden"})
                          ]
        },
        enabled: false,   // The user won't validate the trial by clicking/pressing the key.

        sequence: [
          TT("#bod", "This experiment is a guessing game: in every trial, you will see two pictures "+
                             "and you will have to select the one that corresponds to what you hear.", "Press Space", "mc"),
          {pause: "key\x01"},
          getSentences(["red","blue"], trigger, continuous),
          function(t){ $("p#first").css("visibility","hidden"); },
          {this: "answers", showKeys: "bottom"},
          function(t){ 
            $("#Covered .patches").append(getPicture(["alien_green.png","alien_pink.png","alien_grey.png","alien_orange.png"], 
                                            planetNames, [ {test: [0,1,1,0], prop: [0.6,0.4,0,0]}, 
                                                           {test: [2,2,2,2], prop: [0,0,1,0]}, 
                                                           {test: [0,0,1,0], prop: [0.4,0.3,0,0.3]} ], continuous)
                                          .css("display","none").attr("id","reveal"));
          },
          "<span id='press'>Press F or J</span>",
          // First hide everything but the color-visible aliens on their Home planet
          function(t){
            $(".patches div").css("visibility","hidden");
            $(".patches div:eq(0), .patches div:eq(1), .patches div:eq(2), .patches div:eq(3),"+
              ".patches div:eq(4), .patches div:eq(5), .patches div:eq(6), .patches div:eq(7),"+
              ".patches div:eq(8), .patches div:eq(9), .patches div:eq(10), .patches div:eq(11),"+
              ".patches div:eq(12)").css("visibility","visible");
          },
          function(t){ $("#press").css("display", "none"); },
          TT("#Target #ships", "Every trial is about a group of aliens who take their ships to leave their home planet.", "Press Space", "tc"),
          {pause: "key\x01"},
          highlight("#Target #alien04:eq(0), #Target #alien06:eq(0)"),
          TT("#Target #alien05", "For instance, this alien boarded on a ship with two other peers.", "Press Space", "br"),
          {pause: "key\x01"},
          highlight("#Target #alien04:eq(0), #Target #alien06:eq(0)", false),
          highlight("#Target #alien00:eq(0), #Target #alien01:eq(0), #Target #alien02:eq(0)"),
          TT("#Target #alien03", "And this one boarded on another ship with three other peers.", "Press Space", "br"),
          {pause: "key\x01"},
          // Reveal the color-visible destination
          function(t){
            $(".patches div:eq(25), .patches div:eq(26), .patches div:eq(27), .patches div:eq(28),"+
              ".patches div:eq(29), .patches div:eq(30), .patches div:eq(31), .patches div:eq(32),"+
              ".patches div:eq(33), .patches div:eq(34), .patches div:eq(35), .patches div:eq(36)").css("visibility","visible");
          },
          highlight("#Target #alien00:eq(0), #Target #alien01:eq(0), #Target #alien02:eq(0)", false),
          TT("#Target #ships:eq(2)", "At the end of their trip, they arrive at their destination.", "Press Space", "br"),
          {pause: "key\x01"},
          highlight("#Target #alien01:eq(0)"),
          TT("#Target #alien01:eq(2)", "But as you can see, the color of some aliens was affected in the process.", "Press Space", "br"),
          {pause: "key\x01"},
          highlight("#Target #alien01:eq(0)",false),
          // Reveal the color-visible transit planet
          function(t){
            $(".patches div:eq(13), .patches div:eq(14), .patches div:eq(15), .patches div:eq(16),"+
              ".patches div:eq(17), .patches div:eq(18), .patches div:eq(19), .patches div:eq(20),"+
              ".patches div:eq(21), .patches div:eq(22), .patches div:eq(23), .patches div:eq(24),"+
              "#Target #arrow1, #Target #arrow2").css("visibility","visible");
          },
          TT("#Target #ships:eq(1)", "On their way to their destination, they stopped on a transit planet.", "Press Space", "br"),
          {pause: "key\x01"},
          TT("#Target #alien00:eq(0)", (continuous?"Their colors remained unaffected on the transit planet.":
                                        "As you can see, they all lost their color on the transit planet."), "Press Space", "tr"),
          highlight("#Target #alien00:eq(0)",false),
          {pause: "key\x01"},
          // Reveal the black-and-white picture
          function(t){ $("#Covered div, #arrow1, #arrow2").css("visibility","visible"); },
          TT("table.DynamicQuestion-choice", "On every trial, you will see two pictures side by side.", "Press Space", "tc"),
          {pause: "key\x01"},
          TT("#Covered", "This picture shows other traveling aliens, but there is a filter screen on it.", "Press Space", "tc"),
          {pause: "key\x01"},
          TT("#Covered", "The filter screen makes everything appear black and white, so you can't tell the colors of these aliens.", "Press Space", "tc"),
          {pause: "key\x01"},
          {pause: 250},
          // Reveal the text
          function(t){ $("p#first").css("visibility","visible"); },
          TT("p#first", "A text above the pictures tells the story of one of the two groups of traveling aliens.", "Press Space", "bc"),
          {pause: "key\x01"},
          {pause: 250},
          TT("p#first", "The story was told by someone who was only seeing one of the two pictures below.", "Press Space", "bc"),
          {pause: "key\x01"},
          TT("table.DynamicQuestion-choice", "Your role will be to guess which picture the narrator was seeing: either the one on the left, or the one behind the black-and-white filter screen on the right.", "Press Space", "bc"),
          {pause: "key\x01"},
          {pause: 200},
          TT("p#first", "As you press the spacebar, the 4-sentence story unfolds.", "Press Space", "bc"),
          {pause: "key\x01"},
          function(t){ $("p#first").css("display","none"); $("p#second").css("display","block"); },
          {pause: 250},
          TT("p#second", "Press Space to continue reading.", "Press Space", "bc"),
          {pause: "key\x01"},
          function(t){ $("p#second").css("display","none"); $("p#third").css("display","block"); },
          {pause: 250},
          TT("p#third", "Up to the third sentence, the story is about the aliens in all three ships.", "Press Space", "bc"),
          {pause: "key\x01"},
          function(t){ $("p#third").css("display","none"); $("p#fourth").css("display","block"); },
          {pause: 250},
          // Mask the three-alien ships
          function(t){               
            $("#alien04, #alien05, #alien06, #alien07, #alien08, #alien09").css("display", "none");
            $("#Target .ship").css("background-image", "url('http://localhost/~jeremyzehr/Images/1ship.png')"); 
            $("#Covered .ship").css("background-image", "url('http://localhost/~jeremyzehr/Images/1shipBW.png')"); 
            $("#press").css("visibility","visible");
          },
          TT("p#fourth", "The fourth and final sentence focuses on the aliens in one ship.", "Press Space", "bc"),
          {pause: "key\x01"},
          TT("table.DynamicQuestion-choice", "At this point, the pictures no longer show the aliens in the other ships and you have to make your guess.", "Press Space", "tc"),
          {pause: "key\x01"},
          TT("#Target", "You press <b>F</b> if you think the story was about these aliens...", "Press Space", "bc"),
          {pause: "key\x01"},
          TT("#Covered", "Or you press <b>J</b> if you think the story was about the picture behind this black-and-white filter screen.", "Press Space and then F or J", "bc"),
          {pause: "key\x01"},
          {pause: "keyFJ"},
          // Printing a feedback in function to what key the participant just pressed
          function(t){
            var testSentence = $("#fourth").html().match("exactly.+planet")[0];
            setTimeout(function() {
              $("#Covered .ship").css("background-image", "url('http://localhost/~jeremyzehr/Images/1ship.png')");
              $("#Covered .patches").css("border", "none");
              $("#reveal").css({display:"block", border: "solid 1px gray"});
              console.log(t.pressedKey);
              if ("F".match(t.pressedKey))
                TT("#Target", "Right, the narrator was describing this picture, where "+testSentence+". In fact, there weren't even red aliens in the other picture.", "Press Space to Proceed", "bc")(t);
              else if ("J".match(t.pressedKey))
                TT("#Covered", "<span style='color: red;'>Wrong, in fact there weren't even red aliens in this picture. The narrator was describing the other picture, "+
                               "where "+testSentence+".</span>", "Press Space to Proceed", "bc")(t);
            }, 12);
          },
          {pause: "key\x01"}
        ]

     }
  ],

  ["practice2", "DynamicQuestion", {

        legend: "practice2",
        randomOrder: null,
        answers: {
                  Target: ["F", getPicture(["alien_yellow.png","alien_blue.png","alien_grey.png","alien_red.png"], 
                                            planetNames, [ {test: [1,0,0,1], prop: [0.6,0.4,0,0]}, 
                                                           {test: [2,2,2,2], prop: [0,0,1,0]}, 
                                                           {test: [1,0,1,1], prop: [0.4,0.3,0,0.3]} ], continuous)
                          ],
                  Covered: ["J", getPicture(["alien_BW.png"], planetNames,
                                            [ {test: [0,0,0,0], prop: [1]}, 
                                              {test: [0,0,0,0,], prop: [1]}, 
                                              {test: [0,0,0,0], prop: [1]} ], continuous).css({"border":"double"})
                          ]
        },
        enabled: false,                             // The user won't validate the trial by clicking/pressing the key.

        sequence: [
          TT("#bod", "Let's go through a second practice trial.", "Press Space", "mc"),
          {pause: "key\x01"},
          getSentences(["blue","yellow"], trigger, continuous),
          {this: "answers", showKeys: "bottom"},
          "<span id='press'>Press F or J</span>",
          function(t){ 
            $("#Covered .patches").append(getPicture(["alien_yellow.png","alien_blue.png","alien_grey.png","alien_red.png"], 
                                            planetNames, [ {test: [1,0,0,1], prop: [0.6,0.4,0,0]}, 
                                                           {test: [2,2,2,2], prop: [0,0,1,0]}, 
                                                           {test: [0,0,0,1], prop: [0.4,0.3,0,0.3]} ], continuous)
                                          .css("display","none").attr("id","reveal"));
            $("#press").css("visibility","hidden");
          },
          TT("p#first", "Remember: the story will unfold as you press the spacebar.", "Press Space", "bc"),
          {pause: "key\x01"},
          {pause: "key "},
          function(t){ $("p#first").css("display","none"); $("p#second").css("display","block"); },
          {pause: "key "},
          function(t){ $("p#second").css("display","none"); $("p#third").css("display","block"); },
          {pause: "key "},
          function(t){ $("p#third").css("display","none"); $("p#fourth").css("display","block"); },
          // Mask the three-alien ships
          function(t){               
            $("#alien04, #alien05, #alien06, #alien07, #alien08, #alien09").css("display", "none");
            $("#Target .ship").css("background-image", "url('http://localhost/~jeremyzehr/Images/1ship.png')"); 
            $("#Covered .ship").css("background-image", "url('http://localhost/~jeremyzehr/Images/1shipBW.png')"); 
            $("#press").css("visibility","visible");
          },
          {pause: 250},
          TT("table.DynamicQuestion-choice", "Now it's time to make your guess.", "Press Space", "bc"),
          {pause: "key\x01"},
          {pause: "keyFJ"},
          // Printing a feedback in function to what key the participant just pressed
          function(t){
            var testSentence = $("#fourth").html().match("exactly.+planet")[0];
            setTimeout(function() {
              $("#Covered .ship").css("background-image", "url('http://localhost/~jeremyzehr/Images/1ship.png')");
              $("#Covered .patches").css("border", "none");
              $("#reveal").css({display:"block", border: "solid 1px gray"});
              console.log(t.pressedKey);
              if ("F".match(t.pressedKey))
                TT("#Target", "<span style='color: red;'>Wrong, this time the narrator was in fact describing the picture behind the black-and-white screen, "+
                              "where "+testSentence+".</span>", "Press Space to Proceed", "bc")(t);
              else if ("J".match(t.pressedKey))
                TT("#Covered", "Right, the narrator was indeed describing this picture. As you can see in this (now unfiltered) picture, "+testSentence+".", "Press Space to Proceed", "bc")(t);
            }, 12);
          },
          {pause: "key\x01"}
        ]

     }
  ],

  ["practice3", "DynamicQuestion", {

        legend: "practice3",
        randomOrder: null,
        answers: {
                  Target: ["F", getPicture(["alien_pink.png","alien_green.png","alien_grey.png","alien_orange.png"], 
                                            planetNames, [ {test: [0,1,1,1], prop: [0.6,0.4,0,0]}, 
                                                           {test: [2,2,2,2], prop: [0,0,1,0]}, 
                                                           {test: [0,0,0,0], prop: [0.4,0.3,0,0.3]} ], continuous)
                          ],
                  Covered: ["J", getPicture(["alien_BW.png"], planetNames,
                                            [ {test: [0,0,0,0], prop: [1]}, 
                                              {test: [0,0,0,0,], prop: [1]}, 
                                              {test: [0,0,0,0], prop: [1]} ], continuous).css({"border":"double"})
                          ]
        },
        enabled: false,                             // The user won't validate the trial by clicking/pressing the key.

        sequence: [
          TT("#bod", "From now on, we will no longer reveal the picture behind the black-and-white layer.", "Press Space", "mc"),
          {pause: "key\x01"},
          getSentences(["green","pink"], trigger, continuous),
          {this: "answers", showKeys: "bottom"},
          "<span id='press' style='visibility: hidden'>Press F or J</span>",
          {pause: "key "},
          function(t){ $("p#first").css("display","none"); $("p#second").css("display","block"); },
          {pause: "key "},
          function(t){ $("p#second").css("display","none"); $("p#third").css("display","block"); },
          {pause: "key "},
          function(t){ $("p#third").css("display","none"); $("p#fourth").css("display","block"); },
          // Mask the three-alien ships
          function(t){               
            $("#alien04, #alien05, #alien06, #alien07, #alien08, #alien09").css("display", "none");
            $("#Target .ship").css("background-image", "url('http://localhost/~jeremyzehr/Images/1ship.png')"); 
            $("#Covered .ship").css("background-image", "url('http://localhost/~jeremyzehr/Images/1shipBW.png')"); 
            $("#press").css("visibility","visible");
          },
          {pause: "keyFJ"},
          // Printing a feedback in function to what key the participant just pressed
          function(t){
            setTimeout(function() {
              console.log(t.pressedKey);
              if ("F".match(t.pressedKey))
                TT("#Target", "<span style='color: red;'>Wrong: in this picture none of these four aliens was green on the final planet, "+
                              "so the narrator <i>must</i> have been describing the picture behind the black-and-white screen.</span>", "Press Space to Proceed", "bc")(t);
              else if ("J".match(t.pressedKey))
                TT("#Covered", "Right, the narrator <i>must</i> have been describing the picture behind the black-and-white screen, "+
                               "for none of the four aliens was green on the final planet in the picture on the left.", "Press Space to Proceed", "bc")(t);
            }, 12);
          },
          {pause: "key\x01"}
        ]

     }
  ],

  ["practice4", "DynamicQuestion", {

        legend: "practice4",
        randomOrder: null,
        answers: {
                  Target: ["F", getPicture(["alien_red.png","alien_yellow.png","alien_grey.png","alien_blue.png"], 
                                            planetNames, [ {test: [1,1,0,1], prop: [0.6,0.4,0,0]}, 
                                                           {test: [2,2,2,2], prop: [0,0,1,0]}, 
                                                           {test: [0,1,0,0], prop: [0.4,0.3,0,0.3]} ], continuous)
                          ],
                  Covered: ["J", getPicture(["alien_BW.png"], planetNames,
                                            [ {test: [0,0,0,0], prop: [1]}, 
                                              {test: [0,0,0,0,], prop: [1]}, 
                                              {test: [0,0,0,0], prop: [1]} ], continuous).css({"border":"double"})
                          ]
        },
        enabled: false,                             // The user won't validate the trial by clicking/pressing the key.

        sequence: [
          TT("#bod", "This is the last practice trial. The actual experiment will start right after.", "Press Space", "mc"),
          {pause: "key\x01"},
          getSentences(["yellow","red"], trigger, continuous),
          {this: "answers", showKeys: "bottom"},
          "<span id='press' style='visibility: hidden'>Press F or J</span>",
          {pause: "key "},
          function(t){ $("p#first").css("display","none"); $("p#second").css("display","block"); },
          {pause: "key "},
          function(t){ $("p#second").css("display","none"); $("p#third").css("display","block"); },
          {pause: "key "},
          function(t){ $("p#third").css("display","none"); $("p#fourth").css("display","block"); },
          // Mask the three-alien ships
          function(t){               
            $("#alien04, #alien05, #alien06, #alien07, #alien08, #alien09").css("display", "none");
            $("#Target .ship").css("background-image", "url('http://localhost/~jeremyzehr/Images/1ship.png')"); 
            $("#Covered .ship").css("background-image", "url('http://localhost/~jeremyzehr/Images/1shipBW.png')"); 
            $("#press").css("visibility","visible");
          },
          {pause: "keyFJ"},
          // Printing a feedback in function to what key the participant just pressed
          function(t){
            var testSentence = $("#fourth").html().match("exactly.+planet")[0];
            setTimeout(function() {
              console.log(t.pressedKey);
              if ("F".match(t.pressedKey))
                TT("#Target", "Right, in this picture "+testSentence+" so the narrator must have been describing these aliens, "+
                               "not the aliens behind the black-and-white screen.", "Press Space to Proceed", "bc")(t);
              else if ("J".match(t.pressedKey))
                TT("#Covered", "<span style='color: red;'>Wrong: you could see that in the picture on the left "+testSentence+", "+
                              "so going for the picture behind the black-and-white screen is a bad guess.</span>", "Press Space to Proceed", "bc")(t);
            }, 12);
          },
          {pause: "key\x01"}
        ]

     }
  ],

  ["practiceTransition", "Message", 
    {html: "Good. We are now going to start the actual experiment. Please be ready. Press Space to proceed.", transfer: "keypress"}
  ]

]);

items = items.concat(data);