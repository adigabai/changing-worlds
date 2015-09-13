'use strict';
/**
 * Events:
 * gamePaused
 * gameContinued
 */
/* globals $, module, require */
var Story = require('scripts/story');
var Moves = require('scripts/moves');
var Player = require('scripts/player');
var Maze = require('scripts/maze');

var Game = (function() {
    var name = 'Changing Worlds';
    var playerMovement = new Moves();
    var state = 'paused';
    var story = new Story("article");
    var maze = new Maze();
    var player = new Player();

    playerMovement.registerEvents();

    $('title').text = name;

    var toggleByVisibility = function() {
        var game = require('scripts/game');
        if( document.hidden ){
            game.pause();
        } else {
            game.continue();
            require('scripts/notify').show('info', 'Welcome Back');
        }
    };

    return {
        story: story,
        maze: maze,
        player: player,
        pause: function(){
            state = 'paused';
            $.trigger('gamePaused');
            $("main").className = 'paused';
        },
        continue: function(){
            state = 'running';
            $.trigger('gameContinued');
            $("main").className = '';
        },
        isRunning: function(){
            if (state === 'running') {
                return true;
            }
        },
        displayEvents: function(){
            document.addEventListener("visibilitychange", toggleByVisibility, false);
        },
        start: function(){
            story.start();
        },
        end: function(){
            document.removeEventListener("visibilitychange", toggleByVisibility, false);
            story.finish();
        },
        endEpisode: function(){
            maze.openExit();
        }
    };
})();

module.exports = Game;