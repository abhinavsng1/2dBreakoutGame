
//selecting a canvas
const cvs=document.getElementById("breakout");
const ctx=cvs.getContext("2d");

cvs.style.border="solid 1px #0ff";

//make the line thick when drawing
ctx.lineWidth=3;

//resources
var BG_IMG = new Image();
BG_IMG.src="img/bg.jpg"

const LEVEL_IMG = new Image();
LEVEL_IMG.src="img/level.png"

const LIFE_IMG = new Image();
LIFE_IMG.src="img/life.png";

const SCORE_IMG= new Image();
SCORE_IMG.src="img/score.png"


//audio
const WALL_HIT= new Audio();
WALL_HIT.src="sounds/wall.mp3";

const LIFE_LOST= new Audio();
LIFE_LOST.src="sounds/life_lost.mp3"

const PADDLE_HIT= new Audio();
PADDLE_HIT.src="sounds/paddle_hit.mp3";

const WIN= new Audio();
WIN.src="sounds/win.mp3";

const BRICK_HIT= new Audio();
BRICK_HIT.src="sounds/brick_hit.mp3";


//GAME VARIABLE AND CONSTANT
const PADDLE_WIDTH=100;
const PADDLE_MARGIN_BOTTOM=50;
const PADDLE_HEIGHT=20;
let leftArrow=false;
let rightArrow=false;
const BALL_RADIUS=8;
let SCORE=0;
var LIFE=3;//PLAYERS HAS THREE LIFE
let LEVEL=1;
const MAX_LEVEL=3;
let GAME_OVER= false;


//create paddle
const paddle={
	x:cvs.width/2-PADDLE_WIDTH/2,
	y:cvs.height-PADDLE_MARGIN_BOTTOM-PADDLE_HEIGHT,
	width:PADDLE_WIDTH,
	height:PADDLE_HEIGHT,
	dx:5

}
//CREATE THE BALL
const ball ={
	x:cvs.width/2,
	y:paddle.y-BALL_RADIUS,
	radius:BALL_RADIUS,
	speed: 4,
	dx:3,
	dy:-3 
}




//draw a paddle
function drawPaddle(){
	ctx.fillstyle= "#2e3548";
	ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
	ctx.strokeStyle= "#ffcd05";
	ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height)

}

//DRAW THE BALL
function drawBall(){
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);	
	ctx.fillStyle="#ffcd05";
	ctx.fill();
	ctx.strokeStyle="#2e3548";
	ctx.stroke();
	ctx.closePath();
}

//control the panel
document.addEventListener("keydown",function(event){
	if(event.keyCode==37){
		leftArrow=true;
	}
	else if(event.keyCode==39){
		rightArrow=true;
	}
})

document.addEventListener("keyup",function(event){
	if(event.keyCode==37){
		leftArrow=false;
	}
	else if(event.keyCode==39){
		rightArrow=false;
	}
})

//move paddle
function movePaddle(){
	if(rightArrow && paddle.x + paddle.width < cvs.width){
		paddle.x+=paddle.dx;
	}else if(leftArrow && paddle.x>0){
		paddle.x-=paddle.dx;
	}
}
//MOVE THE BALL
function moveBall(){
	ball.x+=ball.dx;
	ball.y +=ball.dy;
}

//BALL AND COLLISION DETECTION
function ballWallCollision(){
	if(ball.x+ball.radius>cvs.width || ball.x-ball.radius < 0){
		WALL_HIT.play();
		ball.dx=-ball.dx;
		
	}
	if(ball.y-ball.radius<0)
	{
		ball.dy=-ball.dy;
		WALL_HIT.play();
	}
	if(ball.y+ball.radius>cvs.height){
		
		LIFE--;//LOSE LIFE
		LIFE_LOST.play();
		resetBall();
	}
}
//reset ball function
function resetBall(){
	ball.x=cvs.width/2;
	ball.y=paddle.y-BALL_RADIUS;
	ball.dx=3*(Math.random()*2-1);
	ball.dy=-3; 
}
 //ball and paddle collision
 function ballPaddleCollision(){
 	if(ball.x<paddle.x+paddle.width && ball.x > paddle.x && paddle.y < paddle.y+paddle.height && ball.y>paddle.y){
 		
 		//sound
 		PADDLE_HIT.play();

 		//CHECK WHERE BALL HIT THE PADDLE
 		let collidePoint = ball.x -(paddle.x+paddle.width/2);
 		//NORMALIZE THE VALUES
 		collidePoint=collidePoint/(paddle.width/2);
 		//calculate the angle
 		let angle=collidePoint*Math.PI/3;

 		ball.dx=ball.speed*Math.sin(angle);
 		ball.dy =-ball.speed*Math.cos(angle);
 	}
 }
//CREATE FUNCTION
const brick={
	row:1,
	column:5,
	width:55,
	height:20,
	offSetLeft:20,
	offSetTop:20,
	marginTop:40,
	fillColor:"#cb4154",
	strokeColor:"#fff"

}

let bricks=[]
function createBricks(){
	for(let r=0;r<brick.row;r++){
		bricks[r]=[]
		for(let c=0;c<brick.column;c++){
			bricks[r][c]={
				x:c*(brick.offSetLeft+brick.width)+brick.offSetLeft,
				y:r*(brick.offSetTop + brick.height)+brick.offSetTop+brick.marginTop,
				status:true

			}
		}
	}

}

createBricks();
//draw the bricks
function drawBricks(){
	for(let r=0;r<brick.row;r++){
		for(let c=0;c<brick.column;c++){
			let b=bricks[r][c];
			//if the brick isn't broken
			if(b.status){
				ctx.fillStyle=brick.fillColor;
				ctx.fillRect(b.x,b.y,brick.width,brick.height);
				ctx.strokeStyle=brick.strokeColor;
				ctx.strokeRect(b.x,b.y,brick.width,brick.height);
			}
		}
	}
}
//ball brick collisiom
function ballBrickCollision(){
	for(let r=0;r<brick.row;r++){
		for(let c=0;c<brick.column;c++){
			let b=bricks[r][c];
			//if the brick isn't broken
			if(b.status){
				if(ball.x+ball.radius>b.x&&ball.x-ball.radius<b.x+brick.width && ball.y + ball.radius>b.y && ball.y-ball.radius<b.y+brick.height)	
					{	
						ball.dy=-ball.dy;
						b.status = false;//the brick is broken
						SCORE+=10;
						BRICK_HIT.play();
					}	
			}
		}
	}

}
//show game stats
function showGameStats(text, textX, textY, img, imgX, imgY){
	ctx.fillStyle="#fff";
	ctx.font="25px Germania One";
	ctx.fillText(text, textX,textY)

	//draw image
	ctx.drawImage(img,imgX, imgY, width=25, height=25)

}

//Draw function
function draw(){
 drawPaddle();
 drawBall();	
 drawBricks();
 //show score
 showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
 //show life
 showGameStats(LIFE, cvs.width-25, 25, LIFE_IMG, cvs.width-55, 5);
 //show level
 showGameStats(LEVEL, cvs.width/2, 25, LEVEL_IMG, cvs.width/2-30, 5);
}

//GAMEOVER
function gameOver(){
	if(LIFE<=0){
		showYouLose();
		GAME_OVER=true;
	}
}
//LEVEL UP
function levelUp(){
	let isLevelDone=true;
	//check if all the brick are broken
	for(let r=0;r<brick.row;r++){
		for(let c=0;c<brick.column;c++){
			isLevelDone= isLevelDone && ! bricks[r][c].status;
		}
	}
	if(isLevelDone){
		if(LEVEL>=MAX_LEVEL){
			showYouWin();
			WIN.play();

			GAME_OVER=true;
			return;
		}WIN.play();
		brick.row++;
		createBricks();
		ball.speed+=0.5;
		resetBall();
		LEVEL++;
	}
}

//UPDATE
function update(){
 movePaddle();
 moveBall();
 ballWallCollision();
 ballPaddleCollision();
 ballBrickCollision();
 gameOver();
 levelUp();
}


//GAME LOOP
function loop(){
	ctx.drawImage(BG_IMG, 0, 0)
	draw();
	update();

	if(!GAME_OVER){
		requestAnimationFrame(loop);
	}
	
}
loop();

//SELECT THE SOUND ELEMENT
const soundElement=document.getElementById('sound');
soundElement.addEventListener("click",audioManager);
function audioManager(){

	//CHANGE IMAGE SOUND
	let imgSrc= soundElement.getAttribute("src");
	let SOUND_IMG= imgSrc=="img/SOUND_ON.png"?"img/SOUND_OFF.png":"img/SOUND_ON.png";
	soundElement.setAttribute("src",SOUND_IMG);

	//mute and unmute sound
	WALL_HIT.muted= WALL_HIT.muted?false:true;
	PADDLE_HIT.muted= PADDLE_HIT.muted?false:true;
	BRICK_HIT.muted= BRICK_HIT.muted?false:true;
	WIN.muted= WIN.muted?false:true;
	LIFE_LOST.muted= LIFE_LOST.muted?false:true;
}


//SHOW GAME OVER MESSAGE

const gameover=document.getElementById("gameover");
const youwin=document.getElementById("youwin");
const youlose=document.getElementById("youlose");
const restart=document.getElementById("restart");


restart.addEventListener('click',function(){
	location.reload();//relaod this page
})

//show you win
function showYouWin(){
	gameover.style.display="block";
	youwon.style.display="block";
}

//show you LOSE
function showYouLose(){
	gameover.style.display="block";
	youlose.style.display="block";
}