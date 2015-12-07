var JSONP = (function(){ 'use strict';
    var counter = 0;

    var memoryleakcap = function() {
        if (this.readyState && this.readyState !== "loaded" && this.readyState !== "complete") { return; }

        try {
            this.onload = this.onreadystatechange = null;
            this.parentNode.removeChild(this);
        } catch(ignore) {}
    };

    return function(url, callback) {

        var uniqueName = 'callback_json' + (++counter);

        var script = document.createElement('script');
        script.src = url + (url.toString().indexOf('?') === -1 ? '?' : '&') + 'callback=' + uniqueName;
        script.async = true;

        window[ uniqueName ] = function(data){
            callback(data);
            window[ uniqueName ] = null;
            try { delete window[ uniqueName ]; } catch (ignore) {}
        };

        script.onload = script.onreadystatechange = memoryleakcap;

        document.getElementsByTagName('head')[0].appendChild( script );

        return uniqueName;
    };
}());

function fixPadding(){
	var news = $("#news");
	var itemFeed = $(".feed-item");
	var newsSize = news.innerWidth();
	var leftPad = Math.floor((newsSize % 234) / 2);

	news.css("padding-left",leftPad + "px");

	console.log("Added leftPad of " + leftPad + "px");
}

function searchWikipedia(term,random){
	if(!(typeof(random) === "boolean")){
		var random = false;
	}

	var encoded = encodeURIComponent(term);

	JSONP("https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=" + encoded,function(data){

		var results = $("#results");
		var pages = data.query.pages;

		results.html("");

		if(random){
			var randomPage = Math.floor(Math.random() * Object.keys(pages).length);
			console.log(Object.keys(data.query.pages));
			console.log("Random Number: " + randomPage);
			pages = {"random": pages[Object.keys(pages)[randomPage]]};
			console.log(pages);
		}

		for(var i in pages){
			console.log("Iterating page " + i);
			var resultItem = pages[i];
			var a = $("<a href='' target='_blank' class='result'></a>");
			var div = $("<div class='col-xs-12'></div>");
			var header = $("<h4></h4>");
			var text = $("<p></p>");

			a.attr("href","http://en.wikipedia.org/?curid="+resultItem.pageid);
			header.html(resultItem.title);
			text.html(resultItem.extract);

			results.append(a.append(div.append(header).append(text)));
		}
	});
}

function centerVertically(element){
	var windowHeight = window.innerHeight;
	var padding = Math.floor((windowHeight/2)) - 70;
	var results = $(".result");

	console.log("Centering");

	if(!(results.length  > 0)){
		element.css("margin-top",padding + "px");
		console.log("Centered");
	}
}

function searchAhead(term){
	var encoded = encodeURIComponent(term);

	JSONP("https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=" + encoded,function(data){
		var title = data.query.pages[Object.keys(data.query.pages)[0]].title;
		
	});
}

$(document).ready(function(){
	centerVertically($(".content"));

	$("input.search").val("");

	//Animation
	$(".fa-search").click(function(){
		$(".fa-search").animate({
			width: "33px",
			height: "36px"
		},200,function(){
			console.log("Animation Complete");
			$(".fa-search").addClass("hidden");
			$("input.search").removeClass("hidden");
			$("input.search").css("width","33px");
			$("input.search").css("height","36px");
			
			$("input.search").animate({
				width: "250px"
			},250,function(){
				//Then run the x animation
				console.log("Animation of input bar complete");
				$(".fa-times").removeClass("hidden");
				$("#lucky-search").removeClass("hidden");
			});
		});

		$(".search-section").addClass("enabled");
		$(".search-section").removeClass("disabled");
	});

	$(".fa-times").click(function(){
		$(".fa-times").addClass("hidden");
		$("input.search").animate({
			width: "32px"
		},250,function(){
			$("input.search").addClass("hidden");
			$("#lucky-search").addClass("hidden");
			$(".fa-search").removeClass("hidden");
			$(".fa-search").animate({
				width: "39px", height: "42px"
			},200,function(){
				$(".fa-search").css("width","39px");
				$(".fa-search").css("height","42px");
			});
		});

		$(".search-section").addClass("disabled");
		$(".search-section").removeClass("enabled");
		$("input.search").val("");
		$("#results").html("");

		$(".help-text").removeClass("hidden");
		centerVertically($(".content"));
	});

	$(document).keypress(function(e){
		if(e.which == 13){
			if($(".search-section").hasClass("enabled")){
				if($("input.search").val().length > 0){
					console.log("Starting Search");
					searchWikipedia($("input.search").val(),false);

					if(!($(".help-text").hasClass("hidden"))){
						$(".help-text").addClass("hidden");
					}

					$(".content").css("margin-top","25px");
				}
			}
		}
	});

	$("#lucky-search").click(function(e){
		e.preventDefault();
		if($(".search-section").hasClass("enabled")){
			if($("input.search").val().length > 0){
				searchWikipedia($("input.search").val(),true);

				if(!($(".help-text").hasClass("hidden"))){
					$(".help-text").addClass("hidden");
				}

				$(".content").css("margin-top","25px");
			}
		}
	});

	$(window).resize(function(){
		centerVertically($(".content"));
	});

});