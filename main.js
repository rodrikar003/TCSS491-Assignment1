var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
    this.flipFrame = 9;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick ;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth , this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    var currFrame; 
    currFrame = Math.floor(this.elapsedTime / this.frameDuration) - 6;
    if (this.elapsedTime >= 1.459 && this.elapsedTime <= 2.95
        && currFrame < 20) { // frame 9 to 19
        currFrame = Math.floor(this.elapsedTime / this.frameDuration) - 6;
    } else {
        currFrame = Math.floor(this.elapsedTime / 0.135);
    }
    return currFrame;
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet, x, y) {
    this.x = x;
    this.y = y;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
};

Background.prototype.update = function () {
};


// inheritance 
function Girl(game, spritesheet) {
    this.animation = new Animation(spritesheet, 175, 250, 7, 0.15, 36, false, 1.5);
    this.jumping = false;
    this.ground = 210;
    this.height = 15;
    this.ctx = game.ctx;
    Entity.call(this, game, -1710,  this.ground);
}

Girl.prototype = new Entity();
Girl.prototype.constructor = Girl;
Girl.prototype.update = function () {
    
    this.jumping = (this.animation.elapsedTime >= 1.45 &&
                    this.animation.elapsedTime <= 2.95) ?  true : false;
     if (this.jumping) {
        this.animation.frameDuration = 0.089;
        this.x += 3;
        this.height += 2;
        this.y = this.ground - this.height;
        
      
    } else {
        this.x += 10;
        this.y = (this.y === this.ground) ? this.ground 
                : this.y += 5;
        
    }
    Entity.prototype.update.call(this);
}

Girl.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx,-this.x, this.y);
    Entity.prototype.draw.call(this);
}


AM.queueDownload("./img/SpriteSheet.png");
AM.queueDownload("./img/background.png");
AM.queueDownload("./img/background2.png");


AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.png"),0,0));
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background2.png"),947,0));
    gameEngine.addEntity(new Girl(gameEngine, AM.getAsset("./img/SpriteSheet.png")));

});