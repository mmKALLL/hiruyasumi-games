
/* click v1.1 - Simple JS game made by Esa Koskinen in 45 minutes.

Copyright 2017 Esa Koskinen. All rights reserved.

Source code provided for reference purposes only.
*/

(function() {
	var constants = {
		FPS: 60,
		TARGET_RADIUS: 60,
		INITIAL_TIME: 8500,
		CANVAS_WIDTH: 620,
		CANVAS_HEIGHT: 500,
	};
	var gameState = {};
	var canvas = document.getElementById("gameCanvas");
	var ctx = canvas.getContext("2d");


	function initializeGame() {
		gameState = {
			targetX: 0,
			targetY: 0,
			score: 0,
			maxTime: constants.INITIAL_TIME / constants.FPS,
			time: constants.INITIAL_TIME / constants.FPS,
		};

		setTarget();

		// Update game status every frame
		window.setInterval(function() {
			update();
		}, 1000/constants.FPS);
	}

	document.addEventListener("click", function(e) {
		var x = e.clientX - canvas.getBoundingClientRect().left;
		var y = e.clientY - canvas.getBoundingClientRect().top;
		var distance = Math.sqrt(Math.pow(gameState.targetX - x, 2) + Math.pow(gameState.targetY - y, 2));
		if (distance < constants.TARGET_RADIUS)
			handleHit();
		else
			gameEnd();
	});

	// Game loop, called every frame
	function update() {
		gameState.time -= 1;
		if (gameState.time <= 0) {
			gameEnd();
		}
		draw();
	}

	function gameEnd() {
		alert("Your score was: " + gameState.score);
		location.reload();
	}

	function setTarget() {
		gameState.targetX = Math.random() * (constants.CANVAS_WIDTH - constants.TARGET_RADIUS * 2) + constants.TARGET_RADIUS;
		gameState.targetY = Math.random() * (constants.CANVAS_HEIGHT - constants.TARGET_RADIUS * 2) + constants.TARGET_RADIUS;
		console.log(gameState.targetX, gameState.targetY);
	}

	function handleHit() {
		gameState.maxTime *= 0.9;
		gameState.time += gameState.maxTime;
		gameState.score += 1;
		setTarget();
	}

	function draw() {

		ctx.beginPath();
		ctx.rect(0, 0, 2000, 2000);
		ctx.fillStyle = "#FFFFFF";
		ctx.fill();
		ctx.closePath();

		// Draw target
		ctx.beginPath();
		ctx.arc(gameState.targetX, gameState.targetY, constants.TARGET_RADIUS, 0, 2 * Math.PI);
		ctx.fillStyle = "#000000";
		ctx.fill();
		ctx.closePath();

		// Border
		ctx.beginPath();
		ctx.rect(0, 0, 620, 500);
		ctx.fillStyle = "#000000";
		ctx.stroke();
		ctx.closePath();

		ctx.fillText("Score: " + gameState.score, 10, 10);
		ctx.fillText("Time: " + gameState.time, 10, 30);
	}

	initializeGame();

})();