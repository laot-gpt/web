// 设置画布

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数

function random(min,max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function randomColor() {
  return (
    "rgb(" +
    random(0, 255) +
    ", " +
    random(0, 255) +
    ", " +
    random(0, 255) +
    ")"
  );
}

class Ball{
	
	constructor(x, y, velX, velY, color, size){
		this.x = x;
		this.y = y;
		this.velX = velX;
		this.velY = velY;
		this.color = color;
		this.size = size;
	}
	
	ready(){
		if(this.velX === 0){
			this.velX = 1;
		}
		if(this.velY === 0){
			this.velY = 1;
		}
	}
	
	draw(){
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.fill();
	}
	
	update(){
		if (this.x + this.size >= width) {
			this.velX = -this.velX;
		}

		if (this.x - this.size <= 0) {
			this.velX = -this.velX;
		}

		if (this.y + this.size >= height) {
			this.velY = -this.velY;
		}

		if (this.y - this.size <= 0) {
			this.velY = -this.velY;
		}

		this.x += this.velX;
		this.y += this.velY;
	}
	
	collisionDetect(){
		for (let j = 0; j < balls.length; j++) {
		    if (this !== balls[j]) {
		      const dx = this.x - balls[j].x;
		      const dy = this.y - balls[j].y;
		      const distance = Math.sqrt(dx * dx + dy * dy);
		
		      if (distance < this.size + balls[j].size) {
		        balls[j].color = this.color = randomColor();
		      }
		    }
		  }
	}
}

class EvilBall extends Ball{
	
	constructor(){
		super(100, 100, 2, 2, "white", 20);
	}
	
	draw(){
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = this.color;
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.stroke();
	}
	
	eat(ball){
		if (this !== ball) {
		  const dx = this.x - ball.x;
		  const dy = this.y - ball.y;
		  const distance = Math.sqrt(dx * dx + dy * dy);
				
		  if (distance < this.size + ball.size) {
		    return true;
		  }
		}
		return false;
	}
	
}

let balls = [];
let eatBalls = [];

while (balls.length < 25) {
  let size = random(10, 20);
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomColor(),
    size,
  );
  ball.ready();
  balls.push(ball);
}

let evilBall = new EvilBall();
evilBall.ready();

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }
  
  evilBall.draw();
  
  for (let i = 0; i < balls.length; i++) {
    if(evilBall.eat(balls[i])){
		eatBalls.push(balls[i]);
	}
  }
  
  balls = balls.filter(function(item){
	  for(let j = 0; j < eatBalls.length; j++){
		  if(eatBalls[j] === item){
			 return false; 
		  }
	  }
	  return true;
  })
  
  if(balls.length <= 0){
	  ctx.fillStyle = "#22BBFF";
	  ctx.fillRect(0, 0, width, height);
  }

  requestAnimationFrame(loop);
}

window.onkeydown = (e) => {
	switch(e.key){
		case "a": evilBall.x -= evilBall.velX;
		break;
		case "d": evilBall.x += evilBall.velX;
		break;
		case "w": evilBall.y -= evilBall.velY;
		break;
		case "s": evilBall.y += evilBall.velY;
		break;
	}
};

loop();

