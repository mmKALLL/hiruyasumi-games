
/* **************************************************
 * spiral5 - Simple JS demo made by Esa Koskinen.
 *
 * Copyright 2018 Esa Koskinen. All rights reserved.
 *
 * Source code provided for reference purposes only.
 * ***************************************************/

(function() {

// EXTEND with implementation of CASIO DynaFunc, dynafunc step size/length, repeat dynafunc forever/invert x times and switch, is invert white-out or invert time, are all functions dynamic or only some % loaded from dynamics, random-generate more anims into dynafunc object array or not, pre-compute (one? all?) dynafuncs or not, can draw step of dynafunc be seen or is every step shown fully drawn, smaller max-t and higher size-mult to save time or not, if func is next level of point and dyna next level of func, what is next level of Dyna? 

// EXTEND canvas size settings affect HTML/CSS too, have all of these adjustable and then click ok button to start anims with those settings (walker index.html style but no reload), use LocalStorage for remembering values, export url to allow others to view the same thing, make it possible for individual func to offer to overwrite values in const if prettier, allow randomization of all constant values on new func load (intensity/frequency determined by user), consider UX (descriptions), would it be easy to calculate max-t based on canvas size and size-mult??, does whitening-leaves-shadow-trails of Arora happen in other browsers? caused by canvas size/html size pixel antialias smoothening mismatch?

// TODO rename gs, move current constants to new array of "func define" objects, add function to generate additional funcs randomized into the array, move gs initialpoint to func defining object, add function to handle func switch and gs initializing (using params from const), 

// TODO rethink all variable names and structure for future-proofing, add func objects into pre-determined array (load from file?), add/remove code comments, have constants be universal options, i.e. true/false generate func objects on init (and const for amount), replay func on finish, alternate colors on finish or clear screen, have random (high saturation) color used (and changed between how many steps), fps multiplier, custom length pause at end before erase/revert, whether cleaning is middle-out or out-middle (rymdreglage style)

	var colorFunctions = {
		alwaysBlack: 
			function(functionNum, lineNum) { return "#000"; },
		alwaysWhite:
			function(functionNum, lineNum) { return "#FFF"; },
		randomColorFunction:
			function(functionNum, lineNum) {
                                return "rgb(" + Math.random() + "," +
						Math.random() + "," +
						Math.random() + ")";
                        },
		// randomSaturatedColor
		// others?
	};

	var globals = {
		generatedFunctions: 0, // number of random-variable functions
		ignoreOverrides: false, // ignore settings defined by func
		canvasColor: "#FFF", // default color for canvas clear
	};

	// Adjustable by user prior to generating functions.
	var constantDefaults = {
		fps: 20,
		canvasX: 800,
		canvasY: 410,
		sizeMult: 0.015,
		
                endPauseLength: 500, // milliseconds, pause before mode switch
                invertOnFinish: false, // revert function outside-in on end
                fillOnFinish: false, // fill function with white inside-out
		clearOnFinish: false, // clear screen 
                finishFillStyle: "", // "circle", "func-trace", "next-func"
                finishFillSpeed: 20, // fps for func, radius/sec for circle

                onlyBlackWhite: false, // override color settings
                lineColorLength: 0, // number of lines to draw per color, 0: one line color per function
                getLineColorFunction: // return func for getting next color
                        function() { 
                                return colorFunctions.randomColorFunction;
                        },

	};

	var constants = {
		FPS: 20,
		CANVAS_X: 800,
		CANVAS_Y: 410,
		T_START: 0,
		T_STEP: 161, // almost 180 to make very sharp turn 
// degrees; 123 0.01; 92 0.005; 160.0 0.004; 161.0; 160.4; 160.2
// 160.2, size 0.030 and 0.004 both cool
		T_END: 200000,
		SIZE_MULTIPLIER: 0.026,
	};

	var functions = [
		{
			
		}
	];

	// gamestate
	var gs = {
		initialPoint: [constants.CANVAS_X / 2, constants.CANVAS_Y / 2],
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
			//invertColor();
			gs.t = constants.T_START;
			ctx.closePath();
			ctx.moveTo(gs.initialPoint[0], gs.initialPoint[1]);
			ctx.closePath();
			clearCanvas();
		}
		// Calculate position of next point.
		gs.t += constants.T_STEP;
		gs.previousPoint = gs.currentPoint;
		gs.currentPoint = [functionX(gs.t) + constants.CANVAS_X / 2, functionY(gs.t) + constants.CANVAS_Y / 2]
		
		draw();
	}
	
	function draw() {
		
		// Draw line from previous point to current.
		ctx.beginPath();
		ctx.moveTo(gs.previousPoint[0], gs.previousPoint[1]);
		ctx.lineTo(gs.currentPoint[0], gs.currentPoint[1]);
		ctx.stroke();
	}
	
	function invertColor() {
		var color = ctx.strokeStyle === "#000000" ? "#FFFFFF" : "#000000"
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
	}

	function clearCanvas() {
		ctx.beginPath();
		ctx.rect(0, 0, 2000, 2000);
		ctx.fillStyle = "#FFFFFF";
		ctx.fill();
		ctx.closePath();

	        ctx.fillStyle = "#000000";
	}
	
	clearCanvas();
	
	window.setInterval(function() {
		update();
	}, 1000 / constants.FPS);
	
})();
