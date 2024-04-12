const buttonColours = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];

let started = false;
let level = 0;
let highScore;

//load user's high score
$(window).on("load", function () {
  retrieveHighScore();
});

//determine next colour in game, keep track of user's click pattern and animate button chosen for user.
function nextSequence() {
  userClickedPattern = [];

  level = level += 1;
  $("h1").text("Level " + level);

  let randomNumber = Math.floor(Math.random() * 4);
  let randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);
  playSound(randomChosenColour);
}

//detects when user has started a game
$(document).keypress(function () {
  if (!started) {
    $("h1").text("Level " + level);
    nextSequence();
    started = true;
  }
});

//detects the colour the user has clicked and checks if matches the randomly generated pattern (gamePattern)
$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
});

//play specific sound based on which colour is selected
function playSound(name) {
  let audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

//animation for user's click of button
function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");

  setTimeout(function () {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

//function to check user's recent answer is correct and sequence matches the game pattern and if correct, activate the function to determine the next colour in the pattern. If incorrect, wrong answer noises and styling occur, user's score is saved to storage (if a high score), new score retrieved and function to reset the game activated.
function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    saveHighScore();

    let audio = new Audio("sounds/wrong.mp3");
    audio.play();

    $("body").addClass("game-over");
    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);
    $("h1").text("GAME OVER - press any key to restart");

    retrieveHighScore();

    startOver();
  }
}

//reset level, game pattern sequence and whether a game has been started
function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}

//save user's score to high score
function saveHighScore() {
  if (level > highScore) {
    localStorage.setItem("highScore", level);
  } else {
    console.log("Better luck next time!");
  }
}

//retrieve user's high score
function retrieveHighScore() {
  highScore = JSON.parse(localStorage.getItem("highScore")) || 0;
  $("h3").text(highScore);
}
