'use strict';
/* globals $, module, require */
var Content = require('scripts/content');

var ExitBlock = function(){
    Content.call(this);
    var imageDisabled = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAAJFBMVEVKKA1MaXEiHhQPGR6BSBJmMwqXWRnd/v6fEQurbyRrY1OZpaBCeVihAAAABHRSTlP+ALR3m+KILQAAAQFJREFUeF6F0jFOAzEQQFErsbehwXABlBsgbgBja0VlhZmewhrJJ+ACRPIJVtoeGi6Q6zFe41jJRuIXLp7G8hRW1t4/qKXNTnq0VujWkFLkSEK3rSSiQpDDED5XChqAGcA70o0GISiEnRTVdCPSNx81xBXRmpD2a9pckr5G+6v0/0WzbWR+atq8NSJ0RASEncBzKcZGQaiYd3CiAQTAx+OX7lOJPcD78bu/CCl6P+Ir9ingxJwzxOHljxB4nmLOn3AiLcQxizWihdjlQ8ZziqOMdUozT8xjHjqV5dMcD2bbKfpCcEnTOfGKErNsy51UkAyRMbrR8rdUKVS629Welqz9BcaCkmunAVpfAAAAAElFTkSuQmCC';
    var imageEnabled = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAAHlBMVEVMaXE5IRAcGxtbMQ6SWBn//8/Y+PjY26ixsoEUewyVUZzeAAAAA3RSTlMAaDR25tHEAAAArUlEQVR4XpXPwQ3CMAxA0bYsALAAbRegdQ7cbbEBEyBV3AF1gFRw5phtcTEkJGmk8o9Psi1nQXkTCYxUVNIopSKmAmxtrQCYcnAR7E9vevSSZumEbkfpivcuou4vwi9dZtEwl85aHnIEAMS0cESKyCfNgCqigw4GiXCCsNkGBMbs/F3G+DSk6Ln0iRS24UWaIBqJ7EVLmCC3K0X9J7KD8JNQvpLWFVdueDCsbrMXzKWnf1m2mYYAAAAASUVORK5CYII=';
    this.image = imageDisabled;
    this.active = false;

    $.on('episodeFinished', function(event){
        event.data.exitB.enable();
    });
    $.on('mazeBuilt', function(event){
        event.data.exitB.registerEvents();
    });

    this.registerEvents = function(){
        var exitB = this;
        $.on('leftBlock_'+this.block.row + '_' + this.block.col, function(){
            exitB.draw();
        });
        $.on('reachedBlock_'+this.block.row + '_' + this.block.col, function(){
            if(exitB.active){
                require('scripts/game').maze.reachedExit();
            } else {
                require('scripts/notify').show('warn','You can\'t leave yet, the state of the world was not reversed yet');
            }
        });
    };
    this.enable = function(){
        this.active = true;
        this.image = imageEnabled;
        this.clear();
        this.draw();
    };
    this.disable = function(){
        this.active = false;
        this.image = imageDisabled;
        this.clear();
        this.draw();
    };
};
ExitBlock.prototype = Object.create(Content.prototype);
ExitBlock.prototype.constructor = ExitBlock;
/**
var BonusManager = (function () {
    var types = [];

    function place( idx, block ) {
        var bonusBlock = types[idx];
        var bb = new bonusBlock();
        bb.setBlock(block);
        bb.register();
        bb.draw();
    }

    return {
        getCount: function(){
            return types.length;
        },
        placeAll: function(blocks) {
            for(var i=0;i<types.length;++i){
                place(i, blocks[i]);
            }
        },
        register: function(bonusBlock){
            types.push(bonusBlock);
        }
    };
})();

var BonusBlock = function(){
    Content.call(this);
    var addToAssets = true;
    var placed = true;
    this.type = 'BonusBlock';
    this.message = 'This might be handy';
    this.listenToClick = false;

    this.register = function(){
        if ( addToAssets ){
            require('scripts/game').player.assets.register(this.type, this.name, this.image, this.listenToClick);
        }
        this.registerEvents();
    };
    this.use = function(){
        if ( addToAssets ){
            //require('scripts/notify').show('info', 'Congrats on using a: '+ this.name);
            this.useBonus();
        }
    };
    this.pickup = function(){
        if ( placed ){
            require('scripts/game').player.assets.add(this);
            require('scripts/notify').show('info', this.message);
            placed = false;
            this.clear();
        }
    };
    this.registerEvents = function(){
        var bonusB = this;
        $.on('reachedBlock_'+this.block.row + '_' + this.block.col, function(){
            if(placed){
                bonusB.pickup();
            }
        });
    };
};
BonusBlock.prototype = Object.create(Content.prototype);
BonusBlock.prototype.constructor = BonusBlock;

var BombBlock = function(){
    BonusBlock.call(this);
    this.name = 'Bomb';
    this.image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAGFBMVEWySSCfBATpt2yoPBmIAgLebGHeFBTg1cuHIAF2AAAABXRSTlMB/OdutzFtID0AAACPSURBVHheTczBCsIwDAbgzM4HiLJ6lcLuBcGzgi+g0OycSbuzQsnri6xN999+8uWHNY/Ly0NJz9G5WroU3u5cyt0i7srNYErsS+nsnBiMXxURHcuHOY2Bb3VryoRQt7I8VR3GpalBNkrko2qQ3NQy5Y0Kmy3JqCqGr6rrHLkqsESqIAZWBXtCVWD+StM39QOQyhxiIcPFNgAAAABJRU5ErkJggg==';
    this.type = 'BombBlock';
    this.listenToClick = true;
    this.message = 'Warning dynamite is known to be unstable, results are unexpected';
};
BombBlock.prototype = Object.create(BonusBlock.prototype);
BombBlock.prototype.constructor = BombBlock;
BonusManager.register(BombBlock);

BombBlock.prototype.useBonus = function(){
    require('scripts/display').waitForClick({
        click: this.click,
        cancel: this.cancelClick,
        type: this.type
    });
};
BombBlock.prototype.cancelClick = function(){
    require('scripts/game').player.assets.add(this);
};

BombBlock.prototype.click = function(blockInfo){
    var maze = require('scripts/game').maze;
    var nBlock = {};
    var noPoint = false;
    if ( blockInfo.wall === 't' ){
        if ( blockInfo.block.row !== 0){
            nBlock = maze.getBlock(blockInfo.block.row-1, blockInfo.block.col);
        } else {
            noPoint = true;
        }
    } // End top wall

    if ( blockInfo.wall === 'd' ){
        if ( blockInfo.block.row+1 < maze.size){
            nBlock = maze.getBlock(blockInfo.block.row+1, blockInfo.block.col);
        } else {
            noPoint = true;
        }
    } // End bottom wall

    if ( blockInfo.wall === 'r' ){
        if ( blockInfo.block.col < maze.size ){
            nBlock = maze.getBlock(blockInfo.block.row, blockInfo.block.col+1);
        } else {
            noPoint = true;
        }
    } // End right wall

    if ( blockInfo.wall === 'l' ){
        if ( blockInfo.block.col !== 0){
            nBlock = maze.getBlock(blockInfo.block.row, blockInfo.block.col-1);
        } else {
            noPoint = true;
        }
    } // End left wall

    if (noPoint){
        require('scripts/notify').show('warning', 'There is no point in removing this wall');
        // Re-add this block to the inventory
        this.cancelClick();
    } else {
        // @todo: The bomb feature is acting a bit unexpectedly but in a way its to be expected, fix this feature later
        maze.buildPath(blockInfo.block, nBlock, blockInfo.wall);
        blockInfo.block.reDraw();
        nBlock.reDraw();
        require('scripts/game').player.assets.hide(this.type);
    }
};

var TeleportBlock = function(){
    BonusBlock.call(this);
    this.name = 'Teleport';
    this.image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYAgMAAACdGdVrAAAACVBMVEUAzP8AzP8AzP+E8YVsAAAAA3RSTlMRu2M0GEoIAAAAhElEQVR4XmNAgAVgUjW0AURlMM0AkoxNC9iAFJtqKGcDA4PGrJVJDgwMEqlhExIYGCalhs6YwMCwcGpoigCEkoBTgqFgSio1dAlQTmUmSCULq2pUwAIGLsaklQkJDIwN06Y2NjAwJXCtYGVgYJjBwCACpFQbmBKAFFNoWAOQYuBaAHccALUmILeauDrgAAAAAElFTkSuQmCC';
    this.type = 'TeleportBlock';
    this.message ='You never know where you might end up using this portal';
};
TeleportBlock.prototype = Object.create(BonusBlock.prototype);
TeleportBlock.prototype.constructor = TeleportBlock;
BonusManager.register(TeleportBlock);

TeleportBlock.prototype.useBonus = function(){
    var Game = require('scripts/game');
    Game.player.movePlayer(Game.maze.getRandomBlock());
    Game.player.assets.hide(this.type);
};

var StopCompassBlock = function(){
    BonusBlock.call(this);
    this.name = 'Stop compass from changing';
    this.image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYAgMAAACdGdVrAAAADFBMVEVMaXHt7e1MTEzfKiqFF/UOAAAAAXRSTlMAQObYZgAAAJhJREFUeF41jjEOgkAUREcbCwtPQQFnMOEUsxAsqEjQxhOY9RJfS2xIkEvgJaD2CNsslSuyGqtXTCbvAYu2PQPbSLImRlyThwmbnioxWFnK8Ym1o+gS4YniUgR6uLoMdT5WfQbhu6OCFJObcSlyq/6AUP/w3epk7Dzywf8CrRKbInSkK72B+ua1rB5zxP6+M3hFVI2BWfrAD3NBSYsabT+JAAAAAElFTkSuQmCC';
    this.type = 'StopCompassBlock';
    this.message = 'The force is strong with this one! it will stablize the energy effecting the compass for a minute and sometimes more';
};
StopCompassBlock.prototype = Object.create(BonusBlock.prototype);
StopCompassBlock.prototype.constructor = StopCompassBlock;
BonusManager.register(StopCompassBlock);

StopCompassBlock.prototype.useBonus = function(){
    // Will stop the compass from changing for 1 minute
    // @todo move it to a secure method, right now can be used regardless of actually having the bonus
    $.trigger('stopCompass', {delay: 60, type: this.type});
};
*/
module.exports = {
    //BonusManager: BonusManager,
    ExitBlock: ExitBlock
};