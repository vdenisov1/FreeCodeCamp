var gamePattern = [];
var userPattern = [];
var gameSpeed = 1000;
var userClicks = 0;
var strictMode = false;
var hasAudioContext = window.AudioContext || window.webkitAudioContext || false;
var audioCtx, gainNodes, errNode, errOsc, oscillators, vol, ramp;

// This function is to center a div horizonatlly by window Size or it's parent DIV size.
//  To do this it takes it's parent DIV or window size and evenly divides the width, subtracts it's width
//  and creates a left margin to the element.
function centerHorizontally(element,original_width,relativeToWindow){
	var parentWidth = $(element).parent().innerWidth();

	if(relativeToWindow === true){
		parentWidth = $(window).innerWidth();
	}
	
	var leftMargin = Math.floor(((parentWidth - original_width)/ 2)) - 15;

	console.log("Window Size: " + parentWidth);
	console.log("Left Margin Calculated: " + leftMargin);
	console.log("Original size: " + original_width);


	if(leftMargin < 0){
		element.css("width","100%");
	}else{
		element.css("width",original_width + "px");
		element.css("margin-left",leftMargin + "px");
	}
}

// showPattern(increment)
// 	This function is used to show the pattern of moves in the game. 
//		if increment is true then it will add a step, otherwise it will just show the current steps over.
function showPattern(increment){
	//First lock the game
	lockGame();

	if(increment === true){
		if(!(nextPattern())){
			gameOver(true);
			return false;
		}
	}

	var counter = $("#display");
	var showing = 0;

	counter.html(gamePattern.length);

	for(var i = 0; i < gamePattern.length * 2; i++){
		var unlock = (i + 1 < 2*gamePattern.length) ? false : true;

		console.log("i = " + i + " Unlock = " + unlock);

		if(i % 2 > 0){
			setTimeout("buttonRelease(" + unlock + ")",gameSpeed * i);
		}else{
			setTimeout("buttonPress(" + gamePattern[showing] + "," + i + ")",gameSpeed * i);
			showing++;
		}
	}
}

// lockGame() locks the game buttons (switcher and ability to press the buttons).
function lockGame(){
	var switcher = $(".switch");
	var gameButtons = $(".game-button");

	if(switcher.hasClass("switchable")){
		switcher.removeClass("switchable");
	}

	if(gameButtons.hasClass("clickable")){
		gameButtons.removeClass("clickable");
	}

	return true;
}

// unlockGame() unlocks the game buttons (switcher and ability to press the buttons).
function unlockGame(){
	var switcher = $(".switch");
	var gameButtons = $(".game-button");

	if(!(switcher.hasClass("switchable"))){
		switcher.addClass("switchable");
	}

	if(!(gameButtons.hasClass("clickable"))){
		gameButtons.addClass("clickable");
	}

	return true;
}

// gameIsLocked() returns true if the game is locked, false otherwise.
function gameIsLocked(){
	var switcher = $(".switch");
	var gameButtons = $(".game-button");

	if(switcher.hasClass("switchable") && gameButtons.hasClass("clickable")){
		return false;
	}else{
		return true;
	}
}

//	nextPattern() will increment the game pattern by 1 and also check if the gamespeed should be
//   updated. If the game pattern is over 20 then it will return false.
function nextPattern(){
	var randomNumber = Math.floor(Math.random() * (4)) + 1;
	gamePattern.push(randomNumber);

	if(gamePattern.length > 12){
		gameSpeed = 500;
	}else if(gamePattern.length > 8){
		gameSpeed = 650;
	}else if(gamePattern.length > 4){
		gameSpeed = 850;
	}

	if(gamePattern.length > 20){
		return false;
	}
	
	return true;
}

// buttonRelease(unlock) releases the button from being pressed down. If unlock is true then it also unlocks
//  the game since it's the last release of the pattern.
function buttonRelease(unlock){
	$(".pressed").removeClass("pressed");

	if(hasAudioContext){
		stopGoodTones();
	}

	if(unlock === true){
		unlockGame();
	}
}

// buttonPress(button_id) uses the button id to press down on the button while showing the pattern.
function buttonPress(button_id){
	var button = $("#button-" + button_id);
	var buttonsToClear = $(".pressed");

	if(typeof(button.attr("id")) === "undefined"){
		buttonsToClear.removeClass("pressed");

		if(hasAudioContext){
			stopGoodTones();
		}
	}else{
		if(hasAudioContext){
			playGoodTone(button_id-1);
		}

		buttonsToClear.removeClass("pressed");
		button.addClass("pressed");
	}
}

// startGame() starts or resets the game.
function startGame(){
	gamePattern = [];
	gameSpeed = 1000;
	showPattern(true);
}

function gameStarted(){
	if(gamePattern.length > 0){
		return true;
	}

	return false;
}

// changeSwitch() moves the switch when pressed.
function changeSwitch(){
	var switchDiv = $(".switch");
	var switcher = $(".switch > .switcher");
	var currentPosition = switchDiv.hasClass("off") ? "off" : "on";

	if(currentPosition === "off"){
		switcher.css("margin-left","50%");
		switchDiv.removeClass("off");
		switchDiv.addClass("on");
		turnOnGame();
	}else{
		console.log("Turning off");
		switcher.css("margin-left","0%");
		switchDiv.removeClass("on");
		switchDiv.addClass("off");
		turnOffGame();
	}
}

// turnOnGame() turns on the display and enables the buttons.
function turnOnGame(){
	var gameButtons = $(".game-button");
	var counter = $("#count > #display");

	gameButtons.addClass("clickable");
	counter.html("--");

	return true;
}

// turnOffGame() turns off the display and disables the buttons.
function turnOffGame(){
	var gameButtons = $(".game-button");
	var counter = $("#count > #display");

	gameButtons.removeClass("clickable");
	counter.html("");

	return true;
}

// gameOver(win) displays the popup congratulating the use if the game is over.
function gameOver(win){
	$(".pop-up").removeClass("hidden");
	return true;
}

// checkUserInput() checks the patter of the user array to the pattern of the game and returns false if 
//  one of the patterns are not equal. Otherwise returns true for success.
function checkUserInput(){
	for(var k = 0; k < userPattern.length; k++){
		if(!(gamePattern[k] === userPattern[k])){
			return false;
		}
	}

	return true;
}

// wrongInput(times,interval) displays the !! in the display if a user got the wrong input. If strict mode is 
//  enabled then after the display is shown it will start the game over.
function wrongInput(times,interval){
	lockGame();
	playErrTone();

	for(var i = 0; i <= 2*times; i++){
		if(i % 2 > 0){
			setTimeout("displayBlink('!!'," + i + "," + 2*times + "," + gamePattern.length + ")",interval * i);
		}else{
			setTimeout("displayBlink(''," + i + "," + 2*times + "," + gamePattern.length + ")",interval * i);
		}
		
	}
}

// displayBlink(text,index,total,original_text) just shows the !! in the display or reverts back to the number of 
//  patterns in the display.
function displayBlink(text,index,total,original_text){
	var display = $("#display");
	stopErrTone();
	
	if(index < total){
		display.html(text);
	}else{
		unlockGame();
		display.html(original_text);
		
		if(strictMode){
			startGame();
		}else{
			showPattern(false);
		}
	}
}

// AudioContext Implementation

function playGoodTone(num){
	gainNodes[num].gain.linearRampToValueAtTime(vol,audioCtx.currentTime + ramp);
};

function stopGoodTones(){
	gainNodes.forEach(function(g){
		g.gain.linearRampToValueAtTime(0,audioCtx.currentTime + ramp);
	});
};

function playErrTone(){
	errNode.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + ramp);
};

function stopErrTone(){
	errNode.gain.linearRampToValueAtTime(0,audioCtx.currentTime + ramp);
};

// -----------------------------
// --------- Mobile Compatibility Functions
// -----------------------------

function resizeGame(forcedWidth){
	var defaults = {
		".outer": {
			"width": "500px",
			"height": "500px",
			"border-top-left-radius": "250px",
			"border-top-right-radius": "250px",
			"border-bottom-right-radius": "250px",
			"border-bottom-left-radius": "250px"
		},
		".game-button": {
			"width": "250px",
			"height": "250px"
		},
		"#controls": {
			"width": "250px",
			"height": "250px",
			"border-top-left-radius": "125px",
			"border-top-right-radius": "125px",
			"border-bottom-right-radius": "125px",
			"border-bottom-left-radius": "125px",
			"border-top-width": "15px",
			"border-right-width": "15px",
			"border-bottom-width": "15px",
			"border-left-width": "15px"
		},
		"#button-1": {
			"border-top-left-radius": "250px",
			"border-right-width": "12px",
			"border-bottom-width": "12px",
			"border-left-width": "24px",
			"border-top-width": "24px"
		},
		"#button-2": {
			"border-top-right-radius": "250px",
			"border-bottom-width": "12px",
			"border-left-width": "12px",
			"border-top-width": "24px",
			"border-right-width": "24px",
		},
		"#button-3": {
			"border-bottom-left-radius": "250px",
			"border-top-width": "12px",
			"border-right-width": "12px",
			"border-bottom-width": "24px",
			"border-left-width": "24px"
		},
		"#button-4": {
			"border-bottom-right-radius": "250px",
			"border-top-width": "12px",
			"border-left-width": "12px",
			"border-right-width": "24px",
			"border-bottom-width": "24px",
		},
		"#controls > .title": {
			"font-size": "25px",
			"margin-top": "30px"
		},
		".subtitle": {
			"font-size": "14px"
		},
		"#on": {
			"font-size": "14px"
		},
		"#off": {
			"font-size": "14px"
		},
		"#display": {
			"font-size": "14px"
		},
		".light": {
			"right": "38px",
			"top": "72px",
		}
	}

	var screenWidth = $(window).innerWidth();

	if(screen.width < 500){
		screenWidth = screen.width;
	}

	if(!(typeof(forcedWidth) === "undefined")){
		screenWidth = forcedWidth;
	}

	console.log("Screen width is " + screenWidth);
	console.log("Outer width is " + $(".outer").width());

	if(screenWidth < 500){
		//resize to new full screen
		var ratio = (screenWidth - 30) / parseFloat(defaults[".outer"]["width"]);

		console.log("Ratio is " + ratio + " using screenwidth : " + (screenWidth-30) + " and outer width of " + $(".outer").outerWidth());
		//restore to defaults
		var elements = Object.keys(defaults);

		for(var i = 0; i < elements.length; i++){
			var el = elements[i];
			var props = Object.keys(defaults[el]);

			for(var j = 0; j < props.length; j++){
				var prop = props[j];
				var value = (parseFloat(defaults[el][prop]) * ratio) + "px"; 

				if(prop === "game-button"){
					value = ((parseFloat($(el).css(prop) - $(el).css("border-left-width"))));
				}

				//console.log("Setting " + el + " property " + prop + " from " + $(el).css(prop) + " to " + value);

				defaults[el][prop] = value;
				
			}

		}

		for(var i = 0; i < elements.length; i++){

			var el = elements[i];
			var props = Object.keys(defaults[el]);

			for(var j = 0; j < props.length; j++){
				var prop = props[j];
				var val = defaults[el][prop];
				
				$(el).css(prop,val);
			}

		}

	}else{
		console.log("Restoring to defaults");
		//restore to defaults
		var elements = Object.keys(defaults);

		for(var i = 0; i < elements.length; i++){
			var el = elements[i];
			var props = Object.keys(defaults[el]);

			for(var j = 0; j < props.length; j++){
				var prop = props[j];
				var value = defaults[el][prop]

				//console.log("Setting " + el + " " + prop + " to " + value);
				$(el).css(prop,value);
			}

		}
	}
}

$(document).ready(function(){
	var fWidth = $(window).innerWidth();

	console.log("Inner Width : " + fWidth);
	console.log("Screen Width : " + screen.width);

	/////////////////// AudioContext Implementation //////////
	if(!hasAudioContext){
		alert("Sorry, but your browser does not support Web Audio API. You can continue to play without sounds.");
	}else{
		console.log("Audio Works");

    if(typeof(webkitAudioContext) === "undefined"){
      audioCtx = new AudioContext();
    }else{
   		audioCtx = new webkitAudioContext(); 
    }

		var frequencies = [329.63,261.63,220,164.81];

		errOsc = audioCtx.createOscillator();
		errOsc.type = 'triangle';
		errOsc.frequency.value = 110;
		errOsc.start(0.0);

		errNode = audioCtx.createGain();
		errOsc.connect(errNode);
		errNode.gain.value = 0;
		errNode.connect(audioCtx.destination);

		ramp = 0.1;
		vol = 0.5;

		oscillators = frequencies.map(function(frq){
			var osc = audioCtx.createOscillator();
			osc.type = 'sine';
			osc.frequency.value = frq;
			osc.start(0.0);
			return osc;
		});

		gainNodes = oscillators.map(function(osc){
			console.log("Setting gaineNodes " + osc);
			var g = audioCtx.createGain();
			osc.connect(g);
			g.connect(audioCtx.destination);
			g.gain.value = 0;
			return g;
		});

		console.log("gaineNodes[1] = " + gainNodes);
	}

	///////////////////////////////////////
	// Section is to recenter pop up.
	///////////////////////////////////////
	centerHorizontally($(".pop-up"),300);
	resizeGame();

	$(window).resize(function(){
		centerHorizontally($(".pop-up"),300);
		resizeGame();
	});

	///////////////////////////////////////
	///////////////////////////////////////

	$(".btn#reset-game").on("click",function(){
		$(".pop-up").addClass("hidden");
		startGame();
	});

	$(".game-button").on("click",function(){
		if(!(gameIsLocked())){		
			var buttonPressed = $(this).attr("id");

			var patternNum = parseInt(buttonPressed[buttonPressed.length-1]);
			userPattern.push(patternNum);

			//Check input right away.
			if(checkUserInput()){
				//Next level.
				if(userPattern.length === gamePattern.length){
					setTimeout(function(){
						showPattern(true);
					},200);

					userPattern = [];
				}
			}else{
				wrongInput(3,300);
				userPattern = [];
			}
		}
	});

	$(".game-button").on("mousedown",function(e){
		if(!(gameIsLocked()) && gameStarted() && e.which == 1){
			console.log("On mouseDown");

			var buttonPressed = $(this).attr("id");
			var patternNum = parseInt(buttonPressed[buttonPressed.length-1]);

			$(this).addClass("pressed");

			if(hasAudioContext){
				playGoodTone(patternNum-1);
			}
		}
	});

	$(".game-button").on("touchstart",function(e){
		console.log("Touch started");

		if(!(gameIsLocked()) && gameStarted()){
			console.log("On touchstart");

			var buttonPressed = $(this).attr("id");
			var patternNum = parseInt(buttonPressed[buttonPressed.length-1]);

			$(this).addClass("pressed");
			if(hasAudioContext){
				playGoodTone(patternNum-1);
			}
		}
	});

	$(".game-button").on("touchend",function(e){
		console.log("Touch Ended");

		if(!(gameIsLocked()) && gameStarted()){
			console.log("On touchend");

			$(this).removeClass("pressed");

			if(hasAudioContext){
				stopGoodTones();
			}
		}
	});

	$(".game-button").on("mouseup",function(e){
		if(!(gameIsLocked()) && gameStarted() && e.which == 1){
			console.log("On mouseUp");

			$(this).removeClass("pressed");

			if(hasAudioContext){
				stopGoodTones();
			}
		}
	});

	$(".button.start").on("click",function(){
		if($(".switch").hasClass("on")){
			startGame();
		}else{
			return false;
		}
	});



	$(".button.strict").on("click",function(){
		if($(".switch").hasClass("on")){
			var strictButton = $(".light");
			var currentPosition = strictButton.hasClass("off") ? "off" : "on";

			if(currentPosition === "off"){
				strictButton.removeClass("off");
				strictButton.addClass("on");
				strictMode = true;
			}else{
				strictButton.removeClass("on");
				strictButton.addClass("off");
				strictMode = false;
			}

			return true;
		}

		return false;
	});

	$(".switch").on("click",function(){
		if($(".switch").hasClass("switchable")){
			changeSwitch();
		}
	});
});