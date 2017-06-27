var button = document.querySelector("button");
var username = document.querySelector("[type=\'text\']");
var password = document.querySelector("[type=\'password\']");
var logout = document.querySelector(".logout");
var ws;

var wsSessionData = JSON.parse(localStorage.getItem("session"));

button.addEventListener("click", function(e){
    e.preventDefault();

    var http = new XMLHttpRequest();
    var url = "auth/login";
    var params = {"username":username.value, "password":password.value};
    http.open("POST", url, true);
    
    http.setRequestHeader("Content-type", "application/json");
    
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            console.log(http.response);
            localStorage.setItem("session", JSON.stringify(http.response));
            //connectToSocket(http.response);
            readyChatBox();
        }
    }
    http.send(JSON.stringify(params));
});

function readyChatBox(){
    $("form").addClass("bounceOut");
    setTimeout(function(){
        $(".main.left").addClass("chat_container");
    }, 500);

    setTimeout(function(){
        $(".main.right").addClass("show");
    }, 600);
}

$(".input-field input").on("focus", function(e){
    $(this).addClass("active");
    $(this).parent().children("label").addClass("active");
});

$(".input-field input").on("blur", function(e){
    var val = $.trim($(this).val());
    if (!val) {
        $(this).parent().children("label").removeClass("active");
        $(this).removeClass("active");

        $(".input-field input").val(function( index, value ) {
            return value.trim();
        });
    }
});

//on start up
$(document).ready(function(){
    setTimeout(function(){
        if($(".input-field input").val()){
            $(".input-field input").addClass("active");
            $(".input-field input").parent().children("label").addClass("active");
        }
    }, 200);

    if(wsSessionData !== null) readyChatBox();
});

logout.addEventListener("click", function(e){
    console.log(wsSessionData);
    var http = new XMLHttpRequest();
    var url = "auth/logout";
    http.open("POST", url, true);
    
    http.setRequestHeader("Content-type", "application/json");
    
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            console.log(http.response);
            localStorage.removeItem("session");
            location.reload(true);
        }
    }
    http.send(wsSessionData);
});

//ripplr effect
$(".logout").click(function (e) {
  // Remove any old one
  $(".ripple").remove();
  // Setup
  var posX = $(this).offset().left,
      posY = $(this).offset().top,
      buttonWidth = $(this).width(),
      buttonHeight =  $(this).height();
  // Add the element
  $(this).prepend("<span class='ripple'></span>");
 // Make it round!
  if(buttonWidth >= buttonHeight) {
    buttonHeight = buttonWidth;
  } else {
    buttonWidth = buttonHeight; 
  }
  // Get the center of the element
  var x = e.pageX - posX - buttonWidth / 2;
  var y = e.pageY - posY - buttonHeight / 2;
  // Add the ripples CSS and start the animation
  $(".ripple").css({
    width: buttonWidth,
    height: buttonHeight,
    top: y + 'px',
    left: x + 'px'
  }).addClass("rippleEffect");
});

function connectToSocket(token){
    ws = new WebSocket("ws://my_token@127.0.0.1:8080");
    ws.onopen = function (event) {
        ws.send("Here's some text that the server is urgently awaiting!"); 
    };
}
function sendText() {
    // Construct a msg object containing the data the server needs to process the message from the chat client.
    var clientID = "emmanuel";
    var msg = {
        type: "message",
        text: document.getElementById("text").value,
        id:   clientID,
        date: Date.now()
    };
    // Send the msg object as a JSON-formatted string.
    ws.send(JSON.stringify(msg));
    // Blank the text input element, ready to receive the next line of text from the user.
    document.getElementById("text").value = "";
}

// ws.onmessage = function (event) {
//     console.log(event.data);
// }