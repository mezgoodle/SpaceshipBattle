/*-----------ONLOAD INITIALIZATION-----------*/
window.onload = function(){
let c = document.querySelector("canvas");
let canvas = document.querySelector("canvas");
c.width = innerWidth;
c.height = innerHeight;
c = c.getContext("2d");
  
/*-----------MOUSE/TOUCH & CONTROLS-----------*/ 
//mouse and touch objects
function startGame(){
mouse = {
  x: innerWidth/2,
  y: innerHeight-33
};
  
touch = {
  x: innerWidth/2,
  y: innerHeight-33
};
  
//event listener for mouse object
canvas.addEventListener("mousemove", function(event){
mouse.x = event.clientX;
//mouse.y = event.clientY;
});
//eventListener for touch object
canvas.addEventListener("touchmove", function(event){
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let touch = event.changedTouches[0];
  let touchX = parseInt(touch.clientX);
  let touchY = parseInt(touch.clientY) - rect.top - root.scrollTop;
  event.preventDefault();
  mouse.x = touchX;
  //mouse.y = touchY;
});
  
/*-----------GAME VARIABLES-----------*/  
//player
let player_width = 32;
let player_height = 32;
let playerImg = new Image();
let score = 0;
let health = 100;

function choosePlayer(){
  let orangeShip = "https://image.ibb.co/n8rayp/rocket.png";
  let blueShip = "https://image.ibb.co/dfbD1U/heroShip.png";
  let userInput = prompt("🚀SELECT BATTLESHIP!🚀\n1 is for orange and 2 is for blue ship", 1);   
  if(userInput === 1){
    playerImg.src = orangeShip;
  }
  else if(userInput == 2){
    playerImg.src = blueShip;
  }
  else{
    playerImg.src = orangeShip;
  }
}choosePlayer();

//bullet array
let _bullets = []; //array to hold n bullets
let bullet_width = 6;
let bullet_height = 8;
let bullet_speed = 8;
//enemy array
let _enemies = []; //array to hold n enemies
let enemyImg = new Image();
enemyImg.src = "https://image.ibb.co/bX9UuU/ufo_1.png"; //"https://image.ibb.co/gi6ZpU/ufo.png";
let enemy_width = 32;
let enemy_height = 32;
//health array
let _healthkits = []; //array to hold n health kits
let healthkitImg = new Image();
healthkitImg.src = "https://image.ibb.co/iTrjuU/hospital.png";  //"https://image.ibb.co/gFvSEU/first_aid_kit.png";
let healthkit_width = 32;
let healthkit_height = 32;
//sounds
let shot = new Audio();
shot.src = "https://www.dropbox.com/s/w70c8hyryak6w40/Laser-SoundBible.com-602495617.mp3?dl=0";

/*-----------GAME OBJECTS-----------*/  
//Player object
function Player(x, y, width, height){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  
  this.draw = function(){
    c.beginPath();
    c.drawImage(playerImg, mouse.x-player_width, mouse.y-player_height); //draw player and center cursor
  };
  
  this.update = function(){
    this.draw();
  };
}

//Bullet object
function Bullet(x, y, width, height, speed){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
  
  this.draw = function(){
    c.beginPath();
    c.rect(this.x, this.y, this.width, this.height);
    c.fillStyle = "#fff";
    c.fill();
    c.stroke();
  };
  
  this.update = function(){
    this.y -= this.speed;
    this.draw();
  };
}

//Enemy object
function Enemy(x, y, width, height, speed){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
  
  this.draw = function(){
    c.beginPath();
    c.drawImage(enemyImg, this.x, this.y);
  };
  
  this.update = function(){
    this.y += this.speed;
    this.draw();
  };
}

//Health kit object  
function Healthkit(x, y, width, height, speed){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
  
  this.draw = function(){
    c.beginPath();
    c.drawImage(healthkitImg, this.x, this.y);
  };
  
  this.update = function(){
    this.y += this.speed;
    this.draw();
  };
}
  
/*-----------_new OBJECT-----------*/  
//draw Player
let __player = new Player(mouse.x, mouse.y, player_width, player_height);

//draw n enemies into enemies array
function drawEnemies(){
  for (let _ = 0; _<4; _++){ //enemy with random x axis, -32 as y axis, enemy_width, enemy_height, random speed  
    let x = Math.random()*(innerWidth-enemy_width);
    let y = -enemy_height; //-height to draw above canvas for smooth income
    let width = enemy_width;
    let height = enemy_height;
    let speed = Math.random()*4.5;
    let __enemy = new Enemy(x, y, width, height, speed);
    _enemies.push(__enemy); //push enemy to my array of enemies
  }
}setInterval(drawEnemies, 1234);
  
  
//draw health kits
function drawHealthkits(){
  for (let _ = 0; _<1; _++){ //health with random x axis, -32 as y axis, healthkit_width, healthkit_height, random speed  
    let x = Math.random()*(innerWidth-enemy_width);
    let y = -enemy_height; //-height to draw above canvas for smooth income
    let width = healthkit_width;
    let height = healthkit_height;
    let speed = Math.random()*2.6;
    let __healthkit = new Healthkit(x, y, width, height, speed);
    _healthkits.push(__healthkit); //push healthkit to my array of healthkits
  }
}setInterval(drawHealthkits, 15000);

//draw bullet
//let __bullet = new Bullet(mouse.x-bullet_width/2, mouse.y-player_height, bullet_width, bullet_height, bullet_speed);  
  
//fire bullet function
function fire(){ //fire bullet from mouse.x on x axis, y axis, width, height, speed
  for (let _ = 0; _<1; _++){
    let x = mouse.x-bullet_width/2;
    let y = mouse.y-player_height;
    let __bullet = new Bullet(x, y, bullet_width, bullet_height, bullet_speed);
    _bullets.push(__bullet); //push bullet to my array of bullets
    //shot.play();
  }
}setInterval(fire, 200);
  
//event listener for fire function
canvas.addEventListener("click", function(){
  //fire();
});
  
/*-----------COLLISION DETECTION-----------*/
function collision(a,b){
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}
/*-----------SCORE-----------*/
c.fillStyle = "white";
c.font = "1em Arial";

/*-----------DIRTY ERROR HANDLING-----------*/
function stoperror() {
  return true;
}  
window.onerror = stoperror;
  
/*-----------GAME LOOP-----------*/
function animate(){
  requestAnimationFrame(animate); //animate
  c.beginPath(); //begin
  c.clearRect(0,0,innerWidth,innerHeight); //clear canvas
  c.fillText("Health: " + health, 5, 20); //health
  c.fillText("Score: " + score, innerWidth-100, 20); //score
  
/*-----------__player, __bullet, __enemy update, __healthkit update-----------*/
  //update _player
  __player.update();
  //update bullets from bullets array
  for (let i=0; i < _bullets.length; i++){
    _bullets[parseInt(i)].update();
    if (_bullets[parseInt(i)].y < 0){
      _bullets.splice(i, 1);
    }
  }
  //update enemies from enemies array
  for (let k=0; k < _enemies.length; k++){
    _enemies[parseInt(k)].update();
    //if enemy is below canvas, delete it
    if(_enemies[parseInt(k)].y > innerHeight){
      _enemies.splice(k, 1);
      health -= 10;
    if(health === 0){
      alert("You DIED!\nYour score was "+score);
      startGame();
     }
    }
  }
  
  //loop over both enemies and bullets to detect collisions
  for(let j = _enemies.length-1; j >= 0; j--){
    for(let l = _bullets.length-1; l >= 0; l--){
      if(collision(_enemies[parseInt(j)], _bullets[parseInt(l)])){
        _enemies.splice(j, 1);
        _bullets.splice(l, 1);
        score++;
      }
    }
  }
  
  //draw healthkits
  for(let h=0; h < _healthkits.length; h++){
    _healthkits[parseInt(h)].update();
  }
  //loop over both healthkits and bullets to detect collisions
  for(let hh = _healthkits.length-1; hh >= 0; hh--){
    for(let hhh = _bullets.length-1; hhh >= 0; hhh--){
      if(collision(_healthkits[parseInt(hh)], _bullets[parseInt(hhh)])){
        _healthkits.splice(hh, 1);
        _bullets.splice(hhh, 1);
        health += 10;
      }
    }
  } 
  
} //animate func
animate();
}startGame();//startGame function starts/restarts game
}; //end of onload func
