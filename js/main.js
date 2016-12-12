var game = new Phaser.Game(720, 1280, Phaser.AUTO);
var reg = {};
var player = {
  lives: 3,
  score: 0,
  rallyScore: 0,
  lastAttemptStatus: 'lose',
  merit: 0,
  demerit: 0,
  gameOver: false
};
var gamification = {
  gameSequence: ['play_lettertrace', 'play_birdcolorpop'],
  gameSequenceIndex: 0,
  win: function(merit) {
    player.merit = merit ? merit: 100;
    player.lastAttemptStatus = 'win';
  },

  lose: function(demerit) {
    player.demerit = demerit ? demerit: 0;
    player.lastAttemptStatus = 'lose';
    --player.lives;
    if (player.lives <= 0) {
      player.gameOver = true;
    }
  },

  reset: function() {
    player.rallyScore = 0;
    player.lives = 3;
    player.merit = 0;
    player.demerit = 0;
    player.gameOver = false;
  },

  getNextGame: function() {
    var g = this.gameSequence[this.gameSequenceIndex];
    if (this.gameSequenceIndex + 1 >= this.gameSequence.length) {
        this.gameSequenceIndex = 0;
    } else {
        this.gameSequenceIndex++;
    }
    return g;
  }
};

game.state.add('boot', BootState);
game.state.add('menu', MenuState);
game.state.add('screen_rewards', ScreenRewardState);
game.state.add('screen_feedback', ScreenFeedbackState);
game.state.add('play_birdcolorpop', GameState); // label is temporary
game.state.add('play_lettertrace', GameLetterTraceState);

game.state.start('boot');
