'use strict';
/**
 * Events:
 * mazeBuilt
 * mazeReset
 * mazeDisplayed
 */
/* globals $, module, require */

var Maze = function(){
    var baseSize = 20;
    var blocks = [];
    var size = baseSize;
    var visited = [];
    var startingBlock = {};
    var _exitBlock = null;
    var Block = require('scripts/block');
    var ExitBlock = require('scripts/special_blocks').ExitBlock;
    //var BonusManager = require('scripts/special_blocks').BonusManager;

    (function initBlocks(){
        for(var r=0; r < size; ++r){
            blocks[r] = [];
            for(var c=0; c < size; ++c) {
                blocks[r][c] = new Block(r, c);
            }
        }
    })();

    return {
        /**getBaseSize: function(){
            return baseSize;
        },*/
        size: size,
        buildPath: function(fBlock, lBlock, direction) {
            fBlock.setPathTo(direction);
            lBlock.setPathFrom(direction);
        },
        allConnected: function(){
            var allBlocksConnected = true;

            for(var r=0; r < size && allBlocksConnected; ++r){
                for(var c=0; c < size && allBlocksConnected; ++c) {
                    allBlocksConnected = blocks[r][c].isConnected();
                }
            }

            return allBlocksConnected;
        },
        reachedExit: function(){
            require('scripts/game').end();
        },
        getExit: function(){
            return _exitBlock;
        },
        openExit: function(){
            _exitBlock.enable();
        },
        getBlock: function(row, col){
            return blocks[row][col];
        },
        reset: function(){
            $.trigger("mazeReset");
        },
        visitBlock: function(row, col){
            blocks[row][col].visit();
            visited.push([row, col]);
        },
        build: function(){
            // Choose a random cell along the first column
            var row = Math.floor(Math.random() * size);
            var col = 0;
            this.visitBlock(row, col);
            blocks[row][col].setStarting();
            var Game = require('scripts/game');
            Game.player.setBlock(blocks[row][col]);
            startingBlock.row = row;

            // For all the bricks on the board
            // Get random neighbor
            var neighbors = this.getAdjustedBlocks(row, col);
            var neighborInfo = [];
            while (neighbors.length > 0 && !this.allConnected()) {
                // ok, let go over the neighbors in a random order
                var neighbor = null;
                while (neighbors.length > 0) {
                    var nIdx = Math.floor(Math.random() * neighbors.length);
                    neighborInfo = neighbors.splice(nIdx, 1)[0];
                    neighbor = blocks[neighborInfo[0]][neighborInfo[1]];
                    if (!neighbor.wasVisited()) {
                        break;
                    } else {
                        neighbor = null;
                    }
                }

                if (neighbor) {
                    this.visitBlock(neighborInfo[0], neighborInfo[1]);
                    this.buildPath(blocks[row][col], neighbor, neighborInfo[2]);
                } else {
                    // Need to go back a step and get the neighbors from there
                    var previous = visited.pop();
                    if ( previous ){
                        row = previous[0];
                        col = previous[1];
                    } else {
                        // We reached the start of visited???
                        break;
                    }
                }
                neighbors = this.getAdjustedBlocks(row, col);
            } // End while neighbors

            // Mark the exit
            var exitInfo = visited[visited.length-1];
            blocks[exitInfo[0]][exitInfo[1]].setExit();
            _exitBlock = new ExitBlock();
            _exitBlock.setBlock(blocks[exitInfo[0]][exitInfo[1]]);
            _exitBlock.disable();

            // Place bonuses
            //var numOfBonusBlocks = BonusManager.getCount();
            /**var bBlocks = [];
            for(var i=0;i<numOfBonusBlocks;++i){
                bBlocks.push(this.getRandomBlock());
            }
            BonusManager.placeAll(bBlocks);*/

            $.trigger('mazeBuilt', {exitB: _exitBlock});
            this.draw();
            //Game.player.assets.draw();
            $.trigger('mazeDisplayed');
            Game.continue();
        },
        getAdjustedBlocks: function(row, col){
            var adjustedPaths = [];
            // top
            if ( row > 0 ){
                adjustedPaths.push([row - 1, col, 't']);
            }
            // right
            if ( col < size - 1 ){
                adjustedPaths.push([row, col + 1, 'r']);
            }
            // down
            if ( row < size - 1 ){
                adjustedPaths.push([row + 1, col, 'd']);
            }
            // left
            if ( col > 0 ){
                adjustedPaths.push([row, col - 1, 'l']);
            }

            return adjustedPaths;
        },
        getBlockAndWall: function(coords){
            var size = blocks[0][0].size;
            var col = Math.floor(coords.x / size);
            var row = Math.floor(coords.y / size);
            var spaceFromRightWall = size * (col + 1) - coords.x;
            var spaceFromBottomWall = size * (row + 1) - coords.y;

            // Figure out if top or bottom
            var wallCandidates = {
                h: {
                    name: 'r',
                    distance: spaceFromRightWall
                },
                v: {
                    name: 'b',
                    distance: spaceFromBottomWall
                }
            };
            if (spaceFromRightWall - size / 2 <= size * col){
                wallCandidates.h.name = 'l';
                wallCandidates.h.distance = size - spaceFromRightWall;
            }
            if (spaceFromBottomWall - size / 2 <= size * row){
                wallCandidates.v.name = 'l';
                wallCandidates.v.distance = size - spaceFromBottomWall;
            }

            return {
                block: blocks[row][col],
                wall: wallCandidates.v.distance < wallCandidates.h.distance ? wallCandidates.v.name : wallCandidates.h.name
            };
        },
        getRandomCorneredBlock: function(){
            // @todo make sure this won't turn into an infinite loop
            var walls = 0;
            var block = {};
            while (walls !== 3){
                block = this.getRandomBlock();
                walls = block.wallCount();
            }
            return block;
        },
        getRandomBlock: function(){
            var col = 0;
            var row = 0;
            var empty = false;
            var block = null;
            while(!empty){
                row = Math.floor(Math.random() * size);
                col = Math.floor(Math.random() * size);
                block = blocks[row][col];
                if ( !block.startingBlock && !block.exitBlock && !block.active && !block.hasContent()){
                    empty = true;
                }
            }
            return block;
        },
        draw: function(){
            var blockSize = blocks[0][0].size;
            require('scripts/display').setSize(blockSize*size+blocks[0][0].border, blockSize*size+blocks[0][0].border);

            for(var r=0; r < size; ++r){
                for(var c=0; c < size; ++c) {
                    blocks[r][c].draw();
                }
            }
            require('scripts/game').player.draw();
        }
    };
};

module.exports = Maze;