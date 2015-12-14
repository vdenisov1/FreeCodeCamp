var gamePattern = [];
var userPattern = [];
var gameSpeed = 1000;
var userClicks = 0;
var strictMode = false;

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

function simonGo(increment){
	//This function is for the computer to go. 
	$(".switch").removeClass("switchable");
	
	if(increment === true){
		var randomNumber = Math.floor(Math.random() * (4)) + 1;
		gamePattern.push(randomNumber);

		if(gamePattern.length > 12){
			gameSpeed = 500;
		}else if(gamePattern.length > 8){
			gameSpeed = 650;
		}else if(gamePattern.length > 4){
			gameSpeed = 850;
		}
	}

	if($(".game-button").hasClass("clickable")){
		$(".game-button").removeClass("clickable");
	}

	if(gamePattern.length > 20){
		gameOver(true);
		return false;
	}

	var counter = $("#count > #display");

	console.log("In SimongGo");

	var showing = 0;

	for(var i = 0; i < gamePattern.length * 2; i++){
		var clickable = (i + 1 < gamePattern.length) ? false : true;

		if(i % 2 > 0){
			setTimeout("buttonRelease(" + clickable + ")",gameSpeed * i);
		}else{
			console.log("Showing index " + showing);

			setTimeout("buttonPress(" + gamePattern[showing] + "," + i + ")",gameSpeed * i);
			showing++;
		}
	}

	counter.html(gamePattern.length);
}

function buttonRelease(clickable){
	$(".pressed").removeClass("pressed");

	if(clickable === true){
		$(".game-button").addClass("clickable");
		$(".switch").addClass("switchable");
	}

}

function buttonPress(button_id){
	var button = $("#button-" + button_id);
	var buttonsToClear = $(".pressed");


	if(typeof(button.attr("id")) === "undefined"){
		console.log("Clearing last button");
		buttonsToClear.removeClass("pressed");
		$(".game-button").addClass("clickable");
	}else{
		console.log("Adding pressed class to " + button.attr("id"));
		buttonsToClear.removeClass("pressed");
		button.addClass("pressed");
	}
}

function startGame(){
	gamePattern = [];
	gameSpeed = 1000;
	simonGo(true);
}

function wait(milliseconds){
	var startTime = Date.now();
	var currentTime = Date.now();

	while((currentTime - startTime) < milliseconds){
		currentTime = Date.now();
	}

	return true;
}

function changeSwitch(){
	var switchDiv = $(".switch");
	var switcher = $(".switch > .switcher");
	var gameButtons = $(".game-button");
	var currentPosition = switchDiv.hasClass("off") ? "off" : "on";
	var counter = $("#count > #display");

	if(currentPosition === "off"){
		//If it's currently in the off position, that means we must switch it on.
		console.log("Turning on");
		switcher.css("margin-left","50%");
		switchDiv.removeClass("off");
		switchDiv.addClass("on");
		gameButtons.addClass("clickable");
		turnDisplayOn();
	}else{
		console.log("Turning off");
		switcher.css("margin-left","0%");
		switchDiv.removeClass("on");
		switchDiv.addClass("off");
		gameButtons.removeClass("clickable");
		turnDisplayOff();
	}
}

function turnDisplayOn(){
	$("#count > #display").html("--");
	return true;
}

function turnDisplayOff(){
	$("#count > #display").html("");
	return true;
}

function gameOver(win){
	//This function will be used to display the winning game message if the user wins a 20 step pattern.
	console.log("Congrats you won!");
	$(".pop-up").removeClass("hidden");
}

function checkUserInput(){
	for(var k = 0; k < userPattern.length; k++){
		if(!(gamePattern[k] === userPattern[k])){
			return false;
		}
	}

	return true;
}

function wrongInput(times,interval){
	$(".game-button").removeClass("clickable");

	for(var i = 0; i <= 2*times; i++){
		if(i % 2 > 0){
			setTimeout("displayBlink('!!'," + i + "," + 2*times + "," + gamePattern.length + ")",interval * i);
		}else{
			setTimeout("displayBlink(''," + i + "," + 2*times + "," + gamePattern.length + ")",interval * i);
		}
		
	}
}

function displayBlink(text,index,total,original_text){
	var display = $("#display");

	console.log("Index = " + index + " Text = " + text + " Total = " + total + " Original Text = " + original_text);
	
	if(index < total){
		display.html(text);
	}else{
		$(".game-button").addClass("clickable");
		display.html(original_text);
		
		if(strictMode){
			startGame();
		}else{
			simonGo(false);
		}
	}
}

$(document).ready(function(){
	centerHorizontally($(".pop-up"),300);

	$(window).resize(function(){
		centerHorizontally($(".pop-up"),300);
	});

	$(".btn#reset-game").on("click",function(){
		$(".pop-up").addClass("hidden");
		startGame();
	});

	$(".game-button").on("click",function(){
		if($(this).hasClass("clickable")){
			console.log("Game button clicked");
			
			var buttonPressed = $(this).attr("id");
			var patternNum = parseInt(buttonPressed[buttonPressed.length-1]);

			console.log("Adding " + patternNum + " to UserPattern");
			userPattern.push(patternNum);


			//Check input right away.
			if(checkUserInput()){
				//Next level.
				if(userPattern.length === gamePattern.length){
					setTimeout(function(){
						simonGo(true);
					},200);

					userPattern = [];
				}
			}else{
				wrongInput(3,300);
				userPattern = [];
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
		}else{
			return false;
		}
	});

	$(".switch").on("click",function(){
		console.log("Switch pressed");

		if($(this).hasClass("switchable")){
			console.log("Switching");
			changeSwitch();
		}
	});
});