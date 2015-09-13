'use strict';
/* globals $, require */
function alterByPattern(){
    // @todo Extra, to remove if too missing space
    /**
     * Pattern 1: go over all the rows and cols
     * and check 4x4 for all 4 cells with 3 walls.
     */
    var maze = require('scripts/game').getMaze();
    var size = maze.size;

    for(var r=0; r < size - 1; ++r){
        for(var c=0; c < size - 1; ++c) {
            var block = maze.getBlock(r, c);
            if ( block.wallCount() === 3 ){
                if ( block.isConnectedTo('t') ){
                    if ( maze.getBlock(r+1,c).wallCount() === 3 ){
                        if ( maze.getBlock(r+1,c).isConnectedTo('l') ){
                            if ( maze.getBlock(r, c+1).wallCount() === 3 ){
                                if ( maze.getBlock(r, c+1).isConnectedTo('r') ){
                                    if ( maze.getBlock(r+1,c+1).wallCount() === 3 ){
                                        if ( maze.getBlock(r+1,c+1).isConnectedTo('d') ){
                                            // Found pattern 1
                                            maze.buildPath(block, maze.getBlock(r+1,c), 'd');
                                            maze.buildPath(maze.getBlock(r,c+1), maze.getBlock(r+1,c+1), 'd');
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } // End for all col
    }
    // End pattern 1 check
}

$.on('mazeBuilt', alterByPattern);