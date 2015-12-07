function changeUnits(){
	var currentUnit = $(".active").attr("id");

	console.log("Current Unit = " + currentUnit);

	var unitIsAlreadyActive = $(this).hasClass('active');
	var currentDegrees = parseFloat($("#degrees>span.digits").html());
	var thisElement = $(this);
	var otherElement = $("#" + currentUnit);

	if(!(unitIsAlreadyActive)){
		//Check the current degree units to know which transformation to make.
		currentDegress = (currentUnit === "celcius") ? (currentDegrees * 1.8 + 32) : ((currentDegrees - 32) / 1.8);

		//Set the degrees display to the new dig
		$("#degrees>span.digits").html(currentDegress.toFixed(2).toString());

		
		//Add the active class to the otherElement
		thisElement.addClass('active');
		console.log("Removed Class Active from : " + thisElement.attr("id"));

		//Change the current button from being active to inactive
		otherElement.removeClass("active");
		console.log("Added Class Active from : " + thisElement.attr("id"));
	}

}

function getLocation(){
	if(navigator.geolocation){
		console.log("Geolocation available");
		
		navigator.geolocation.getCurrentPosition(getWeather);
		return true;
	}else{
		console.log("Geolocation NOT available");
		return false;
	}
}

function humanize(string){
	var s = string.toLowerCase().split(" ");
	var result = [];

	for(i = 0; i < s.length; i++){
		console.log("Upper Casing Word " + s[i]);

		var word = s[i].split("");
		var letter = s[i][0];
		

		word.shift();
		word.unshift(letter.toUpperCase());

		result.push(word.join(""));
	}

	return result.join(" ");

}

function centerDivs(){
	var parentWidth = parseFloat($("#additional-weather").css("width"));
	var childDivs = $("#additional-weather > div");
	var usedWidth = 0.0;

	console.log(typeof(childDivs) + " Length : " + childDivs.length);

	childDivs.each(function(index,value){
		usedWidth += parseFloat($(value).css("width"));
		console.log("Width of Div " + index + " is " + parseFloat($(value).css("width")) + " Used Width Now: " + usedWidth);
	});
		
	var remainingWidth = parentWidth - usedWidth;

	console.log("Setting margin to : " + "0px " + ((remainingWidth - 1) / 2).toString() + "px");

	$(childDivs[1]).css("margin","0px " + ((remainingWidth - 1) / 2).toString() + "px");

}

function removeCentered(){
	var parentWidth = parseFloat($("#additional-weather").css("width"));
	var childDivs = $("#additional-weather > div");
	var usedWidth = 0.0;

	console.log(typeof(childDivs) + " Length : " + childDivs.length);

	childDivs.each(function(index,value){
		usedWidth += parseFloat($(value).css("width"));
		console.log("Width of Div " + index + " is " + parseFloat($(value).css("width")) + " Used Width Now: " + usedWidth);
	});
		
	var remainingWidth = parentWidth - usedWidth;

	console.log("Setting margin to : " + "0px " + ((remainingWidth - 1) / 2).toString() + "px");

	$(childDivs[1]).css("margin","0px " + ((remainingWidth - 1) / 2).toString() + "px");
}

function setBackground(icon_filename){
	console.log("Icon = " + icon_filename);
	if(icon_filename === "01d"){
		$("body").css("background","url('https://mamadeon.files.wordpress.com/2011/09/crystal-clear-sky1.jpg') no-repeat fixed center center / cover");
	}else if(icon_filename === "01n"){
		$("body").css("background","url('http://images.summitpost.org/original/472297.jpg') no-repeat fixed center center / cover");
	}else if(icon_filename === "02d"){
		$("body").css("background","url('https://wrongsideofthecamera.files.wordpress.com/2013/08/boston-charles-river-clouds-zakim-bridge.jpg') no-repeat fixed center center / cover");
	}else if(icon_filename === "02n"){
		$("body").css("background","url('http://www.stringfieldphotography.com/blog/wp-content/uploads/2011/12/IMG_4939.jpg') no-repeat fixed center center / cover");		
	}else if(icon_filename === "03d"){
		$("body").css("background","url('http://coclouds.com/wp-content/uploads/2011/06/illuminated-scattered-clouds-2011-06-21.jpg') no-repeat fixed center center / cover");		
	}else if(icon_filename === "03n"){
		$("body").css("background","url('https://smokefromthetemple.files.wordpress.com/2011/08/1.jpg') no-repeat fixed center center / cover");		
	}else if(icon_filename === "04d"){
		$("body").css("background","url('http://coclouds.com/wp-content/uploads/2011/06/illuminated-scattered-clouds-2011-06-21.jpg') no-repeat fixed center center / cover");		
	}else if(icon_filename === "04n"){
		$("body").css("background","url('https://smokefromthetemple.files.wordpress.com/2011/08/1.jpg') no-repeat fixed center center / cover");
	}else if(icon_filename === "09d"){
		$("body").css("background","url('http://www.weatherwizkids.com/wp-content/uploads/2015/02/rain21.jpg') no-repeat fixed center center / cover");		
	}else if(icon_filename === "09n"){
		$("body").css("background","url('https://kunal24borah.files.wordpress.com/2013/10/rain.jpg') no-repeat fixed center center / cover");		
	}else if(icon_filename === "10d"){
		$("body").css("background","url('http://www.weatherwizkids.com/wp-content/uploads/2015/02/rain21.jpg') no-repeat fixed center center / cover");		
	}else if(icon_filename === "10n"){
		$("body").css("background","url('https://kunal24borah.files.wordpress.com/2013/10/rain.jpg') no-repeat fixed center center / cover");	
	}else if(icon_filename === "11d"){
		$("body").css("background","url('https://i.ytimg.com/vi/m89qAa9HNno/maxresdefault.jpg') no-repeat fixed center center / cover");		
	}else if(icon_filename === "11n"){
		$("body").css("background","url('https://upload.wikimedia.org/wikipedia/commons/a/a4/Cloud_to_ground_lightning_strikes_south-west_of_Wagga_Wagga.jpg') no-repeat fixed center center / cover");		
	}else if(icon_filename === "13d"){
		$("body").css("background","url('http://weknowyourdreams.com/images/snow/snow-08.jpg') no-repeat fixed center center / cover");		
	}else if(icon_filename === "13n"){
		$("body").css("background","url('http://nexus-wallpaper.com/wp-content/uploads/2014/01/snow-bench-lamppost.jpg') no-repeat fixed center center / cover");		
	}else if(icon_filename === "50d"){
		$("body").css("background","url('http://vignette1.wikia.nocookie.net/demigodshaven/images/f/f5/Mist.jpg/revision/latest?cb=20110102163040') no-repeat fixed center center / cover");		
	}else if(icon_filename === "50n"){
		$("body").css("background","url('http://vignette1.wikia.nocookie.net/demigodshaven/images/f/f5/Mist.jpg/revision/latest?cb=20110102163040') no-repeat fixed center center / cover");		
	}
}

function getWindDirection(degrees){
	if(degrees >= 348.75 || degrees < 11.25){
		return "N";
	}else if(degrees >= 11.25 && degrees < 33.75 ){
		return "NNE";
	}else if(degrees >= 33.75 && degrees < 56.25){
		return "NE";
	}else if(degrees >= 56.25 && degrees < 78.75){
		return "ENE";
	}else if(degrees >= 78.75 && degrees < 101.25){
		return "E";
	}else if(degrees >= 101.25 && degrees < 123.75){
		return "ESE";
	}else if(degrees >= 123.75 && degrees < 146.25){
		return "SE";
	}else if(degrees >= 146.25 && degrees < 168.75){
		return "SSE";
	}else if(degrees >= 168.75 && degrees < 191.25){
		return "S";
	}else if(degrees >= 191.25 && degrees < 213.75){
		return "SSW";
	}else if(degrees >= 213.75 && degrees < 236.25){
		return "SW";
	}else if(degrees >= 236.25 && degrees < 258.75){
		return "WSW";
	}else if(degrees >= 258.75 && degrees < 281.25){
		return "W";
	}else if(degrees >= 281.25 && degrees < 303.75){
		return "WNW";
	}else if(degrees >= 303.75 && degrees < 326.25){
		return "NW";
	}else if(degrees >= 326.25 && degrees < 348.75){
		return "NNW";
	}else{
		return "NA";
	}
}

function getWeather(position){
	console.log("Checking Weather for Lat = " + position.coords.latitude + " Long = " + position.coords.longitude);


	var link = "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&units=metric&APPID=07f524d760c454e9352d7ebb1c354d93"

	console.log("Link = " + link);

	jQuery.getJSON(link, function(data){
		console.log("Coords = " + data.coord.lat + "," + data.coord.lon);
		$("#degrees > .digits").html(parseFloat(data.main.temp).toFixed(2).toString());
		$("#location").html(data.name + ", " + data.sys.country);
		$(".icon-image").attr("src","http://openweathermap.org/img/w/"+ data.weather[0].icon + ".png");
		$("#forecast").html(humanize(data.weather[0].description));
		$("#wind").html(getWindDirection(data.wind.deg) + " " + data.wind.speed + " Knots");

		if(window.outerWidth >= 768){
			centerDivs();
		}

		setBackground(data.weather[0].icon);
		console.log("Data = " + JSON.stringify(data));
	});
}



$(document).ready(function(){
	getLocation();
	
	$(".unit").click(changeUnits);

	console.log("Window Size: " + window.outerWidth);

	window.addEventListener("resize",function(event){
		if(window.outerWidth >= 768){
			centerDivs();
		}
	});

});