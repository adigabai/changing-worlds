'use strict';
/**
 *
 */
/* globals $, require, module */
var Content = require('scripts/content');

var Player = function(){
    Content.call(this);
    this.name = 'Player';
    this.image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAMAAACf4xmcAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURYOk3ExpcXKNtPr8/w5r+WuJuABm/wBm/2ek/wBm/4O1/0N90wxt/x54/wBm/0qT/1dL1vkAAAAMdFJOUxcAWijonkzE8YyZ1GwLKe4AAAE6SURBVDjLzdRJcsQgDAVQmWZojID73zZCQgymku5lfnnhglfygAAuCbS8trSRS6eneh2ZEDYF9wh092A0SJPvEZHqYLwYVXrXqoruGjyYuVOluaqKkm6jTpmJNtfd5Wyj2ZknldVVKcbOb4yVuKqmxcaVxYAo47myzcIQQxwMfLCIA460MRs8KIu2FHb4QFiKjZ1RsdJCg7iHh7kc9GK/h8vR5T8xLyyUPxOYwWcG/5x9+aUb2xdgZ/p712WaVH9vX6yxpJmv4XSxWh+RKl0s7cEdoks/G6khzNJPWm40kpTDreEYN7e0pTS5KOxKqy1NfrWNpQ/VZ4prW2vsBZhOvkHveQPCZMYEi0dsMObBXDqcTe5kLu3QpuQezDTGsEvLyJ3V2BHUOFEL665Lsk6N2U4kOQfNERjH4A8bvi3FqR5ZEgAAAABJRU5ErkJggg==';
    //this.assets = require('scripts/assets')();

    this.setName = function(name){
        this.name = name;
    };

    this.movePlayer = function(newBlock){
        var oldBlock = this.block;
        this.moveToBlock(newBlock);
        $.trigger('leftBlock_'+oldBlock.row + '_' + oldBlock.col);
        $.trigger('reachedBlock_'+this.block.row + '_' + this.block.col);
    };

    this.moveLeft = function(){
        if ( this.block.col > 0 ){
            if ( this.block.isConnectedTo('l') ){
                var newBlock = require('scripts/game').maze.getBlock(this.block.row, this.block.col - 1);
                this.movePlayer(newBlock);
            }
        }
    };

    this.moveRight = function(){
        var Game = require('scripts/game');
        var maxCol = Game.maze.size - 1;
        if ( this.block.col < maxCol ){
            if ( this.block.isConnectedTo('r') ){
                var newBlock = Game.maze.getBlock(this.block.row, this.block.col + 1);
                this.movePlayer(newBlock);
            }
        }
    };

    this.moveUp = function(){
        if ( this.block.row > 0 ){
            if ( this.block.isConnectedTo('t') ){
                var newBlock = require('scripts/game').maze.getBlock(this.block.row - 1, this.block.col);
                this.movePlayer(newBlock);
            }
        }
    };

    this.moveDown = function(){
        var Game = require('scripts/game');
        var maxRow = Game.maze.size - 1;
        if ( this.block.row < maxRow ){
            if ( this.block.isConnectedTo('d') ){
                var newBlock = Game.maze.getBlock(this.block.row + 1, this.block.col);
                this.movePlayer(newBlock);
            }
        }
    };
};
Player.prototype = Object.create(Content.prototype);
Player.prototype.constructor = Player;

module.exports = Player;