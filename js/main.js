var game = new Phaser.Game(720, 1280, Phaser.AUTO);
var debug = false;
var balloonColors = ['red', 'blue', 'green', 'orange', 'yellow'];
var kiteColors = ['red', 'blue', 'green', 'orange', 'yellow'];

var menus = {
  pause: {x: 640, y: 20, frame: 'menu_pause'},
  play: {x: 640, y: 20, frame: 'menu_play'},
  redScoreBoard: {x: 20, y: 20, frame: 'score_board_red', board: true},
  yellowScoreBoard: {x: 140, y: 20, frame: 'score_board_yellow', board: true},
  orangeScoreBoard: {x: 260, y: 20, frame: 'score_board_orange', board: true},
  blueScoreBoard: {x: 380, y: 20, frame: 'score_board_blue', board: true},
  greenScoreBoard: {x: 500, y: 20, frame: 'score_board_green', board: true},
};

var GameState = {


  preload: function() {
    this.load.image('background', 'assets/images/background.png');
    this.load.spritesheet('bird', 'assets/images/spritesheet.png', 160, 104, 3);
    this.load.atlasJSONHash('sprite', 'assets/images/spritesheet.png', 'assets/sprites.json');
    this.load.atlasJSONHash('menu_sprite', 'assets/images/menu_spritesheet.png', 'assets/menu_sprites.json');
    this.game.load.json('settings', 'assets/data/settings.json');
  },


  create: function() {
    var settings = this.game.cache.getJSON('settings');
    this.backgroundSpeed = settings.backgroundSpeed || 1;
    this.birdAngleMax = settings.birdAngleMax || -45;
    this.birdAngleDelta = settings.birdAngleDelta || 0.85;
    this.birdVelocityY = settings.birdVelocityY || -1000;
    this.birdGravity = settings.birdGravity || 2400;
    this.balloonVelocityX = settings.balloonVelocityX || -300;
    this.numberOfBalloons = settings.numberOfBalloons || 6;
    this.kiteVelocityX = settings.kiteVelocityX || -400;
    this.numberOfKites = settings.numberOfKites || 2;
    this.startGoal = settings.startGoal || 1;
    this.balloonsCompleted = [];

    this.game.paused = true;
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

    // score boards
    this.boards = [];
    this.texts = {};
    for (var o in menus) {
      if (menus.hasOwnProperty(o) && menus[o].board === true) {
        var menu = menus[o];
        var scoreBoard = game.add.sprite(
          menu.x, menu.y, 'menu_sprite');
        scoreBoard.frameName = menu.frame;
        var style = {
          font: '46px OpenDyslexic',
          fontSizeWeight: 'bold',
          fill: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4,
          align: 'center',
          wordWrap: true,
          wordWrapWidth: scoreBoard.width
        };
        var text = game.add.text(
          (scoreBoard.x + scoreBoard.width/2) + 20,
          (scoreBoard.y + scoreBoard.height/2) - 8,
          '' + this.startGoal + '',
          style
        );
        text.anchor.set(0.5);
        var colorName = menu.frame.split('_');
        colorName = colorName[colorName.length-1];
        text._ID_name = colorName;
        text._ID_intValue = this.startGoal;
        this.texts[text._ID_name] = text;
        this.boards.push(scoreBoard);
      }
    }

    // Setup menu
    var pauseMenu = menus.pause;
    var playMenu = menus.play;
    this.pauseButton = game.add.sprite(
      pauseMenu.x, pauseMenu.y, 'menu_sprite');
    this.pauseButton.frameName = pauseMenu.frame;
    this.pauseButton.inputEnabled = true;
    this.pauseButton.events.onInputUp.add(function () {
      this.game.paused = true;
      this.pauseButton.frameName = playMenu.frame;
    },this);

    this.game.input.onDown.add(function () {
      if (this.game.paused) {
        this.game.paused = false;
        this.pauseButton.frameName = pauseMenu.frame;
      }
    }, this);

    // Attach event listeners to bird
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
    var scoreText = this.texts[balloon._ID_color];
    if (scoreText._ID_intValue > 0) {
      scoreText._ID_intValue--;
      scoreText.text = scoreText._ID_intValue;
    }
    if (scoreText._ID_intValue <= 0) {
      scoreText.text = '✓';
      if (this.balloonsCompleted.indexOf(scoreText._ID_name) <= -1) {
        this.balloonsCompleted.push(scoreText._ID_name);
      }
    }

    if (this.balloonsCompleted.length === balloonColors.length) {
      console.log('complete!');
      this.game.paused = true;
    }
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
    balloon._ID_color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    var framePrefix = 'balloon_' + balloon._ID_color + '_';
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
