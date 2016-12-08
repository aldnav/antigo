var game = new Phaser.Game(720, 1280, Phaser.AUTO);
var debug = false;
var balloonColors = ['red', 'blue', 'green', 'orange', 'yellow'];
var kiteColors = ['red', 'blue', 'green', 'orange', 'yellow'];

var GameState = {


  preload: function() {
    this.load.image('background', 'assets/images/background.png');
    this.load.spritesheet('bird', 'assets/images/spritesheet.png', 160, 104, 3);
    this.load.atlasJSONHash('sprite', 'assets/images/spritesheet.png', 'assets/sprites.json');

    this.backgroundSpeed = 1;
    this.birdAngleMax = -45;
    this.birdAngleDelta = 0.85;
    this.birdVelocityY = -1100;
    this.birdGravity = 2400;
    this.balloonVelocityX = -300;
    this.numberOfBalloons = 6;
    this.kiteVelocityX = -400;
    this.numberOfKites = 2;
  },


  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // test
    // this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT; // deploy

    this.background = this.game.add.sprite(0, 0, 'background');
    this.balloons = this.game.add.group();
    this.kites = this.game.add.group();

    this.bird = this.game.add.sprite(80, this.game.world.centerY / 2, 'bird');
    this.bird.anchor.setTo(0.5);
    this.bird.scale.setTo(0.9);
    this.bird.animations.add('fly');
    this.bird.animations.play('fly', 15, true);

    this.game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = this.birdGravity;
    this.bird.body.collideWorldBounds = true;
    // this.bird.body.onCollide = new Phaser.Signal();
    // this.bird.body.onCollide.add(this.hitBalloon, this);

    for (var i = 0; i < this.numberOfBalloons; i++) {
      this.addBalloon();
    }
    for (var i = 0; i < this.numberOfKites; i++) {
      this.addKite();
    }


    pause_label = game.add.text(720 - 100, 20, 'Pause', { font: '24px Arial', fill: '#fff' });
    pause_label.inputEnabled = true;

    // this.pauseButton = this.game.add.sprite(0, 0, 'pauseButton');
    this.pauseButton = pause_label;
    this.pauseButton.inputEnabled = true;
    this.pauseButton.events.onInputUp.add(function () {
      this.game.paused = true;
    },this);

    this.game.input.onDown.add(function () {
      if (this.game.paused) {
        this.game.paused = false;
      }
    }, this);

    this.game.input.onDown.add(this.jump, this);
  },


  update: function() {
    this.bird.angle += this.birdAngleDelta;

    this.game.physics.arcade.collide(this.bird, this.balloons, this.hitBalloon, null, this);
    this.game.physics.arcade.collide(this.bird, this.kites, this.restartGame);

    if (this.bird.y < 60 || this.bird.y > 1200)
      this.restartGame();
    var _gameState = this;
    this.balloons.forEach(function(balloon) {
      if (balloon.y <= (balloon.height/2.0) * -1 ||
          balloon.x <= (balloon.width/2.0) * -1) {
        _gameState.killAndRevive(balloon);
      }
    });

    this.kites.forEach(function(kite) {
      if (kite.y <= (kite.height/2.0) * -1 ||
          kite.x <= (kite.width/2.0) * -1) {
        _gameState.killAndReviveKite(kite);
      }
    });
  },


  render: function() {
  },


  // bird actions
  jump: function(o) {
    this.bird.body.velocity.y = this.birdVelocityY;
    if (this.bird.angle > this.birdAngleMax) {
      this.bird.angle = this.birdAngleMax/2;
    }
  },

  hitBalloon: function(bird, balloon) {
    this.killAndRevive(balloon);
  },

  killAndRevive: function(balloon) {
    balloon.animations.getAnimation('fly_balloon').destroy();
    balloon.kill();
    balloon.revive();
    balloon.x = (Math.floor(Math.random() * 8)*160 + this.game.width);
    balloon.y = (Math.floor(Math.random() * 10)*110 + 110);
    this.generateBalloonAnimation(balloon);
  },


  // balloon actions
  addBalloon: function(x, y, color) {
      var x = x ? x: (Math.floor(Math.random() * 8)*160 + this.game.width);
      var y = y ? y: (Math.floor(Math.random() * 10)*110 + 110);
      var balloon = this.game.add.sprite(x, y, 'sprite');
      balloon.scale.setTo(1.1);
      this.generateBalloonAnimation(balloon);
      this.balloons.add(balloon);

      this.game.physics.arcade.enableBody(balloon);
      balloon.body.allowGravity = false;
      balloon.body.immovable = true;
      balloon.body.velocity.x = this.balloonVelocityX;
      return balloon;
  },

  generateBalloonAnimation: function(balloon) {
    balloon.color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    var framePrefix = 'balloon_' + balloon.color + '_';
    balloon.animations.add(
      'fly_balloon',
      Phaser.Animation.generateFrameNames(framePrefix, 1, 3, '', 2), 10, true);
    balloon.animations.play('fly_balloon');
  },

  // kite actions
  addKite: function(x, y, color) {
    var x = x ? x: (Math.floor(Math.random() * 8)*160 + (this.game.width * 5));
    var y = y ? y: (Math.floor(Math.random() * 10)*110 + 110);
    var kite = this.game.add.sprite(x, y, 'sprite');
    kite.scale.setTo(1.1);
    this.generateKiteAnimation(kite);
    this.kites.add(kite);

    this.game.physics.arcade.enableBody(kite);
    kite.body.allowGravity = false;
    kite.body.immovable = true;
    kite.body.velocity.x = this.kiteVelocityX;
    return kite;
  },

  generateKiteAnimation: function(kite) {
    kite.color = kiteColors[Math.floor(Math.random() * kiteColors.length)];
    var framePrefix = 'kite_' + kite.color + '_';
    kite.animations.add(
      'fly_kite',
      Phaser.Animation.generateFrameNames(framePrefix, 1, 3, '', 2), 10, true);
    kite.animations.play('fly_kite');
  },

  killAndReviveKite: function(kite) {
    kite.animations.getAnimation('fly_kite').destroy();
    kite.kill();
    kite.revive();
    kite.x = (Math.floor(Math.random() * 8)*160 + (this.game.width * 3));
    kite.y = (Math.floor(Math.random() * 10)*110 + 110);
    this.generateKiteAnimation(kite);
  },

  hitKite: function(bird, kite) {
    this.restartGame();
  },


  // game actions
  restartGame: function() {
    game.state.start('GameState');
  }
};


game.state.add('GameState', GameState);
game.state.start('GameState');