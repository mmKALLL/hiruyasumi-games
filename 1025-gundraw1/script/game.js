/* gundraw1 v0.8 - Simple JS game made by Esa Koskinen in 33 minutes.
 
Copyright 2017 Esa Koskinen. All rights reserved.
 
Source code provided for reference purposes only.
*/
 
(function() {
    var constants = {
        FPS: 100,
    };
    var gs = {}; // gameState
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
   
   
    // Initialize game state. Called when page loaded.
    function initializeGame() {
        gs = {
                score1: 0,
                time1: 0,
                score2: 0,
                time2: 0,
                state: "title",
        };
       
        // Run update function every frame
        window.setInterval(function() {
            update();
        }, 1000/constants.FPS);
    }
   
    window.onkeydown = handleArrowKeys;
   
    function handleArrowKeys(e) {
        switch(e.keyCode) {
            case 37: // 37, left, cw
                handlePress(1);
                break;
           
            case 38: // 38
            break;
           
            case 39: // 39
                handlePress(2);
            break;
           
            case 40: // 40
            break;
           
            default:
            return; // exit this handler for other keys
        }
		e.preventDefault(); // prevent the default action (scroll / move caret)
    }
   
    // Game loop
    function update() {
        if (gs.state != "title" && gs.state != "roundendend") {
            if (gs.state == "roundend") {
                gs.state = "roundendend"
                window.alert("winner: player " + gs.lastWinner + ", time " + (gs["time" + gs.lastWinner] * 10 + Math.floor(Math.random() * 10)) + "ms");
                location.reload();
            }
           
            if (gs.state == "ingameend") {
                gs.time1 += 1; // TODO use system time difference instead
                gs.time2 += 1;
            }
           
            if (Math.random() < 0.0023) {
                gs.state = "ingameend";
            }
           
        }
        if (gs.state != "roundendend") {
            draw();        
        }
    }
 
    function handlePress(playerNumber) {
        switch(gs.state) {
        case "title":
            gs.state = "prestart";
            break;
        case "prestart":
            // TODO false start: gs.state = "roundendend"
            break;
        case "ingame":
//          gs.state = "roundend";
//          gs["score" + playerNumber] -= 1;
//          gs.lastWinner = playerNumber == 1 ? 2 : 1;
            break;
        case "ingameend":
            gs.state = "roundend";
            gs["score" + playerNumber] += 1;
            gs.lastWinner = playerNumber;
            break;
        case "roundend":
            break;
        default:
            console.log("Errorenous state:", gs.state);
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
 
        if (gs.state == "title") {
            ctx.beginPath();
            ctx.rect(0, 0, 2000, 2000);
            ctx.fillStyle = "#33FF33";
            ctx.fill();
            ctx.closePath();           
        }
 
        if (gs.state == "ingameend") {
            ctx.beginPath();
            ctx.rect(0, 0, 2000, 2000);
            ctx.fillStyle = "#FF5555";
            ctx.fill();
            ctx.closePath();           
        }
 
       
//      ctx.font = "20px sans-serif";
//      ctx.fillStyle = "#000000";
//      ctx.fillText("Score: " + gs.score1, 260,20);
    }
   
    initializeGame();
   
})();