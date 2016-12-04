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

    // this.addBalloon();
    // this.addBalloon();
    this.c = this.addBalloon();
  },


  update: function() {
    this.bird.angle += this.birdAngleDelta;

    this.game.physics.arcade.collide(this.bird, this.balloons);

    // if (this.bird.y < 0 || this.bird.y > 1200)
    //   this.restartGame();
    var _gameState = this;
    this.balloons.forEach(function(balloon) {
      if (balloon.y <= (balloon.height/2.0) * -1 ||
          balloon.x <= (balloon.width/2.0) * -1) {
        // balloon.kill();
        _gameState.killAndRevive(balloon);
      }
    });
  },


  render: function() {
    this.game.debug.spriteInfo(this.c, 64, 64);
  },


  // bird actions
  jump: function(o) {
    this.bird.body.velocity.y = this.birdVelocityY;
    if (this.bird.angle > this.birdAngleMax) {
      this.bird.angle = this.birdAngleMax/2;
    }
  },

  hitBalloon: function(bird, balloon) {
    // balloon.destroy();
    this.killAndRevive(balloon);
  },

  killAndRevive: function(balloon) {
    balloon.kill();
    balloon.revive();
    balloon.x = this.game.rnd.integerInRange(800, 1600);
    balloon.y = this.game.rnd.integerInRange(60, 1240);
    this.game.physics.arcade.accelerateToXY(balloon, 0, balloon.y);
  },


  // balloon actions
  addBalloon: function(x, y, color) {
      var x = x ? x: this.game.rnd.integerInRange(800, 1600);
      var y = y ? y: this.game.rnd.integerInRange(60, 1240);
      var balloon = this.game.add.sprite(x, y, 'sprite');
      balloon.scale.setTo(1.1);
      balloon.animations.add(
        'fly_balloon',
        Phaser.Animation.generateFrameNames('balloon_red_', 1, 3, '', 2), 10, true);
      balloon.animations.play('fly_balloon');
      this.balloons.add(balloon);

      this.game.physics.arcade.enable(balloon, Phaser.Physics.ARCADE);
      this.game.physics.arcade.accelerateToXY(balloon, 0, balloon.y, 180);
      // balloon.body.gravity.y = -20;
      // balloon.body.collideWorldBounds = true;
      return balloon;
  },


  // game actions
  restartGame: function() {
    game.state.start('GameState');
  }
};


game.state.add('GameState', GameState);
game.state.start('GameState');
