var graphics;

var letterPoints = {
    'A': [
        [427, 416],
        [384, 472],
        [351, 537],
        [306, 602],
        [272, 659],
        [238, 719],
        [207, 776],
        [423, 409],
        [438, 472],
        [445, 533],
        [447, 607],
        [452, 654],
        [461, 719],
        [465, 776],
        [306, 611],
        [375, 611],
        [445, 605],
    ]
};

var GameLetterTraceState = {
    create: function() {
        this.letter = 'A';
        this.goalPoints = letterPoints[this.letter];
        game.stage.backgroundColor = '#57D37D';
        var style = {
          font: '600px DNManuscript',
          align: 'center',
        };
        var text = game.add.text(game.width/2, game.height/2, this.letter, style);
        text.anchor.set(0.5);

        this.drawOn = false;
        graphics = game.add.graphics(0, 0);
        graphics.anchor.set(0.5);

        this.game.input.onDown.add(this.startDraw, this);
        this.game.input.onUp.add(this.endDraw, this);
    },

    startDraw: function() {
        this.drawOn = true;
    },

    endDraw: function() {
        this.drawOn = false;
        graphics.endFill();
    },

    update: function() {
        var _this = this;
        if (this.drawOn) {
            drawStart();
        } else {
            drawEnd();
        }

        function drawStart() {
            graphics.beginFill(0xD55BD9);
            graphics.drawCircle(game.input.x, game.input.y, 40);
            var onPath = cursorOnPath(_this.letter, {x: game.input.x, y: game.input.y}, 10);
            if (onPath) {
                var complete = checkComplete(onPath);
                if (complete) {
                    player.merit = 100;
                    gamification.win();
                    game.state.start('screen_feedback');
                }
            }
        }

        function drawEnd() {
            graphics.endFill();
            var onPath = cursorOnPath(_this.letter, {x: game.input.x, y: game.input.y}, 10);
        }

        function cursorOnPath(letter, point, allowance) {
            var targetPoints = letterPoints[letter];
            for (var i = 0; i < targetPoints.length; i++) {
                var targetPoint = targetPoints[i];
                if ((point.x >= targetPoint[0] - allowance && point.x <= targetPoint[0] + allowance) &&
                    (point.y >= targetPoint[1] - allowance && point.y <= targetPoint[1] + allowance)) {
                    return targetPoint;
                }
            }
            return false;
        }

        function checkComplete(point) {
            if (point) {
                var index;
                for (var i = 0; i < _this.goalPoints.length; i++) {
                    var dPoint = _this.goalPoints[i];
                    if (dPoint[0] === point[0] && dPoint[1] === point[1]) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    _this.goalPoints.splice(index, 1);
                }
            }
            return _this.goalPoints.length <= 0;
        }
    }
};
