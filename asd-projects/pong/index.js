/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()

function runProgram() {
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  const BOARD_WIDTH = parseFloat($("#board").css("width"));
  const BOARD_HEIGHT = parseFloat($("#board").css("height"));

  // Game Item Objects
  // declares the gameItems as objects
  var leftPaddle = declareItems("#leftPaddle");
  var rightPaddle = declareItems("#rightPaddle");
  var ball = declareItems("#ball");
  var firstPlayerScore = 0;
  var secondPlayerScore = 0;
  // creates objects for each on-screen item other than score
  function declareItems(id) {
    var gameItem = {};
    gameItem.id = id;
    gameItem.x = parseFloat($(id).css("left"));
    gameItem.y = parseFloat($(id).css("top"));
    gameItem.speedX = 0;
    gameItem.speedY = 0;
    gameItem.width = parseFloat($(id).css("width"));
    gameItem.height = parseFloat($(id).css("height"));
    return gameItem;
  }
  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);
  $(document).on('keyup', handleKeyUp);                        // change 'eventType' to the type of event you want to handle
  // calls startball
  startBall()
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    moveObject(leftPaddle);
    moveObject(rightPaddle);
    moveObject(ball);
    wallCollision(leftPaddle);
    wallCollision(rightPaddle);
    wallCollision(ball);
    detectPaddleCollision(ball);
    if (firstPlayerScore >= 15 || secondPlayerScore >= 15){
      endGame();
    }
  }

  /* 
  Called in response to events.
  */
  var KEY = {
    "UP": 38,
    "DOWN": 40,
    "W": 87,
    "D": 83
  }
  // handles pushing a key down
  function handleKeyDown(event) {
    if (event.which === KEY.UP) {
      rightPaddle.speedY = -7;
    }
     if (event.which === KEY.DOWN) {
      rightPaddle.speedY = 7;
    }
     if (event.which === KEY.W) {
      leftPaddle.speedY = -7;
    }
     if (event.which === KEY.D) {
      leftPaddle.speedY = 7;
    }
  }
  // handles letting a key go
  function handleKeyUp(event) {
    if (event.which === KEY.UP) {
      rightPaddle.speedY = 0;
    }
     if (event.which === KEY.DOWN) {
      rightPaddle.speedY = 0;
    }
     if (event.which === KEY.W) {
      leftPaddle.speedY = 0;
    }
     if (event.which === KEY.D) {
      leftPaddle.speedY = 0;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // starts moving the ball
  function startBall() {
    ball.x = 210;
    ball.y = 210;
    ball.speedX = (Math.random() * 3 + 2) * (Math.random() > 0.5 ? -1 : 1);
    ball.speedY = (Math.random() * 3 + 2) * (Math.random() > 0.5 ? -1 : 1);
  }
  // collides objects with walls
 function wallCollision(object){
  if (object.x + object.width >= BOARD_WIDTH){
    firstPlayerScore += 1
    $("#firstPlayerScore").text("Score: " + firstPlayerScore)
    startBall()
  }
  if (object.x <= 0){
    secondPlayerScore += 1;
    $("#secondPlayerScore").text("Score: " + secondPlayerScore);
    startBall();
  }
  if (object.y + object.height >= BOARD_HEIGHT){
    object.y -= object.speedY
    object.speedY *= -1;
  }
  if (object.y <= 0){
    object.y -= object.speedY
    object.speedY *= -1;
  }

 }
 // detects wall collisions
  function detectPaddleCollision(object){
    if (doCollide(ball, leftPaddle)){
      object.speedX *= -1;
    }
    if (doCollide(ball, rightPaddle)){
      object.speedX *= -1;
    }
  }
  function doCollide(obj1, obj2){
    if (obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height  > obj2.y){
      return true;
    }
    else {
      return false;
    }
  }
  // changes the position of an object
  function moveObject(object) {
    object.x += object.speedX;
    object.y += object.speedY;
    $(object.id).css("left", object.x);
    $(object.id).css("top", object.y);
  }
  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }

}
