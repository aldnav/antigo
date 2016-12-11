var ScreenRewardState = {

  create: function() {
    if (player.gameOver) {
      gamification.reset();
    }
    game.stage.backgroundColor = "#4488AA";
    var centerX = game.width/2;
    var centerY = game.height/2;

    var settingsButton = game.add.sprite(centerX + 100, game.height - 200, 'menu_sprite_2');
    settingsButton.frameName = 'menu_settings';
    settingsButton.anchor.setTo(0.5);
    settingsButton.scale.set(1.5);
    settingsButton.inputEnabled = true;

    var playButton = game.add.sprite(centerX - 100, game.height - 200, 'menu_sprite');
    playButton.frameName = 'menu_play';
    playButton.anchor.setTo(0.5);
    playButton.scale.set(1.5);
    playButton.inputEnabled = true;
    playButton.events.onInputDown.add(this.playGame, this);
  },

  playGame: function() {
    // @NOTE: do the random sampling of mini-games
    game.state.start('play_birdcolorpop');
  }
};
