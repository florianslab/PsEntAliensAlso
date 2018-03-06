var Parameters = {},
    URLParameters = window.location.search.replace("?", "").split("&");

for (parameter in URLParameters) Parameters[URLParameters[parameter].split("=")[0]] = URLParameters[parameter].split("=")[1];


// ############################  GENERAL SETTINGS ##########################
//

//var shuffleSequence = seq("instruct",startsWith("practice"),rshuffle(endsWith("PsEnt")),"postExp");
//var shuffleSequence = seq(startsWith("practice"),rshuffle(endsWith("PsEnt")),"postExp");
var shuffleSequence = seq(startsWith("practice"),rshuffle(isCriticalOrControlOver18()),rshuffle(isCheckOrControlAtMost18()),"postExp");
var showProgressBar = true;   // show progress bar
var manualSendResults = true;

//var practiceItemTypes = ["practice"];

var defaults = [
    "DynamicQuestion", {
        randomOrder: ["F", "J"],   // Randomly ordered answers, but 1st should always be 'F' and 2nd 'J'
        clickableAnswers: false    // Prevents participants from choosing an answer by clicking on it
    },
];

// If TRUE, the aliens on the transit planet will appear as grey  (necessary for AGAIN)
// If FALSE, they will have the same colors as on the home planet (necessary for STILL)
var continuous = true;

// Comment/uncomment the lines depending on which trigger you want to use
// Make sure the trigger starts with an upper case
//var trigger = "As well";
var trigger = "Also";
//var trigger = "Again";
//var trigger = "Still";

// No sense in having continuous 'again' or discontinuous 'still'
if (trigger == "Again") continuous = false;
if (trigger == "Still") continuous = true;

var zipFiles = {images: "http://files.lab.florianschwarz.net/ibexfiles/PsEntAliensAlso/Images.zip"};    
//
// ##########################################################################
    

// The following only defines forms and structural screens
// See items_data.js for the practice and experimental items
var items = [

  ["instruct", "__SetCounter__", {}],

  ["instruct", "Message", {html: {include: "IbexConsentSona2017.html"}} ],  

  //["instruct", "ZipPreloader", {}],

  ["postExp", "Form", {html: {include: "FeedbackPreConfirmation.html"}} ],

  ["postExp", "__SendResults__", {
       manualSendResults: true,
       sendingResultsMessage: "Please wait while your answers are being saved.",
       completionMessage: "Your answers have successfully being saved!"
    }],

  ["postExp", "Message", {html: {include: "PsEntAliensAspectual_Debriefing.html"}, transfer:null} ]

];
