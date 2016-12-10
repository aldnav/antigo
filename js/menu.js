var MenuState = {
  preload: function() {
    game.load.image('screen_menu', 'assets/images/main_splash_menu.png');
    this.load.image('background', 'assets/images/background.png');
    this.load.spritesheet('bird', 'assets/images/spritesheet.png', 160, 104, 3);
    this.load.atlasJSONHash('sprite', 'assets/images/spritesheet.png', 'assets/sprites.json');
    this.load.atlasJSONHash('menu_sprite', 'assets/images/menu_spritesheet.png', 'assets/menu_sprites.json');
    this.game.load.json('settings', 'assets/data/settings.json');
  },

  create: function() {
    game.add.sprite(0, 0, 'screen_menu');
    game.input.onDown.add(this.startGame1, this);
  },

  startGame1: function() {
    game.state.start('play_birdcolorpop');
  }
}
