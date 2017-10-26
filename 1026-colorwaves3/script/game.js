
/* **************************************************
 * colorwaves3 v2 - Simple JS demo made by Esa Koskinen.
 * Finished in 38 minutes, debug for 40 mins (lenght typo...), enhancements for 20 min (modes, etc).
 *
 * Copyright 2017 Esa Koskinen. All rights reserved.
 *
 * Source code provided for reference purposes only.
 * ***************************************************/

(function() {
	var constants = {
		FPS: 60,
		CANVAS_X: 620,
		CANVAS_Y: 500,
		PIXELS_X: 62, // not guaranteed to work but maybe it will, try to make canvas size divisible
		PIXELS_Y: 50, // also very performance heavy
		PIXEL_SIZE_X: 0, // initialized in initializeGame()
		PIXEL_SIZE_Y: 0,
		HUE_SHIFT_SPEED: 1.4, // How many degrees to shift hue per frame.
		HUE_LENGTH_MULTIPLIER: 0.20, // How long a wave is; bigger value is shorter wave.
		RANDOM_HUE_MULT: 0.16, // Also affects length; larger values make waves shorter.
	};
	var gs = {}; // gameState
	var Color = net.brehaut.Color;
	var canvas = document.getElementById("gameCanvas");
	var ctx = canvas.getContext("2d");
	
	
	// Initialize game state. Called when page loaded.
	function initializeGame() {
		constants.PIXEL_SIZE_X = constants.CANVAS_X / constants.PIXELS_X;
		constants.PIXEL_SIZE_Y = constants.CANVAS_Y / constants.PIXELS_Y;		

		gs = {
			pixels: [],
			clicks: [],
			fillMode: -1, // 1 or -1, affects whether colors seem to emit from or fall into the click.
		};

		// Initialize pixels.
		let i, j;
		for (i = 0; i <= constants.PIXELS_X - 1; i++) {
			let newRow = [];
			for (j = 0; j <= constants.PIXELS_Y - 1; j++) {
				newRow.push(Color("#FF3333"));
			}
			gs.pixels.push(newRow);
		}
		
		// Run update function every frame
		window.setInterval(function() {
			update();
		}, 1000/constants.FPS);
	}
	
	window.onmouseup = handleMouseClick;
	window.onkeydown = function() { gs.fillMode = (gs.fillMode == 1) ? -1 : 1; };
	
	function handleMouseClick(e) {
		let newClick = {};
		newClick.x = e.clientX - canvas.getBoundingClientRect().left;
		newClick.y = e.clientY - canvas.getBoundingClientRect().top;
		newClick.time = 0;
		
		gs.clicks.push(newClick);
		
		// offset pixel hues depending on distance from click
		let i, j;
		for (i = 0; i < gs.pixels.length; i++) {
			for (j = 0; j < gs.pixels[i].length; j++) {
//				console.log(clickDist(i * constants.PIXEL_SIZE_X, j * constants.PIXEL_SIZE_Y, newClick.x, newClick.y));
				gs.pixels[i][j] = gs.pixels[i][j].shiftHue(
											gs.fillMode
												* (Math.random() * constants.RANDOM_HUE_MULT + 1) 
												* clickDist(i * constants.PIXEL_SIZE_X, j * constants.PIXEL_SIZE_Y, newClick.x, newClick.y) 
												* constants.HUE_LENGTH_MULTIPLIER);
//				console.log(gs.pixels[i][j].shiftHue(1).toString());
			}
		}
	}
	
	function clickDist(x1, y1, x2, y2) {
		let dx = x1 - x2;
		let dy = y1 - y2;
		let dist = Math.sqrt(dx * dx + dy * dy);	
//		console.log(x1, y1, x2, y2, dist);	
		return dist;
	}
		
	// Game loop
	function update() {
		// Increase click time and pixel hue
		let i, j;
		for (i = 0; i < gs.clicks.length; i++) {
			gs.clicks[i].time += 1;
		}
		
		if (gs.clicks.length > 0) {
			for (i = 0; i < gs.pixels.length; i++) {
				for (j = 0; j < gs.pixels[i].length; j++) {
					gs.pixels[i][j] = gs.pixels[i][j].shiftHue(constants.HUE_SHIFT_SPEED * (1 + gs.clicks.length * 0.12)); // Need clicks length?
				}
			}			
		}
		
		draw();
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
		
		// Draw pixels in size
		let i, j;
		let psX = constants.PIXEL_SIZE_X, psY = constants.PIXEL_SIZE_Y;
		for (i = 0; i < gs.pixels.length; i++) {
			for (j = 0; j < gs.pixels[i].length; j++) {
				ctx.beginPath();
				ctx.rect(i * psX, j * psY, psX, psY);
				ctx.fillStyle = gs.pixels[i][j].toString();
				ctx.fill();
				ctx.closePath();
			}
		}
		
		// Mode text
		ctx.fillStyle = "#000000";
		ctx.fillText("Mode: " + (gs.fillMode == 1 ? "Drain" : "Fill"), 1, 10);
	}
	
	initializeGame();
	
})();