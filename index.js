let action = 'idle';
let enemies = [];
var bg = document.getElementById('bg');
let dieMenu = document.getElementById('dieMenu');
let prevScroll = 0;
let userName;
let healsBar = document.getElementById('hp');
curBackPos = 0;
function startGame(userForm){
      userName = userForm.target[0].value;
      if(userName === ""){
          alert('Input your USER NAME');
      }
      else{
          setInterval(animTimer, 1000/30);
          document.getElementById('startMenu').style.display = 'none';
      }
      //console.log(userName);
};

class animator {
    constructor(from, to, path, width, height, img, callback) {
        this.images = [];
        this.imagesCount = to - from;
        this.img = img;
        this.height = height;
        this.width = width;
        this.callback = callback;

        while(from <= to) {
            this.images.push(path + '1 (' + from + ').png');
            from++;
        }
        this.imgIndex = 0;
    }

    update() {
        this.img.src = this.images[this.imgIndex];
        this.img.height = this.height;
        this.img.width = this.width;
        this.imgIndex++;
        if(this.imgIndex > this.imagesCount) {
            this.imgIndex = 0;
            if(this.callback) {
                this.callback();
            }
        }
    }
}

class knight {
    constructor() {
        this.course = 1; // 1 - right  0 - left;
        this.img = new Image();
        this.heals = 100;
        this.inScrollZone = false;
        this.img.style.position = 'absolute';
        this.img.style.zIndex = 10;
        this.img.style.bottom = 0;
        this.animations = [];
        this.animations['attack'] = new animator(1, 21, './images/knight/attack1/', 280, 200, this.img, function() {
            action = 'idle'
        });
        this.animations['run'] = new animator(1, 17, './images/knight/run/', 200, 200, this.img, null);
        this.action = 'attack';
        this.left = 0;
    }

    runRight() {
        this.course = 1;
        if((this.left + Math.abs(curBackPos) >= window.innerWidth / 2 && this.left + Math.abs(curBackPos) <= window.innerWidth) && !this.inScrollZone){
            this.inScrollZone = true;
        }else if (Math.abs(curBackPos) === window.innerWidth && this.inScrollZone){
            this.inScrollZone = false;
        }
        if(this.inScrollZone){
            backEnemys(true);
            curBackPos -= 15;
            bg.style.backgroundPositionX = curBackPos + 'px';
        }
        else{
            if(this.left + 200 < window.innerWidth){
                this.left = this.left + 15;
                this.img.style.left = this.left + 'px';
            }
        }
        this.img.style.transform = 'scale(1, 1)';
        this.animations['run'].update();
    }

    runLeft() {
        this.course = 0;
        if((this.left <= window.innerWidth / 2 && this.left + Math.abs(curBackPos) >= window.innerWidth) && !this.inScrollZone){
            this.inScrollZone = true;
        }else if (Math.abs(curBackPos) === 0 && this.inScrollZone){
            this.inScrollZone = false;
        }
        if(this.inScrollZone){
            backEnemys(false);
            curBackPos += 15;
            bg.style.backgroundPositionX = curBackPos + 'px';
        }
        else{
            if(this.left > 0){
                this.left = this.left - 15;
                this.img.style.left = this.left + 'px';
            }
        }
        this.img.style.transform = 'scale(-1, 1)';
        this.animations['run'].update();
    }

    attack() {
        this.animations['attack'].update();
    }

    idle() {

    }
}

class elf {
    constructor(speed, left, heals){
        this.heals = heals;
        this.img = new Image();
        var thisClass = this;
        this.img.style.position = 'absolute';
        this.img.style.zIndex = 10;
        this.img.style.bottom = 0;
        this.animations = [];
        this.animations['attack'] = new animator(1, 20, './images/elf/attack/', 150, 200, this.img, function(){
            kn.heals -= 10;
        });
        this.animations['run'] = new animator(1, 20, './images/elf/run/', 150, 200, this.img, null);
        this.animations['die'] = new animator(1, 20, './images/elf/die/', 400, 200, this.img, function () {
            this.img.style.opacity = 0;
        });
        this.animations['hurt'] = new animator(1, 20, './images/elf/hurt/', 150, 200, this.img, function () {
            thisClass.heals -= 10;
        });
        this.action = 'idle';
        this.left = left;
        this.speed = speed;
    }
    runRight(){
        this.left = this.left + this.speed;
        this.img.style.left = this.left + 'px';
        this.img.style.transform = 'scale(-1, 1)';
        this.animations['run'].update();
    }

    runLeft() {
        this.left = this.left - this.speed;
        this.img.style.left = this.left + 'px';
        this.img.style.transform = 'scale(1, 1)';
        this.animations['run'].update();
    }

    attack() {
        if(kn.left+ (kn.img.height / 2) <= this.left){
            this.img.style.transform = 'scale(1, 1)';
        }
        else{
            this.img.style.transform = 'scale(-1, 1)';
        }
        this.animations['attack'].update();
    }

    hurt(){
        if(kn.left+ (kn.img.height / 2) <= this.left){
            this.img.style.transform = 'scale(1, 1)';
        }
        else{
            this.img.style.transform = 'scale(-1, 1)';
        }
        this.animations['hurt'].update();
    }

    die() {
        if(kn.left+ (kn.img.height / 2) <= this.left){
            this.img.style.transform = 'scale(-1, 1)';
        }
        else{
            this.img.style.transform = 'scale(1, 1)';
        }
        this.animations['die'].update();
    }

    idle() {

    }
}

document.addEventListener('keydown', function(event) {
    if(event.keyCode === 37) {
        action = 'runLeft';
    }
    else if(event.keyCode === 39) {
        action = 'runRight';
    } else if(event.keyCode === 49) {
        action = 'attack';
    }
});

document.addEventListener('keyup', function(event) {
    if(event.keyCode === 37 ||
        event.keyCode === 39) {
        action = 'idle';
    }
});
enemies.push(new elf(5, 900, 100));
enemies.push(new elf(4, 1000, 100));
enemies.push(new elf(6, 800, 100));
function enemyAI() {
    enemies.forEach(function (element) {
        if(element.action !== 'die'){
            centerEnemy = element.left + (element.img.width / 2);
            centerKn = kn.left + (kn.img.width / 2);
            if(action === 'attack' && (Math.abs(centerEnemy - centerKn) <= 120)){
                console.log(element.heals);
                //element.heals -= 10;
                if(element.heals <= 0){
                    element.action = 'die';
                }
                else{
                    element.action = 'hurt';
                }

            }
            else{
                if(centerEnemy > centerKn + 50){
                    element.action = 'runLeft';
                }
                else if(centerEnemy < centerKn - 50  ){
                    element.action = 'runRight';
                }else{
                    element.action = 'attack';
                }
            }

        }
    });
};

function backEnemys(course){
        if(course){
            enemies.forEach(function (element) {
                element.left -= 15;
            });
        }
        else{
            enemies.forEach(function (element) {
                element.left += 15;
            });
        };
};
let kn = new knight();
bg.appendChild(kn.img);
enemies.forEach(function (element) {
    bg.appendChild(element.img);
    element.runRight();
});
kn.runRight();
kn.left -= 15;

function stopGame() {
    clearInterval(animTimer);
    dieMenu.style.display = 'block';
    dieMenu.style.zIndex = '100';
}

var animTimer =function() {
    if(kn.heals <0){
        stopGame();
    }
    else{
        healsBar.innerHTML = kn.heals;
        healsBar.style.width = kn.heals + '%';
        enemyAI();
        kn[action]();
        enemies.forEach(function (element) {
            element[element.action]();
        });
    }
};