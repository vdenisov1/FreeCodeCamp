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


	if(parentWidth < original_width){
		console.log("Parent width > original_width");
		console.log("Parent Width: " + parentWidth + " Original: " + original_width);
		element.css("width",(parentWidth - 30) + "px");
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

function checkHorizontal(typeCheck){
	if(typeCheck === "opp" || typeCheck === "comp"){
		//Check each horizontal for a win.
		for(var i = 0; i < 3; i++){
			var row = $("." + typeCheck + ".h-" + i + ":not(.empty)");
			var otherCell = $(".empty.h-" + i);

			if(row.length > 1 && otherCell.length > 0){
				//Block is required
				return "#" + otherCell.attr("id");
			}
		}
	}else{
		//Check each horizontal for a win.
		for(var i = 0; i < 3; i++){
			var row = $(".h-" + i + ":not(.empty)");

			if(!(row.length < 3)){
				if($(row[0]).html() === $(row[1]).html() && $(row[1]).html() === $(row[2]).html()){
					win = true;
					winClass = ".h-" + i;
					winSign = $(row[0]).html();
					return true;
				}
			}
		}
	}

	return false;
}

function checkVertical(typeCheck){
	if(typeCheck === "opp" || typeCheck === "comp"){
		//Check each vertical for a win.
		for(var i = 0; i < 3; i++){
			var row = $("." + typeCheck + ".v-" + i + ":not(.empty)");
			var otherCell = $(".empty.v-" + i);

			if(row.length > 1 && otherCell.length > 0){
				//Block is required
				return "#" + otherCell.attr("id");
			}
		}
	}else{
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
	}

	return false;
}

function checkDiagonal(typeCheck){
	if(typeCheck === "opp" || typeCheck === "comp"){
		//Check each vertical for a win.
		for(var i = 0; i < 2; i++){
			var row = $("." + typeCheck + ".d-" + i + ":not(.empty)");
			var otherCell = $(".empty.d-" + i);

			if(row.length > 1 && otherCell.length > 0){
				//Block is required
				return "#" + otherCell.attr("id");
			}
		}
	}else{
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
	}

	return false;
}

function winCheck(){
	//After each turn it checks if anyone won. 
	// If someone won it will outline the winning line, 
	// then add a pop-up to say who won with a button to play again.


	//Check for a horizontal win
	checkHorizontal();

	//Check for a vertical win
	checkVertical();

	//Check each diagonal for a win.
	checkDiagonal();

	if(win){
		$(winClass).css("background-color","#fae596");

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

function blockOpponent(){
	var horizontal = checkHorizontal("opp");
	var vertical = checkVertical("opp");
	var diagonal = checkDiagonal("opp");

	if(!(horizontal === false)){
		console.log("Block required in " + horizontal);
		setCell($(horizontal),"comp");
		return true;
	}else if(!(vertical === false)){
		console.log("Block required in " + vertical);
		setCell($(vertical),"comp");
		return true;
	}else if(!(diagonal === false)){
		console.log("Block required in " + diagonal);
		setCell($(diagonal),"comp");
		return true;
	}else{
		return false;
	}
}

function checkForWin(){
	var horizontal = checkHorizontal("comp");
	var vertical = checkVertical("comp");
	var diagonal = checkDiagonal("comp"); 

	if(!(horizontal === false)){
		console.log("Win opportunity in " + horizontal);
		setCell($(horizontal),"comp");
		return true;
	}else if(!(vertical === false)){
		console.log("Win opportunity in " + vertical);
		setCell($(vertical),"comp");
		return true;
	}else if(!(diagonal === false)){
		console.log("Win opportunity in " + diagonal);
		setCell($(diagonal),"comp");
		return true;
	}else{
		return false;
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
	$(".game-cell").removeClass("opp");
	$(".game-cell").removeClass("comp");
	win = false;
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
	if(checkForWin()){
		//First check if you have an opportunity to win.
		return false;
	}else if(blockOpponent()){
		//Second check is the oppenent needs to be blocked.
		return false;
	}else{
		var emptyCells = $(".game-cell.empty");

		if(emptyCells.length < 1){
			console.log("No Moves left");
			return false;
		}

		var number = Math.floor(Math.random() * (emptyCells.length - 1 + 1)) + 1;

		setCell($(emptyCells[number-1]),"comp");

		console.log("Computer goes with " + number);
	}
}

function setCell(cellElement,userType){
	var textCell = "";
	var addOppClass = "comp";

	//Check which mark to make (user/computer) and also change the turn
	if(userType === "comp"){
		textCell = $(".comp-selection").html();
		$(".turn").html("user");
		console.log("Computer set an " + textCell);
	}else{
		textCell = $(".user-selection").html();
		addOppClass = "opp";
		$(".turn").html("comp");
		console.log("User set an " + textCell);
	}

	console.log("Comp Set to : " + $(".comp-selection").html());

	cellElement.html(textCell);
	cellElement.addClass(addOppClass);
	cellElement.removeClass("empty");
}

$(document).ready(function(){
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

		if($(".turn").html() === "comp"){
			computerDecision();
		}
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