
/* **************************************************
 * spiral5 - Simple JS demo made by Esa Koskinen.
 * Finished in 17 minutes.
 *
 * Copyright 2018 Esa Koskinen. All rights reserved.
 *
 * Source code provided for reference purposes only.
 * ***************************************************/

(function() {
	var constants = {
		FPS: 20,
		CANVAS_X: 620,
		CANVAS_Y: 500,
		T_START: 0,
		T_STEP: 123, // degrees
		T_END: 200000,
		SIZE_MULTIPLIER: 0.01,
	};
	
	// gamestate
	var gs = {
		previousPoint: [constants.CANVAS_X / 2, constants.CANVAS_Y / 2],
		currentPoint: [constants.CANVAS_X / 2, constants.CANVAS_Y / 2],
		t: constants.T_START,
	};
	var canvas = document.getElementById("gameCanvas");
	var ctx = canvas.getContext("2d");
	
	function functionX(t) { return t * constants.SIZE_MULTIPLIER * Math.sin(t * Math.PI / 180); }
	function functionY(t) { return t * constants.SIZE_MULTIPLIER * Math.cos(t * Math.PI / 180); }
	
	// loop
	function update() {
		if (gs.t > constants.T_END) {
			return 0;
		}
		// Calculate position of next point.
		gs.t += constants.T_STEP;
		gs.previousPoint = gs.currentPoint;
		gs.currentPoint = [functionX(gs.t) + constants.CANVAS_X / 2, functionY(gs.t) + constants.CANVAS_Y / 2]
		
		draw();
	}
	
	function draw() {
		
		ctx.strokeStyle = "#000000";
		ctx.fillStyle = "#000000";
		
		// Border
		ctx.beginPath();
		ctx.rect(0, 0, 620, 500);
		ctx.stroke();
		ctx.closePath();
		
		// Draw line from previous point to current.
		ctx.beginPath();
		ctx.moveTo(gs.previousPoint[0], gs.previousPoint[1]);
		ctx.lineTo(gs.currentPoint[0], gs.currentPoint[1]);
		ctx.stroke();
	}
	
	// Clear canvas
	ctx.beginPath();
	ctx.rect(0, 0, 2000, 2000);
	ctx.fillStyle = "#FFFFFF";
	ctx.fill();
	ctx.closePath();
	
	window.setInterval(function() {
		update();
	}, 1000 / constants.FPS);
	
})();