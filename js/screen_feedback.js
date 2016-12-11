/**
 * Handles the feedback win/lose for each minigame
 * @type {Object}
 */
var ScreenFeedbackState = {
  create: function() {
    game.stage.backgroundColor = '#eff5ff';
    var feedbackImage;
    var hearts = game.add.group();
    var startX = game.width/2 - 100;
    var lives = player.lives;
    if (player.lastAttemptStatus === 'lose') {
      lives++;
    }

    this.displayScore = player.rallyScore;
    this.displayMerit = player.merit;
    this.displayDemerit = player.demerit;

    for (var i = 0; i < lives; i++) {
      var life = game.add.sprite(startX + 100*i, game.height/2, 'menu_sprite_2', 'heart_1');
      life.anchor.setTo(0.5);
      life.scale.set(1.5);
      life.animations.add('heart_shrink',
        Phaser.Animation.generateFrameNames('heart_', 1, 7, '', 1));
      hearts.add(life);
    }

    this.toAddMerit = false;
    var style = {
      font: '46px OpenDyslexic',
      fontSizeWeight: 'bold',
      fill: '#000000',
      align: 'center',
    };
    this.pointsText = game.add.text(game.width/2, game.height/2 + 150, 'PUNTOS: ' + this.displayScore + '', style);
    this.pointsText.anchor.set(0.5);

    if (player.lastAttemptStatus === 'win') {
      // add right away the merit score
      player.rallyScore += player.merit;
      feedbackImage = game.add.sprite(game.width/2, game.height/2 - 300, 'menu_sprite_2', 'face_win');
      this.toAddMerit = true;
    } else {
      player.score -= player.demerit;
      feedbackImage = game.add.sprite(game.width/2, game.height/2 - 300, 'menu_sprite_2', 'face_lose');
      loseHeart(hearts.children[hearts.children.length-1]);
    }
    feedbackImage.anchor.setTo(0.5);
    feedbackImage.scale.set(3);

    function loseHeart(lifeObj) {
      if (lifeObj) {
        lifeObj.animations.play('heart_shrink', 8, false, true);
        lifeObj.animations.currentAnim.onComplete.add(checkGameOver, this);
      }
    }

    function checkGameOver() {
      if (player.lives <= 0) {
        game.state.start('screen_rewards');
      }
    }

    var playBtn = game.add.sprite(game.width/2 - 75, game.height/2 + 300, 'menu_sprite', 'menu_play');
    playBtn.inputEnabled = true;
    playBtn.anchor.set(0.5);
    playBtn.scale.setTo(1.5);
    playBtn.events.onInputDown.add(function() {
      // @NOTE: point to game chooser and hit play
      game.state.start('play_birdcolorpop');
    });

    var quitBtn = game.add.sprite(game.width/2 + 75, game.height/2 + 300, 'exit_btn');
    quitBtn.inputEnabled = true;
    quitBtn.anchor.set(0.5);
    quitBtn.scale.setTo(0.45);
    quitBtn.events.onInputDown.add(function() {
      player.gameOver = true;
      game.state.start('screen_rewards');
    });

  },


  update: function() {
    var _this = this;
    function addMerit() {
      if (_this.displayMerit > 0) {
        _this.pointsText.setText('PUNTOS: ' + (_this.displayScore + 1) + '');
        _this.displayScore++;
        _this.displayMerit--;
      } else {
        this.toAddMerit = false;
      }
    }

    if (this.toAddMerit) {
      addMerit();
    }
  }


};
