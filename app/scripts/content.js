"use strict";
/* globals module, require, $ */
var Content = function(){
    this.block = null;
    this.image = '';
    var padding = 5;

    this.setBlock = function(b){
        this.block = b;
        b.setContent();
        var contentObj = this;
        $.on('redrawBlock_'+ b.row+'_'+ b.col, function(event){
            if(contentObj.block.row === event.data.block.row && contentObj.block.col === event.data.block.col){
                contentObj.draw();
            }
        });
    };
    this.moveToBlock = function(b){
        this.clear();
        this.setBlock(b);
        this.draw();
    };
    this.clear = function(){
        this.block.clearContent();
        var top = this.block.row * this.block.size + this.block.border;
        var left = this.block.col * this.block.size + this.block.border;
        var cSize = this.block.size - this.block.border;
        require('scripts/display').clear(top,left,cSize,cSize);
    };
    this.draw = function(){
        var top = this.block.row * this.block.size + padding * 1.5;
        var left = this.block.col * this.block.size + padding * 1.5;
        var size = this.block.size - padding * 2;
        require('scripts/display').drawImage(this.image, top, left, size, size);
    };
    this.addMouseOver = function(inCallback, outCallback){
        var size = this.block.size - padding * 2;
        var top = this.block.row * this.block.size + padding * 1.5;
        var left = this.block.col * this.block.size + padding * 1.5;
        require('scripts/display').addMouseOver(top, left, size, size, inCallback, outCallback);
    };
};

module.exports = Content;