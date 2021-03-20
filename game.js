const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const restart = () => location.reload();

let x = canvas.width/2;
let y = canvas.height-30;

//ball speed 
let dx = 2;
let dy = -2;

let score = 0;
let life = 2;

const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 40;
const brickOffsetLeft = 30;

let bricks = [];
for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1};
    }
}

let ballRadius = 10;

let paddleHeight = 10;
let paddleWidth = 70;
let paddleX = (canvas.width-paddleWidth)/2;

let time = 10;

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//Keyboard handler
function keyDownHandler(event){
    if(event.keyCode == 39){
        rightPressed = true;
    }
    if(event.keyCode == 37){
        leftPressed = true;
    }
}

function keyUpHandler(event){
    if(event.keyCode == 39){
        rightPressed = false;
    }
    if(event.keyCode == 37){
        leftPressed = false;
    }
}

//Mouse handler 
function mouseMoveHandler(e){
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1){
                // if the center of the ball is inside a brick the status change to make it disappear
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickColumnCount*brickRowCount){
                        alert("C'est gagné, Bravo!");
                        restart();
                    }
                }
            }
        }
    }
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#AAADC4";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#AAADC4";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#29339B";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLife() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#29339B";
    ctx.fillText("Lives: "+life, canvas.width-65, 20);
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#B6D6CC";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw(){

    //update the movement
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawPaddle();
    drawBall();
    drawScore();
    drawLife();
    collisionDetection();

    //rebound on the left and right
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    //rebound on the top
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    //condition if the ball touch the bottom of the canvas
    else if(y + dy > canvas.height-ballRadius){
        if(x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        }else{
            life--;
            if(!life){
                alert("C'est perdu, dommage!");
                restart();
            }else{
                x = canvas.width/2;
                y = canvas.height-30;
                // difficulty rise when you lose the first life
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        } 
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 15;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 15;
    }
    //animate the ball
    x += dx;
    y += dy;
    
    requestAnimationFrame(draw);
}

draw();
