
/* lightsphere v1.0 - Simple JS game made by Esa Koskinen in 31 minutes.

Copyright 2017 Esa Koskinen. All rights reserved.

Source code provided for reference purposes only.
*/

(function() {
	var constants = {
		FPS: 120,
		PLAYER_RADIUS: 30,
		ENEMY_SPEED_MULTIPLIER: 1,
		DIFFICULTY_MULTIPLIER: 0.5,
	};
	var gs = {}; // gameState
	var canvas = document.getElementById("gameCanvas");
	var ctx = canvas.getContext("2d");
	
	
	// Initialize game state. Called when page loaded.
	function initializeGame() {
		gs = {
			playerX: 310,
			playerY: 250,
			enemies: [],
			score: 0,
			difficulty: 1,
			gameEnded: false,
		};
		
		// Run update function every frame
		window.setInterval(function() {
			update();
		}, 1000/constants.FPS);
	}
	
	window.onmousemove = movePlayer;
	
	function movePlayer(e) {
		gs.playerX = Math.min(620 - constants.PLAYER_RADIUS, 
							Math.max(0 + constants.PLAYER_RADIUS, e.clientX - canvas.getBoundingClientRect().left));
		gs.playerY = Math.min(500 - constants.PLAYER_RADIUS, 
							Math.max(0 + constants.PLAYER_RADIUS, e.clientY - canvas.getBoundingClientRect().top));
	}
	
	// Game loop
	function update() {
		draw();
		
		createEnemy();
		updateEnemyPositions();
		checkCollisions();
		
		gs.difficulty = Math.pow(gs.score, 0.17) * 0.005;
		
		gs.score += 1;
	}

	function createEnemy() {
		if (Math.random() / (constants.FPS / 60) < gs.difficulty * constants.DIFFICULTY_MULTIPLIER) {
			let newEnemy = {
					x: (Math.random() < 0.5 ? -100 : 720),
					y: (Math.random() < 0.5 ? -100 : 600),
					r: Math.random() * 40 + 20, // radius
			}
			newEnemy.directionX = newEnemy.x === -100 ? 1 : -1;
			newEnemy.directionY = newEnemy.y === -100 ? 1 : -1;
			newEnemy.speedX = newEnemy.directionX * (Math.random() + 0.5);
			newEnemy.speedY = newEnemy.directionY * (Math.random() + 0.5);
			gs.enemies.push(newEnemy);
			console.log("enemy made " + newEnemy)
		}
	}

	function updateEnemyPositions() {
		let i;
		for (i = 0; i < gs.enemies.length; i++) {
			let enemy = gs.enemies[i];
			enemy.x += enemy.speedX * constants.ENEMY_SPEED_MULTIPLIER;
			enemy.y += enemy.speedY * constants.ENEMY_SPEED_MULTIPLIER;
		}
		
		// remove useless enemies last
		// TODO
	}

	function checkCollisions() {
		let i;
		for (i = 0; i < gs.enemies.length; i++) {
			let dx = gs.playerX - gs.enemies[i].x;
			let dy = gs.playerY - gs.enemies[i].y;
			let distance = Math.sqrt(dx * dx + dy * dy); // pythagoras
			if (distance < constants.PLAYER_RADIUS + gs.enemies[i].r) {
				if (!gs.gameEnded) {
					alert("Your final score was: " + gs.score);
					location.reload();
					gs.gameEnded = true;
				}
			}
				
		}
	}
	
	function draw() {
		
		// Clear everything
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
		
		// Player character
		
		ctx.beginPath();
		ctx.arc(gs.playerX, gs.playerY, constants.PLAYER_RADIUS, 0, 2*Math.PI);
		ctx.fillStyle = "#ccbbbb";
		ctx.fill();
		ctx.closePath();
		
		// Enemies
		let i;
		for (i = 0; i < gs.enemies.length; i++) {
			enemy = gs.enemies[i];
			ctx.beginPath();
			ctx.arc(enemy.x, enemy.y, enemy.r, 0, 2*Math.PI);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
		}
		
		ctx.font = "20px sans-serif";
		ctx.fillStyle = "#000000";
		ctx.fillText("Score: " + gs.score, 260,20);
	}
	
	initializeGame();
	
})();