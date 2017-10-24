
/* pong1 v1.1 - Simple JS game made by Esa Koskinen in 54 minutes.

Copyright 2017 Esa Koskinen. All rights reserved.

Source code provided for reference purposes only.
*/

(function() {
	var constants = {
		FPS: 60,
		PADDLE_LENGTH: 50,
		BALL_RADIUS: 4,
	};
	var gameState = {};
	var canvas = document.getElementById("gameCanvas");
	var ctx = canvas.getContext("2d");
	
	
	function initializeGame() {
		gameState = {
			ballX: 0,
			ballY: 0,
			ballSpeed: 0,
			ballDirectionX: 0, // 1 if going right, -1 if left
			paddleLeftY: 250,
			paddleRightY: 250,
			scoreLeft: 0,
			scoreRight: 0,
		};
		
		ballReset();
		
		// Update game status every frame
		window.setInterval(function() {
			update();
		}, 1000/constants.FPS);
	}
	
	function ballReset() {
		gameState.ballX = 310;
		gameState.ballY = 250;
		gameState.ballDirection = Math.random()*16 + 37;
		gameState.ballSpeed = 3.0;
		gameState.ballDirectionX = (Math.random() > 0.5 ? 1 : -1), // 1 if going right, -1 if left
		gameState.ballDirectionY = (Math.random() > 0.5 ? 1 : -1), // 1 if going down, -1 if up
		console.log("Left score:", gameState.scoreLeft, ", right score:", gameState.scoreRight);
	}
	
	window.onkeydown = handleArrowKeys;
	
	function handleArrowKeys(e) {
    	switch(e.keyCode) {
        	case 37: // 37, left, cw
        	break;

        	case 38: // 38
        	gameState.paddleLeftY -= 8;
        	break;

        	case 39: // 39
        	break;

        	case 40: // 40
        	gameState.paddleLeftY += 8;
        	break;

        	default:
        	return; // exit this handler for other keys
        }
    
    	e.preventDefault(); // prevent the default action (scroll / move caret)
	}
	
	// Game loop, called every frame
	function update() {
		checkPaddleCollisions();
		checkWallCollisions();
		
		// paddles
		gameState.paddleRightY += gameState.ballDirectionY * 2.1; // AI
		gameState.paddleLeftY = Math.max(constants.PADDLE_LENGTH / 2, gameState.paddleLeftY);
		gameState.paddleLeftY = Math.min(500 - constants.PADDLE_LENGTH / 2, gameState.paddleLeftY);
		gameState.paddleRightY = Math.max(constants.PADDLE_LENGTH / 2, gameState.paddleRightY);
		gameState.paddleRightY = Math.min(500 - constants.PADDLE_LENGTH / 2, gameState.paddleRightY);
		
		updateBallPosition();
		draw();
	}
	
	function checkPaddleCollisions() {
		if (gameState.ballX < 10) {
			if (Math.abs(gameState.paddleLeftY - gameState.ballY) < constants.PADDLE_LENGTH / 2) {
				gameState.ballDirectionX = 1;
				gameState.ballSpeed += 0.22;
			}
		} else if (gameState.ballX > 610) {
			if (Math.abs(gameState.paddleRightY - gameState.ballY) < constants.PADDLE_LENGTH / 2) {
				gameState.ballDirectionX = -1;
				gameState.ballSpeed += 0.22;
			}
		}
	}
	
	function checkWallCollisions() {
		if (gameState.ballY < 4)
			gameState.ballDirectionY = 1;
		if (gameState.ballY > 496)
			gameState.ballDirectionY = -1;
		if (gameState.ballX < 0) {
			gameState.scoreRight += 1;
			ballReset();
		}
		if (gameState.ballX > 620) {
			gameState.scoreLeft += 1;
			ballReset();
		}
			
	}
	
	function draw() {
	
		ctx.beginPath();
		ctx.rect(0, 0, 2000, 2000);
		ctx.fillStyle = "#FFFFFF";
		ctx.fill();
		ctx.closePath();
    
		// Border
		ctx.beginPath();
		ctx.rect(0, 0, 620, 500);
		ctx.fillStyle = "#000000";
		ctx.stroke();
		ctx.closePath();
	
		// Left paddle, right paddle
		ctx.beginPath();
		ctx.rect(2, gameState.paddleLeftY - (constants.PADDLE_LENGTH / 2), 10, constants.PADDLE_LENGTH);
		ctx.fillStyle = "#000000";
		ctx.fill();
		ctx.closePath();
		
		
		ctx.beginPath();
		ctx.rect(608, gameState.paddleRightY - (constants.PADDLE_LENGTH / 2), 10, constants.PADDLE_LENGTH);
		ctx.fillStyle = "#000000";
		ctx.fill();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.arc(gameState.ballX, gameState.ballY, constants.BALL_RADIUS, 0, 2*Math.PI);
		ctx.fillStyle = "#000000";
		ctx.fill();
		ctx.closePath();
		
		ctx.fillText("Left score: " + gameState.scoreLeft + ", right score: " + gameState.scoreRight,200,10);
	}
	
	function updateBallPosition() {
			gameState.ballX += gameState.ballDirectionX * (gameState.ballSpeed * 0.7);
			gameState.ballY += gameState.ballDirectionY * (gameState.ballSpeed * 0.7);
	}
	
	initializeGame();
	
})();