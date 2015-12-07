function buttonToDisplay(){
	var display = $(".calculator .display");
	var hasDecimal = (display.html().indexOf(".") < 0) ? false : true;
	var isDecimal = ($(this).html().indexOf(".") < 0) ? false : true;
	
	//If it is a decimal then check to see if display already has a decimal. If it does then no need to do anything.
	if(isDecimal){
		if(!(hasDecimal)){
			display.append($(this).html());
		}
	}else{
		display.append($(this).html());	
	}
}

function storeChain(){
	// First check to see if an operation chain already exists. Then if it does exist 
	//  check to see if the last piece of the chain is already an operation, if so then 
	//  just revise the last operation to the recently pressed operation.
	// **** If there is no chain already do nothing since the first input of a chain must be a number, not an operand.

	var chain = $("#chain");
	var display = $(".calculator .display");

	if(chain.length){

		var lastChainInput = $("#chain .input:last");

		if(display.html() == ""){
			lastChainInput.html($(this).attr("id"));
		}else{
			$("#chain").append("<div class='digit'>" + display.html() + "</div>");
			
			if($(this).attr("id") != "equal"){
				$("#chain").append("<div class='operation'>" + $(this).attr('id') + "</div>");
			}

			clearDisplay();
		}
	}else{
		if(display.html() != ""){
			console.log("Display is not empty");

			$("#calculations").html("<div id='chain'></div>");
			$("#chain").append("<div class='digit'>" + display.html() + "</div>");
			
			if($(this).attr("id") != "equal"){
				$("#chain").append("<div class='operation'>" + $(this).attr('id') + "</div>");
			}
			clearDisplay();
		}
	}
}

function clearDisplay(){
	var display = $(".calculator .display");
	display.html("");
}

function clearChain(){
	$("#chain").remove();
	clearDisplay();
}

function calculation(){
	storeChain();

	var chain = $("#chain > div");
	var display = $(".calculator .display");
	var calculationString = "";

	if(chain.length){
		chain.each(function(index,element){

			if($(element).hasClass("operation")){
				switch($(element).html()){
					case "modulo":
						calculationString += "%";
						break;
					case "divide":
						calculationString += "/";
						break;
					case "minus":
						calculationString += "-";
						break;
					case "add":
						calculationString += "+";
						break;
					case "multiply":
						calculationString += "*";
						break;
					default:
						break;

				}
			}else{
				calculationString += $(element).html();
			}
		});
	}
	
	clearChain();
	display.html(eval(calculationString).toString());
}

$(document).ready(function(){
	$(".button.digit").click(buttonToDisplay);
	$(".button.operator").click(storeChain);
	$(".button#AC").click(clearDisplay);
	$(".button#CE").click(clearChain);
	$(".button#equal").click(calculation);
});