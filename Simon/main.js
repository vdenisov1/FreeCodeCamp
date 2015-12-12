var winClass = "";
var winSign = "";
var win = false;

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

function changeSwitch(){
	var switchDiv = $(".switch");
	var switcher = $(".switch > .switcher");
	var currentPosition = switchDiv.hasClass("off") ? "off" : "on";

	if(currentPosition === "off"){
		//If it's currently in the off position, that means we must switch it on.
		switcher.css("margin-left","50%");
		switchDiv.removeClass("off");
		switchDiv.addClass("on");
		turnDisplayOn();
	}else{
		switcher.css("margin-left","0%");
		switchDiv.removeClass("on");
		switchDiv.addClass("off");
		turnDisplayOff();
	}
}

function turnDisplayOn(){
	$("#display > .timer").html("--");
	return true;
}

function turnDisplayOff(){
	$("#display > .timer").html("");
	return true;
}



$(document).ready(function(){
	$(window).resize(function(){
	
	});

	$(".button.start").on("click",function(){
		if($(".switch").hasClass("on")){

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
			}else{
				strictButton.removeClass("on");
				strictButton.addClass("off");
			}
		}else{
			return false;
		}
	});

	$(".switch").on("click",changeSwitch);
});