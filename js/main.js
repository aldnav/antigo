var game = new Phaser.Game(720, 1280, Phaser.AUTO);

game.state.add('boot', BootState);
game.state.add('menu', MenuState);
game.state.add('screen_rewards', ScreenRewardState);
game.state.add('play_birdcolorpop', GameState); // label is temporary

game.state.start('boot');
