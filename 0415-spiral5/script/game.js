
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


	var globals = {
		generatedFunctions: 0, // number of random-variable functions
		getNextFunction:
			function() { return functionList[ 
				Math.floor(Math.random * functionList.length)
				]; 
			},
		ignoreOverrides: false, // ignore settings defined by func
		canvasColor: "#FFF", // color used for clearing canvas
	};

	// Adjustable by user prior to generating functions.
	var constantDefaults = {
		fps: 20,
		canvasX: 800,
		canvasY: 410,
		startX: 400,
		startY: 205,
		
		tStart: 0, // supposed to be overwritten by func
		tEnd: -1,  // supposed to be overwritten by func
		sizeMult: 0.015,
		
                endPauseLength: 500, // milliseconds, pause before mode switch
                invertOnFinish: false, // revert function outside-in on end
                fillOnFinish: false, // fill function with white inside-out
                finishFillStyle: "", // "circle", "func-trace", "next-func"
                finishFillSpeed: 20, // fps for func, radius/sec for circle
                clearOnFinish: true, // clear screen after invert/clear/finish

                onlyBlackWhite: false, // override all color settings
                lineColorLength: 0, // number of lines to draw per color, 0: one line color per function
                getLineColorFunction: // return func for getting next color
                        function() { 
                                return colorFunctions.randomColorFunction;
                        },

		functionX: function(t) { return t * activeFunction.sizeMult * Math.sin(t * Math.PI / 180); },
        	functionY: function(t) { return t * activeFunction.sizeMult * Math.cos(t * Math.PI / 180); },
	};

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

	var functionList = [
		{
			tStart: 0,
			tStep: 123,
			tEnd: 200000,
			sizeMult: 0.01
		},
                {
                        tStart: 0,
                        tStep: 162.04,
                        tEnd: 200000,
                        sizeMult: 0.034
                },
                {
                        tStart: 0,
                        tStep: 162.02,
                        tEnd: 200000,
                        sizeMult: 0.001
                },
                {
                        tStart: 0,
                        tStep: 91,
                        tEnd: 200000,
                        sizeMult: 0.001
                },
                {
                        tStart: 0,
                        tStep: 87.8,
                        tEnd: 200000,
                        sizeMult: 0.01
                },
                {
                        tStart: 0,
                        tStep: 61,
                        tEnd: 200000,
                        sizeMult: 0.005
                },
                {
                        tStart: 10000,
                        tStep: 181.5,
                        tEnd: 200000,
                        sizeMult: 0.005
                },

	];

	var globals = {
		generatedFunctions: 0, // number of random-variable functions
		getNextFunction:
			function() { return functionList[ 
				Math.floor(Math.random * functionList.length)
				]; 
			},
		ignoreOverrides: false, // ignore settings defined by func
		canvasColor: "#FFF", // color used for clearing canvas
	};

	var activeFunction = {};
	console.log("hi");
	function loadNextFunction() {
		activeFunction = constantDefaults;
		newFunc = globals.getNextFunction();
		for (key in newFunc) {
			activeFunction[key] = newFunc[key];
		}
		activeFunction.previousPointX = activeFunction.startX;
		activeFunction.previousPointY = activeFunction.startY;
		activeFunction.currentPointX = activeFunction.startX;
		activeFunction.currentPointY = activeFunction.startY;
		activeFunction.t = activeFunction.tStart;
	}

	// TODO functionFinish should use constants, etc
	function functionFinish() {
		// invertColor();
		loadNextFunction();
		ctx.closePath();
                clearCanvas();
	}

	var canvas = document.getElementById("gameCanvas");
	var ctx = canvas.getContext("2d");
	
	
	// loop
	function update() {
		// TODO handle negative tStep, i.e. decreasing t-value
		if (activeFunction.t > activeFunction.tEnd) {
			functionFinish();
			return 0;
		}
		
		// Calculate position of next point.
		activeFunction.t += activeFunction.tStep;
		activeFunction.previousPointX = activeFunction.currentPointX;
		activeFunction.previousPointY = activeFunction.currentPointY;
		activeFunction.currentPointX = activeFunction.functionX(activeFunction.t) + activeFunction.startX;
		activeFunction.currentPointY = activeFunction.functionY(activeFunction.t) + activeFunction.startY;
		
		draw();
	}
	
	function draw() {
		
		// Draw line from previous point to current.
		ctx.beginPath();
		ctx.moveTo(activeFunction.previousPointX, 
				activeFunction.previousPointY);
		ctx.lineTo(activeFunction.currentPointX,
				activeFunction.currentPointY);
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
	loadNextFunction();	

	window.setInterval(function() {
		update();
	}, 1000 / constants.FPS);
	
})();
