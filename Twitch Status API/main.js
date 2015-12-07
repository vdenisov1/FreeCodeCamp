var JSONP = (function(){ 'use strict';
    var counter = 0;

    var memoryleakcap = function() {
        if (this.readyState && this.readyState !== "loaded" && this.readyState !== "complete") { return; }

        try {
            this.onload = this.onreadystatechange = null;
            this.parentNode.removeChild(this);
        } catch(ignore) {}
    };

    return function(user, callback, stream = true) {
    	var url = "";

    	if(stream){
    		url += "https://api.twitch.tv/kraken/streams/" + user;
    	}else{
    		url = "https://api.twitch.tv/kraken/channels/" + user;
    	}

        var uniqueName = 'callback_json' + (++counter);

        var script = document.createElement('script');
        script.src = url + (url.toString().indexOf('?') === -1 ? '?' : '&') + 'callback=' + uniqueName;
        script.async = true;

        window[ uniqueName ] = function(data){
        	data.name = user;
        	//console.log("Data = " + JSON.stringify(data));
            callback(data);
            window[ uniqueName ] = null;
            try { delete window[ uniqueName ]; } catch (ignore) {}
        };

        script.onload = script.onreadystatechange = memoryleakcap;

        document.getElementsByTagName('head')[0].appendChild( script );

        return uniqueName;
    };
}());

function addUser(user){
	var userExists = (user.status == 422) ? false : true;
	var usersDiv = jQuery('.twitch-users');

	if(userExists){
		var userOnline = (user.stream == null) ? false : true;
		var link = "https://twitch.tv/" + user.name;

		console.log("User = " + user.name);
		console.log("User Online = " + userOnline);

		if(userOnline){
			var streamTitle = user.stream.game;
			
			if(streamTitle.length > 27){
				streamTitle = streamTitle.slice(0,26) + " ....";
			}			

			console.log("Data : " + JSON.stringify(user));

			usersDiv.append("<a target='_blank' id='" + user.name.toLowerCase() + "' class='a-user online' href='" + link + "'><li class='user'><img class='profile-icon' alt='pic' src='" + user.stream.channel.logo + "'></img><div class='username'>" + user.name + "<span class='stream-title'>" + streamTitle + "</span></div><i class='fa fa-check user-status green'></i></li></a>");
		}else{

			JSONP(user.name,function(data){
				var logo = (data.logo == null) ? "http://www.extrapackofpeanuts.com/wp-content/uploads/2013/09/question-mark-face.gif" : data.logo;
				var noLogoClass = (data.logo == null) ? "no-logo" : ""
				usersDiv.append("<a target='_blank' id='" + data.name.toLowerCase() + "' class='a-user offline' href='" + link + "'><li class='user'><img class='profile-icon " + noLogoClass + "' alt='' src='" + logo + "'></img><div class='username'>" + data.name + "</div><i class='fa fa-exclamation user-status'></i></li></a>");
			},false);
		}
	}else{
		var logo = "http://www.extrapackofpeanuts.com/wp-content/uploads/2013/09/question-mark-face.gif";
		usersDiv.append("<a target='_blank' id='" + user.name.toLowerCase() + "' class='a-user offline inactive' href='" + link + "'><li class='user'><img class='profile-icon " + noLogoClass + "' alt='' src='" + logo + "'></img><div class='username'>" + user.name + "</div><i class='fa fa-times user-status red'></i></li></a>");
	}
}

function filterUsers(type){
	var allUsers = $('.twitch-users .a-user');
	
	allUsers.hide();

	var filter = (type === "all") ? allUsers.show() : $('.twitch-users .a-user.' + type).show();

	return;
}


$(document).ready(function(){

	$(".search-bar > input").val("");

	var users = ["FreeCodeCamp", "Storbeck", "TeraKilobyte", "Habathcx","RobotCaleb","ThomasBallinger","Noobs2Ninjas","Beohoff","Comster404","Brunofin","Medrybw"];

	for(var i = 0; i < users.length; i++){
		//console.log("User Name = " + users[i]);

		//var userName = users[i];

		//console.log("userName = " + userName)

		JSONP(users[i],function(data){

			//console.log("Data Name = " + data.name + " Should be " + data.name);

			addUser(data);
		});
	}

	$('.menu-button').click(function(){
		var button = $(this);
		var previousButton = $(".menu-button.active");

		//console.log(previousButton.attr('id'));

		previousButton.removeClass("active");

		button.addClass("active");

		filterUsers(button.attr('id'));
	});

	$('.search-bar > input').on('input',function(){
		
		var input = $(this).val().toLowerCase();
		var filter = $(".menu-button.active").attr('id');

		//console.log("Value Now = " + input + " Length Now = " + input.length);

		if(input.length > 0){
			//console.log("Finding = " + input.val());
			$(".twitch-users > a").hide();

			if(filter === "all"){
				$(".twitch-users > a[id*='" + input + "']").show();
			}else{
				$(".twitch-users > a." + filter + "[id*='" + input + "']").show();
			}
		}else{
			//console.log("Showing all " + filter + " Users");
			$(".twitch-users > a").hide();
			filterUsers(filter);
		}
	});

});