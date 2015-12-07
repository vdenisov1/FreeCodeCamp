function initFeed(data){
	var newsFeed = $("#news");

	

	//Cycle through each news item.
	for(var i = 0; i < data.length; i++){

		console.log("Cycling through feed = " + i);
		
		var newsItem = data[i];
		var item = $("<div class='feed-item'></div>");
		var articleLink = $("<a href='#' target='_blank' class='article-link'></a>");
		var profilePic = $("<img src='#' class='profile-pic'/>");
		var newsTitle = $("<div class='news-title'></div>");
		var socialDiv = $("<div class='social'></div>");
		var likeCount = $("<div class='like-count'><i class='fa fa-heart fa-1 icon'></i> </div>");
		var discussButton = $("<a href='#' target='_blank' class='discuss btn btn-info btn-xs'>Discuss</a>");
		var dateStamp = $("<div class='datestamp'><b>Posted on: </b></div>");
		var authorLink = $("<a href='#' target='_blank' class='author-link'>by - </a>");


		item.attr("id",newsItem.id);
		articleLink.attr("href",newsItem.link);
		profilePic.attr("src",newsItem.author.picture);
		newsTitle.html(formatTitle(newsItem.headline,10));
		articleLink.attr("title",newsItem.headline);
		likeCount.append(newsItem.upVotes.length);
		discussButton.attr("href","https://www.freecodecamp.com/news/" + newsItem.storyLink.replace(" ","-"));
		dateStamp.append(formatDateString(newsItem.timePosted));
		authorLink.attr("href","https://www.freecodecamp.com/" + newsItem.author.username);
		authorLink.append(newsItem.author.username);

		//Setup the html inside the items feed div.
		item.append(articleLink.append(profilePic).append(newsTitle)).append(authorLink).append(socialDiv.append(likeCount).append(discussButton)).append(dateStamp);

		//Append the html into the newsfeed div
		newsFeed.append(item);
	}
}

function formatTitle(str,charLength){
	return str.slice(0,charLength) + " ...";
}

function formatDateString(timestamp){
	var t = new Date(timestamp);
	var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

	return days[t.getDay()] + ", " + t.getDate() + " " + months[t.getMonth()] + " " + t.getFullYear();
}

function fixPadding(){
	var news = $("#news");
	var itemFeed = $(".feed-item");
	var newsSize = news.innerWidth();
	var leftPad = Math.floor((newsSize % 234) / 2);

	news.css("padding-left",leftPad + "px");

	console.log("Added leftPad of " + leftPad + "px");
}

// <div class="feed-item">
// 	<a href="http://ma.tt/2015/11/dance-to-calypso/" class="article-link">
// 		<img src="https://avatars.githubusercontent.com/u/8016212?v=3" alt="" class="profile-pic">
// 		<div class="news-title">Amazing News! New Wo..</div>
// 	</a>
// 	<a href="http://www.freecodecamp.com/kallaway" class="author-link">by - kallaway</a>
// 	<div class="social">
// 		<div class="like-count"><i class="fa fa-heart fa-1 icon"></i> 19</div>
// 		<a href="http://www.freecodecamp.com/news/amazing-news-new-wordpress-is-written-in-nodejs-and-react" class="discuss btn btn-info btn-xs">Discuss</a>
// 	</div>
// 	<div class="datestamp"><b>Posted on:</b> Mon, 23 Nov 2015</div>
// </div>


$(document).ready(function(){
	console.log("Document ready");

	$.getJSON("http://www.freecodecamp.com/news/hot",function(data){
		initFeed(data)
	});
	
	fixPadding();	

	$(window).resize(fixPadding)

});