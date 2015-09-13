'use strict';

/**
 * Events:
 *
 */
/* globals module, require, $ */
var Block = function(r, c){
    var size = 25;
    var border = 6;
    var row = r;
    var col = c;
    var visited = false;
    var gotContent = false;
    var paths = {
        t: false,
        r: false,
        d: false,
        l: false
    };
    var startingBlock = false;
    var exitBlock = false;

    var drawWall = function(from, to){
        require('scripts/display').drawLine(from, to, border);
    };

    return{
        wallCount: function(){
            var walls = 0;
            if ( !paths.t ){ ++walls; }
            if ( !paths.r ){ ++walls; }
            if ( !paths.d ){ ++walls; }
            if ( !paths.l ){ ++walls; }
            return  walls;
        },
        isConnected: function(){
            return paths.t || paths.r || paths.d || paths.l;
        },
        isConnectedTo: function(direction){
            return paths[direction];
        },
        setPathFrom: function(direction){
            var fromPaths = {
                t: 'd',
                r: 'l',
                d: 't',
                l: 'r'
            };
            paths[fromPaths[direction]] = true;
        },
        setPathTo: function(direction){
            paths[direction] = true;
        },
        setStarting: function(){
            startingBlock = true;
        },
        setExit: function(){
            exitBlock = true;
        },
        visit: function(){
            visited = true;
        },
        wasVisited: function(){
            return visited;
        },
        clearContent: function(){
            gotContent = false;
        },
        setContent: function(){
            gotContent = true;
        },
        hasContent: function(){
            return gotContent;
        },
        reDraw: function(){
            this.clear();
            this.draw();
            $.trigger('redrawBlock_'+row+'_'+col, {block: this});
        },
        clear: function(){
            var top = row * size;
            var left = col * size;
            var cSize = size + border;
            require('scripts/display').clear(top,left,cSize,cSize);
        },
        draw: function(){
            if ( !paths.t ){
                var tFrom = {
                    x: col*size,
                    y: row*size
                };
                var tTo = {
                    x: (col+1)*size,
                    y: row*size
                };
                drawWall(tFrom, tTo);
            }

            if ( !paths.r ){
                var rFrom = {
                    x: (col+1)*size,
                    y: row*size
                };
                var rTo = {
                    x: (col+1)*size,
                    y: (row+1)*size
                };
                drawWall(rFrom, rTo);
            }

            if ( !paths.d ){
                var dFrom = {
                    x: (col+1)*size,
                    y: (row+1)*size
                };
                var dTo = {
                    x: col*size,
                    y: (row+1)*size
                };
                drawWall(dFrom, dTo);
            }

            if ( !paths.l ){
                var lFrom = {
                    x: col*size,
                    y: (row+1)*size
                };
                var lTo = {
                    x: col*size,
                    y: row*size
                };
                drawWall(lFrom, lTo);
            }
        },
        row: row,
        col: col,
        size: size,
        border: border
    };
};
module.exports = Block;
