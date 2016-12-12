var MenuState = {
  preload: function() {
    game.load.image('screen_menu', 'assets/images/main_splash_menu.png');
    this.load.image('background', 'assets/images/background.png');
    this.load.image('exit_btn', 'assets/images/exit_btn.png');
    this.load.image('pets', 'assets/images/pets.png');
    this.load.spritesheet('bird', 'assets/images/spritesheet.png', 160, 104, 3);
    this.load.atlasJSONHash('sprite', 'assets/images/spritesheet.png', 'assets/sprites.json');
    this.load.atlasJSONHash('menu_sprite', 'assets/images/menu_spritesheet.png', 'assets/menu_sprites.json');
    this.load.atlasJSONHash('menu_sprite_2', 'assets/images/menu_sprite_2.png', 'assets/menu_sprite_2.json');
    this.game.load.json('settings', 'assets/data/settings.json');
  },

  create: function() {
    game.add.sprite(0, 0, 'screen_menu');
    // game.input.onDown.add(this.startGame1, this);

    var playButton = game.add.sprite(game.width/2, (game.height/2) + 350, 'menu_sprite_2');
    playButton.frameName = 'menu_div';
    playButton.anchor.set(0.5);
    playButton.scale.setTo(3);

    var style = {
      font: '56px OpenDyslexic',
      fontSizeWeight: 'bold',
      fill: '#000000',
      stroke: '#ffffff',
      strokeThickness: 6,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: playButton.width
    };
    var text = game.add.text(playButton.x, playButton.y, 'TARA NA!', style);
    text.anchor.set(0.5);

    playButton.inputEnabled = true;
    playButton.events.onInputDown.add(this.startGame1, this);
  },

  startGame1: function() {
    game.state.start('screen_rewards');
  }
}
