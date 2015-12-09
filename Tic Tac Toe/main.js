function centerHorizontally(element,original_width){
	var parentWidth = $(element).parent().innerWidth();
	var leftMargin = Math.floor(((parentWidth - original_width)/ 2));

	if(leftMargin < 0){
		element.css("width","100%");
	}else{
		element.css("width",original_width + "px");
		element.css("margin-left",leftMargin + "px");
	}
}

function computerDecision(){
	winCheck();

	if($(".turn").html() === "comp"){
		randomSelection();
		$(".turn").html("user");
	}

	winCheck();
}

function winCheck(){
	//After each turn it checks if anyone won. 
	// If someone won it will outline the winning line, 
	// then add a pop-up to say who won with a button to play again.

	var rows = $(".game-row");
	var win = false;
	var winClass = "";
	var winSign = "";

	//Check each horizontal for a win.
	for(var i = 0; i < 3; i++){
		var row = $(".h-" + i + ":not(.empty)");

		if(!(row.length < 3)){
			if($(row[0]).html() === $(row[1]).html() && $(row[1]).html() === $(row[2]).html()){
				win = true;
				winClass = ".h-" + i;
				winSign = $(row[0]).html();
			}
		}
	}

	//Check each vertical for a win.
	for(var i = 0; i < 3; i++){
		var row = $(".v-" + i + ":not(.empty)");

		if(!(row.length < 3)){
			if($(row[0]).html() === $(row[1]).html() && $(row[1]).html() === $(row[2]).html()){
				win = true;
				winClass = ".v-" + i;
				winSign = $(row[0]).html();
			}
		}
	}

	//Check each diagonal for a win.
	for(var i = 0; i < 2; i++){
		var row = $(".d-" + i + ":not(.empty)");

		if(!(row.length < 3)){		
			if($(row[0]).html() === $(row[1]).html() && $(row[1]).html() === $(row[2]).html()){
				win = true;
				winClass = ".d-" + i;
				winSign = $(row[0]).html();
			}
		}
	}

	if(win){
		$(winClass).css("background-color","green");

		if(winSign === $(".user-selection").html()){
			displayWinner("user");
		}else{
			displayWinner("comp");
		}
	}else{
		if($(".game-cell.empty").length < 1){
			displayWinner("tie");
		}
	}
}

function resetGame(){
	$(".turn").html("comp");
	$(".game-cell").html("");
	$(".pop-up").hide();
	$("#game-heading").html("");
	$("#game-message").html("");
	$("#end-message").addClass("hidden");	
	$(".game-cell").css("background-color","");
	$(".game-cell").addClass("empty");
	console.log("Game reset");

	if($(".turn").html() === "comp"){
		computerDecision();
	}
}

function displayWinner(winner){
	if(winner === "user"){
		console.log("Showing User as winner");
		$(".pop-up").show();
		$("#game-heading").html("Congratulations!");
		$("#game-message").html("Congratulations you won the game!");
		$("#end-message").removeClass("hidden");
	}else if(winner === "comp"){
		$(".pop-up").show();
		$("#game-heading").html("Game Over!");
		$("#game-message").html("Sorry you did not win!");
		$("#end-message").removeClass("hidden");
	}else{
		$(".pop-up").show();
		$("#game-heading").html("No Decision!");
		$("#game-message").html("There is no winner in this game!");
		$("#end-message").removeClass("hidden");
	}
}

function randomSelection(){
	var emptyCells = $(".game-cell.empty");

	if(emptyCells.length < 1){
		console.log("No Moves left");
		return false;
	}

	var number = Math.floor(Math.random() * (emptyCells.length - 1 + 1)) + 1;

	setCell($(emptyCells[number-1]),"comp");

	console.log("Computer goes with " + number);
}

function setCell(cellElement,userType){
	var textCell = "";

	//Check which mark to make (user/computer) and also change the turn
	if(userType === "comp"){
		textCell = $(".comp-selection").html();
		$(".turn").html("user");
	}else{
		textCell = $(".user-selection").html();
		$(".turn").html("comp");
	}

	cellElement.html(textCell);
	cellElement.removeClass("empty");
}

$(document).ready(function(){
	if($(".turn").html() === "comp"){
		computerDecision();
	}

	centerHorizontally($(".pop-up"),300);
	centerHorizontally($(".game"),276);
	centerHorizontally($(".selection"),80);

	$(window).resize(function(){
		centerHorizontally($(".pop-up"),300);
		centerHorizontally($(".game"),276);
		centerHorizontally($(".selection"),80);
	});

	$(".selection .btn").on("click",function(el){
		if($(this).attr("id") === "X"){
			$(".user-selection").html("X");
			$(".comp-selection").html("O");			
		}else{
			$(".comp-selection").html("X");
			$(".user-selection").html("O");	
		}
		
		$("#begin-message").hide();
		$(".pop-up").hide();
	});

	$(".game-cell").on("click",function(el){
		console.log("Clicked Game Cell");

		if($(this).hasClass("empty") && $(".turn").html() === "user"){
			setCell($(this),"user");
			computerDecision();
		}
	});

	$("#reset-game").on("click",function(){
		resetGame();
	});
});