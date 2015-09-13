'use strict';
/**
 * Events:
 *
 */
/* globals $, require, module */
var Moves = function(){
    var timeoutKey = null;
    var pendingTime = 0;
    var sinceTime = null;
    this.paused = true;
    var minTime = 15;
    var maxTime = 35;
    this.direction = 't';
    var directions = {
        t: ['Up', 'Right', 'Down', 'Left'],
        r: ['Right', 'Down', 'Left', 'Up'],
        d: ['Down', 'Left', 'Up', 'Right'],
        l: ['Left', 'Up', 'Right', 'Down']
    };
    var keys = [
        37, // Left
        38, // Up
        39, // Right
        40, // Down
        87, // W
        65, // A
        83, // S
        68 // D
    ];

    this.registerEvents = function(){
        var mover = this;
        document.addEventListener('keydown', function(event){
            mover.checkKeys(event);
        });

        $.on('gamePaused', function (){
            window.clearTimeout(timeoutKey);
        });

        /**$.on('stopCompass', function(event){
            var type = event.data.type;
            window.clearTimeout(timeoutKey);
            mover.paused = true;
            var el = document.createElement('p');
            el.className = 'disabled';
            el.innerHTML = 'X';
            $("#compass").appendChild(el);
            mover.direction = 't';
            $("#dial").className = 't';
            setTimeout(function(){
                mover.paused = false;
                mover.setRandomDirectionChange();
                require('scripts/game').player.assets.hide(type);
                $("#compass").removeChild($("#compass .disabled"));
            }, event.data.delay * 1000);
        });*/

        $.on('gameContinued', function (event){
            if(mover.paused) {
                mover.setRandomDirectionChange(event);
            }
        });
    };

    this.setRandomDirectionChange = function(){
        var mover = this;
        mover.paused = false;

        /**
         * @todo: right now, that is a possible "cheating" point, changing tabs can prevent the direction from changing
         * once the 13k limitation is lifted, need to change it to capture the remaining time instead.
         */
        var delay = Math.floor(Math.random() * (maxTime - minTime)) + minTime;

        pendingTime = delay;
        sinceTime = Date.now();
        timeoutKey = window.setTimeout(function(){
            var directions = ['t', 'r', 'd', 'l'];
            var rnd = Math.floor(Math.random() * directions.length);
            var oldDirection = mover.direction;
            mover.direction = directions[rnd];
            $("#dial").className = directions[rnd];

            if ( oldDirection !== mover.direction ) {
                require('scripts/notify').show('info', 'Movement direction changed');
            }
            mover.setRandomDirectionChange();
        }, delay * 1000);
    };

    this.checkKeys = function(event){
        var supportedStr = '_'+keys.join('_')+'_';
        if(supportedStr.indexOf('_'+event.keyCode+'_') !== -1){
            event.preventDefault();
            var player = require('scripts/game').player;
            switch (event.keyCode) {
                case 37: // left arrow
                case 65: // a
                    player["move"+directions[this.direction][3]]();
                    break;
                case 38: // up arrow
                case 87: // w
                    player["move"+directions[this.direction][0]]();
                    break;
                case 39: // right arrow
                case 68: // d
                    player["move"+directions[this.direction][1]]();
                    break;
                case 40: // down arrow
                case 83: // s
                    player["move"+directions[this.direction][2]]();
                    break;
            }
        }
    };
};

module.exports = Moves;