var game = new Phaser.Game(720, 1280, Phaser.AUTO);


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
  },


  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // test
    // this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT; // deploy

    this.background = this.game.add.sprite(0, 0, 'background');
    this.balloons = this.game.add.group();

    this.bird = this.game.add.sprite(80, this.game.world.centerY / 2, 'bird');
    this.bird.anchor.setTo(0.5);
    this.bird.scale.setTo(0.9);
    this.bird.animations.add('fly');
    this.bird.animations.play('fly', 15, true);

    this.game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = this.birdGravity;
    this.bird.body.collideWorldBounds = true;
    this.bird.body.onCollide = new Phaser.Signal();
    this.bird.body.onCollide.add(this.hitBalloon, this);

    this.game.input.onDown.add(this.jump, this);

    this.balloonRed = this.game.add.sprite(700, 1000, 'sprite');
    this.balloonRed.scale.setTo(1.1);
    this.balloonRed.animations.add(
      'fly_balloon',
      Phaser.Animation.generateFrameNames('balloon_red_', 1, 3, '', 2), 10, true);
    this.balloonRed.animations.play('fly_balloon');

    this.game.physics.arcade.enable(this.balloonRed, Phaser.Physics.ARCADE);
    this.game.physics.arcade.accelerateToXY(this.balloonRed, 0, this.balloonRed.y, 180);
    this.balloonRed.body.gravity.y = -20;
    this.balloonRed.body.collideWorldBounds = true;

    this.addBalloon(500, 500);
  },


  update: function() {
    this.bird.angle += this.birdAngleDelta;

    this.game.physics.arcade.collide(this.bird, this.balloonRed);

    // if (this.bird.y < 0 || this.bird.y > 1200)
    //   this.restartGame();
  },


  // bird actions
  jump: function(o) {
    this.bird.body.velocity.y = this.birdVelocityY;
    if (this.bird.angle > this.birdAngleMax) {
      this.bird.angle = this.birdAngleMax/2;
    }
  },

  hitBalloon: function(bird, balloon) {
    balloon.destroy();
  },


  // balloon actions
  addBalloon: function(x, y) {
      var balloon = this.game.add.sprite(x, y, 'sprite');
      balloon.scale.setTo(1.1);
      balloon.animations.add(
        'fly_balloon',
        Phaser.Animation.generateFrameNames('balloon_red_', 1, 3, '', 2), 10, true);
      balloon.animations.play('fly_balloon');
      this.balloons.add(balloon);
  },


  // game actions
  restartGame: function() {
    game.state.start('GameState');
  }
};


game.state.add('GameState', GameState);
game.state.start('GameState');
