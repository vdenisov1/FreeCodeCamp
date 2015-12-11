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

$(document).ready(function(){
	$(window).resize(function(){
	
	});
});