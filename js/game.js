// JavaScript Document

// Create a new scene named "Game"


// The let part is a JS statement. It declares a block scope local variable, optionally initializing it to a value. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
//A block levelvariable only exists within the context of the block. When the statement is finished executing, the variable is destroyed: https://www.nczonline.net/blog/2008/12/04/javascript-block-level-variables/
let gameScene = new Phaser.Scene('Game');

//Game's configuration
let config = {
	
	type: Phaser.AUTO, //Phaser will decide how to render our game (WebGL or Canvas)
	width:640,
	height:360,
	scene: gameScene //Our newly created scene
	
};

//Create  the game, and pass it the configuration
let game = new Phaser.Game(config);

//The scene life cycle: init() >> preload() >> create() >> update()

/*
When a scene starts, the init method is called. This is where you can setup parameters for your scene or game.
What comes next is the preloading phaser (preload method). As explained previously, Phaser loads images and assets into memory before launching the actual game. A great feature of this framework is that if you load the same scene twice, the assets will be loaded from a cache, so it will be faster.
Upon completion of the preloading phase, the create method is executed. This one-time execution gives you a good place to create the main entities for your game (player, enemies, etc).
While the scene is running (not paused), the update method is executed multiple times per second (the game will aim for 60. On less-performing hardware like low-range Android, it might be less). This is an important place for us to use as well.
*/

gameScene.init = function() {
	
	this.playerSpeed = 1.5;
	this.enemySpeed = 2;
	this.enemyMaxY = 280;
	this.enemyMinY = 80;
};

gameScene.preload = function() {
	
	this.load.image('background','assets/background.png');
	this.load.image('player','assets/player.png');
	this.load.image('dragon','assets/dragon.png');
	this.load.image('treasure','assets/treasure.png');
	
};

// Executed once, after assets were loaded

gameScene.create = function() {
	
	// background
	let bg = this.add.sprite(0, 0, 'background');
	
	// Change the origin to the top-left of the background sprite
	bg.setOrigin(0,0);
	
	//Player
	this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');
	
	//Enemies
	this.enemies = this.add.group({
		
		key: 'dragon',
		repeat: 5,
		setXY: {
			x: 110,
			y: 100,
			stepX: 80,
			stepY: 20
		}
		
	});
	
	//Scale the dragons down
	Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);
	
	//Scale the player down
	this.player.setScale(0.5);
	
	//Goal
	this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height /2, 'treasure');
	this.treasure.setScale(0.6);
	
};

//Check for user input using the update mehtod

gameScene.update = function() {

	// Enemy movement
	let enemies = this.enemiesgetChildren();
	let numEnemies = enemies.length;
	
	for(let i = 0; i < numEnemies; i++) {
	
		//Move enemies
		enemies[i].y += enemies[i].speed;
		
		//Reverse movement if reached the edges
		if(enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
		
			enemies[i].speed *= -1;
		} else if(enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
		
			enemies[i].speed *= -1;
			
		}
		
		}
	
	}
	
	//Check for active input
	if(this.input.activePointer.isDown) {
		
		//Player Walks
		this.player.x += this.playerSpeed;
	
	}
	
	//Check for collision of the treasure and player
	if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
		
		this.gameOver();	
		
	}
		
};

gameScene.gameOver = function() {
	
	//Restart the scene
	this.scene.manager.bootScene(this);
	
};