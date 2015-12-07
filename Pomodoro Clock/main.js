var counter;

function changeTime(event){
  event.preventDefault();

  if($("#counter-display").hasClass("in-session")){
    return false;
  }else{
    var elementId = $(this).attr("id").split("_");
    elementId = "#" + elementId[1] + "_" + elementId[2];

    var length = parseInt($(elementId).html());

    if($(this).attr("id").indexOf("increase") > -1){
      length += 1;
    }else{
      length -= 1;
    }

    if(length < 0){
      length = 0;
    }

    if(length < 10){
      $(elementId).html("0" + length.toString());

      if($(elementId).attr("id").indexOf("session") > -1){
        $("#break-message").html("Session");
        $("#counter").html("0" + length.toString()); 
      }

    }else{
      $(elementId).html(length.toString());

      if($(elementId).attr("id").indexOf("session") > -1){
        $("#break-message").html("Session");
        $("#counter").html(length.toString()); 
      }
    }

    return length;
  }
}

function decrementDisplay(){
  var mm = parseInt($("#counter").html().split(":")[0]);
  var ss = ($("#counter").html().indexOf(":") > -1) ? parseInt($("#counter").html().split(":")[1]) : 00;

  console.log("MM = " + mm + " SS = " + ss);

  var total_time = ($("#break-message").html().indexOf("Break!") < 0) ? parseFloat($("#session_length").html()) : parseFloat($("#break_length").html());
  console.log("Total Time: " + total_time);

  if(ss <= 0){
    if(mm <= 0){
      stopTimer(counter);

      if($("#break-message").html().indexOf("Break!") < 0){

        $("#break-message").html("Break!");
        $("#counter").html($("#break_length").html());
        counter = startTimer();
        console.log("Start Break!");
      }else{
        $("#counter").html($("#session_length").html());
        $("#break-message").html("Session");
        counter = startTimer();
        console.log("Start Timer");
      }

    }else{
      ss = 59;
      mm -= 1;

      ss = ss < 10 ? "0" + ss.toString() : ss.toString();
      mm = mm < 10 ? "0" + mm.toString() : mm.toString();

      console.log("SS = " + ss + " MM = " + mm);

      $("#counter").html(mm + ":" + ss);

      var background_value = parseFloat(mm) + parseFloat(ss)/60;
      background_value = 100.00 - (background_value * 100.00 / total_time);

      $('.fill').css("height",background_value.toString() + "%");
      console.log(background_value.toString() + "%");
    }
  }else{
    ss -= 1;
    
    ss = ss < 10 ? "0" + ss.toString() : ss.toString();
    mm = mm < 10 ? "0" + mm.toString() : mm.toString();

    $("#counter").html(mm + ":" + ss);

    var background_value = parseFloat(mm) + parseFloat(ss)/60;
    background_value = 100.00 - (background_value * 100.00 / total_time);

    $('.fill').css("height",background_value.toString() + "%");

  }

  return 0;
}

function startTimer(){
  return setInterval(decrementDisplay,1000);
}

function stopTimer(){
  return clearInterval(counter);
}

$(document).ready(function(){

  $('#decrease_break_length').click(changeTime);
  
  $('#increase_break_length').click(changeTime);
  
  $('#decrease_session_length').click(changeTime);
  
  $('#increase_session_length').click(changeTime);

  $("#counter-display").click(function(e){
    e.preventDefault();
    
    if($("#counter-display").hasClass("in-session")){
      // Stop timer
      stopTimer(counter);
      $("#counter-display").removeClass("in-session");
      console.log("Timer Stopped");
    }else{
      $("#counter-display").addClass("in-session");
      counter = startTimer();
    }
  });
})