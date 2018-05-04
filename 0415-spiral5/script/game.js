
/* **************************************************
* spiral5 - Simple JS demo made by Esa Koskinen.
*
* Copyright 2018 Esa Koskinen. All rights reserved.
*
* Source code provided for reference purposes only.
* ***************************************************/

(function () {

  // EXTEND with implementation of CASIO DynaFunc, dynafunc step size/length, repeat dynafunc forever/invert x times and switch, is invert white-out or invert time, are all functions dynamic or only some % loaded from dynamics, random-generate more anims into dynafunc object array or not, pre-compute (one? all?) dynafuncs or not, can draw step of dynafunc be seen or is every step shown fully drawn, smaller max-t and higher size-mult to save time or not, if func is next level of point and dyna next level of func, what is next level of Dyna?

  // EXTEND canvas size settings affect HTML/CSS too, have all of these adjustable and then click ok button to start anims with those settings (walker index.html style but no reload), use LocalStorage for remembering values, export url to allow others to view the same thing, make it possible for individual func to offer to overwrite values in const if prettier, allow randomization of all constant values on new func load (intensity/frequency determined by user), consider UX (descriptions), would it be easy to calculate max-t based on canvas size and size-mult??, does whitening-leaves-shadow-trails of Arora happen in other browsers? caused by canvas size/html size pixel antialias smoothening mismatch?

 // TODO add buttons for new func, save picture, change globals, etc.

  // DONE rethink all variable names and structure for future-proofing, add func objects into pre-determined array (load from file?), add/remove code comments, have constants be universal options, i.e. true/false generate func objects on init (and const for amount), replay func on finish, alternate colors on finish or clear screen, have random (high saturation) color used (and changed between how many steps), fps multiplier, custom length pause at end before erase/revert, whether cleaning is middle-out or out-middle (rymdreglage style)

  var colorFunctions = {
    alwaysBlack:
    function(functionNum, lineNum) { return "#000"; },
    alwaysWhite:
    function(functionNum, lineNum) { return "#FFF"; },
    randomColor:
        function(functionNum, lineNum) {
          return globals.Color(
              {
                red: Math.random(),
                green: Math.random(),
                blue: Math.random()
              }
          ).toString();
        },
    randomSaturated:
        function(functionNum, lineNum) {
          return globals.Color(
              {
                hue: Math.random()*360,
                saturation: (0.7 + Math.random() * 0.3)*360,
                value: (0.3 + Math.random() * 0.7)*360
              }
          ).toString
        },
    // randomSaturatedColor
    // others?
  };


  // Adjustable by user prior to generating functions.
  var constantDefaults = {
    fps: 80,
    canvasX: 800, // TODO get size from CSS definition
    canvasY: 410,
    startX: 400,
    startY: 205,

    tStart: 0, // supposed to be overwritten by func
    frames: 1300, // length to play animations for
    sizeMult: 0.015,

    endPauseLength: 1600, // milliseconds, pause before mode switch
    invertOnFinish: false, // revert function outside-in on end
    fillOnFinish: false, // fill function with white inside-out
    finishFillStyle: "", // "circle", "func-trace", "next-func"
    finishFillSpeed: 20, // fps for func, radius/sec for circle
    clearOnFinish: true, // clear screen after invert/clear/finish

    onlyBlackWhite: false, // override all color settings
    lineColorLength: 40, // number of lines to draw per color, 0: one line color per function
    getLineColor: // return func for getting next color
        (function() {
          // Can keep state here if needed
          return colorFunctions.randomColor;
        })(),

    functionX: function(t) { return t * activeFunction.sizeMult * Math.sin(t * Math.PI / 180); },
    functionY: function(t) { return t * activeFunction.sizeMult * Math.cos(t * Math.PI / 180); },
  };

  var functionList = [
    {
      tStart: 0,
      tStep: 123,
      tEnd: 140000,
      sizeMult: 0.01,
      frames: 1000
    },
    {
      tStart: 0,
      tStep: 162.3,
      tEnd: 200000,
      sizeMult: 0.034,
      frames: 750
    },
    {
      tStart: 0,
      tStep: 164,
      tEnd: 200000,
      sizeMult: 0.005
    },
    {
      tStart: 0,
      tStep: 91,
      tEnd: 200000,
      sizeMult: 0.005,
      frames: 1600,
    },
    {
      tStart: 0,
      tStep: 87.8,
      tEnd: 150000,
      sizeMult: 0.01
    },
    {
      tStart: 0,
      tStep: 61,
      tEnd: 60000,
      sizeMult: 0.015
    },
    {
      tStart: 10000,
      tStep: 181.5,
      tEnd: 250000,
      sizemult: 0.005,
      frames: 1200,
    },
    {
      tStart: 0,
      tStep: 126,
      tEnd: 250000,
      sizeMult: 0.0064,
      frames: 1400,
    },
    {
      tStart: 2000,
      tStep: 185,
      tEnd: 250000,
      sizeMult: 0.01,
    },
    {
      tStart: -400,
      tStep: 1,
      tEnd: 400,
      functionX: function(t) { return t; },
      functionY: function(t) { return 0.1*t*Math.sin(t) + 0.0000048*(t*t*t) + 0.0005*t*t; },
      sizeMult: 0.001,
      frames: 800,
    },
    {
      tStart: 3000,
      tStep: 180.18,
      tEnd: 1000000,
      fps: 100,
      frames: 2000,
      sizeMult: 0.018,
      lineColorLength: 8,
    }
  ];

  var globals = {
    Color: net.brehaut.Color,
    generateRandomFunctions: true, // use randomly-generated functions
    getNextFunction:
        function() {
          if (globals.generateRandomFunctions) {
            return getRandomFunction();
          } else {
            return functionList[ Math.floor(Math.random() * functionList.length) ];
          }
    },
    ignoreOverrides: false, // ignore settings defined by func
    canvasColor: "#FFF", // color used for clearing canvas
  };

  function getRandomFunction() {
    // TODO: Calculate size to var and compute tEnd/frames based on it.
    var size = 0.004 + Math.random()*0.017;
    var start = Math.random() < 0.98 ? 0 : 10 + Math.random()*20000;
    var step = (360 / Math.floor(Math.random()*8 + 2)) + Math.random()*40 - 20;

    return {
      tStart: start,
      tStep: step,
      tEnd: 440000,
      sizeMult: size,
      frames: Math.floor(280 + 1000*(0.0077 / size) + 
          (Math.abs(180 - step) < 35 || Math.abs(step) < 42 ? 220 : 0)),
      lineColorLength: Math.floor(Math.random() * 100),
    };
  }

  var activeFunction = {};
  var functionNum = 0;
  var lineNum = 0;
  var lineColor;
  var sleeping = false;
  function loadNextFunction() {
    activeFunction = {};
    newFunc = globals.getNextFunction();

    // Shallow copy, then overwrite
    for (key in constantDefaults) {
      activeFunction[key] = constantDefaults[key];
    }
    for (key in newFunc) {
      activeFunction[key] = newFunc[key];
    }

    activeFunction.previousPointX = activeFunction.startX;
    activeFunction.previousPointY = activeFunction.startY;
    activeFunction.currentPointX = activeFunction.startX;
    activeFunction.currentPointY = activeFunction.startY;
    activeFunction.t = activeFunction.tStart;
    functionNum += 1;
    lineNum = 0;
    lineColor = activeFunction.getLineColor(functionNum, lineNum);
    console.log(activeFunction);
  }

  //console.log(window);
  // TODO functionFinish should use constants, etc
  function functionFinish() {
    // invertColor();
    sleeping = true;
    window.setTimeout(function() {
      loadNextFunction();
      ctx.closePath();
      clearCanvas();
      sleeping = false;
    }, activeFunction.endPauseLength);
  }

  var canvas = document.getElementById("gameCanvas");
  var ctx = canvas.getContext("2d");


  // loop
  function update() {
    if (sleeping) {
      return 0;
    }

    // TODO handle negative tStep, i.e. decreasing t-value
    // TODO also handle undefined tStep
    if (lineNum > activeFunction.frames) {
      functionFinish();
      return 0;
    }

    // Figure out if we need to change stroke color.
    lineNum += 1;
    if (activeFunction.lineColorLength > 0 &&
        lineNum % activeFunction.lineColorLength === 0) {
      lineColor = activeFunction.getLineColor(functionNum, lineNum);
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
    //if (lineNum < 2)
    //  return 0;

    // Draw line from previous point to current.
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.moveTo(activeFunction.previousPointX,
        activeFunction.previousPointY);
    ctx.lineTo(activeFunction.currentPointX,
        activeFunction.currentPointY);
    ctx.stroke();
  }

  function invertColor() {
    var color = ctx.strokeStyle !== "#FFFFFF" ? "#FFFFFF" : "#000000";
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

  functionFinish();
  //console.log(activeFunction);
  window.setInterval(function() {
    update();
  }, 1000 / constantDefaults.fps);

})();
