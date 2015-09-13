'use strict';
/* globals $, require, module */

var Content = require('scripts/content');

var StoryChoiceBlock = function(value, idx, el){
    Content.call(this);
    this.active = true;
    var images = [
        //'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAAGFBMVEV2uilzpgRMaXEsjAlblxFicgt3sxPd7cYfCM4XAAAABnRSTlP+/QA4sPsVSNoQAAAA2UlEQVR4Xr3RvVKEMBSG4W/GmVBnV9IbsGfBtV6z8QL8oU+asy2Ve/t+OQoFOKOVL8PhzDOBBvjv7vp5W+gQtrTb0PN+KPWFmiHG+GSdLY1jJB2s5rL9KqB54CM7q9Px3qOVbHmgfqGWSI9SsmP1IUIQWai6TqKRup8o5yw5VUrOyY6kpfItLcwkF6VUqBVTInGhFEoaLhNSMgACTga8DKqJk5oCOJm5MgA8944TNCWtJq26Rbemmy0FNKs3zz28H5j3x1cuMZ6X36Gk/UJvG7r/dzr+idowb58n0W421XeZ5gAAAABJRU5ErkJggg==',
        //'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAAGFBMVEVKfLhNhspMaXFBYawWZuk1asrl7Pavxd5NKexhAAAABnRSTlP+/gD9OK4t10NTAAAA3ElEQVR4Xr3RMVOEMBCG4S/m7HfHmaudCD1eUFsE7CWaH0BDapv4992Qg4IUWvk2WZ5sKmCu3ffbtFPnSroU9NGOqT5RNXrv321jc15owFrT5FM7VG9IyT1yLWoU1F3fxUB5Om10DnE+UATCgb7RLPnljRApEGAfAwNEcOgUJNL2PLNSUMqhBknQL4EJ6VqIWfDOxi+WLSZ2mIhk1s8zczIlJKfMelmWwKs+CTExYyfWmFSyLfm4xSsfOpXkUE2HpR7GjJIxw0UG7z/337HS2i/UFvTw7zT8iWq3TT94T03ARSI3EQAAAABJRU5ErkJggg==',
        //'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAAGFBMVEXVZQLdXwvxbwrjbAn4eQj4hhv97uHwpWC5MOOdAAAABHRSTlMD/sxq1FSHqgAAANVJREFUeF69zkFuwjAUBNDf0APUgirbKKj7CtM9UPsAQR64wc8FwLk+Y/kLAaxhVpOn8VfEIs2vPOaze6L15pn+bz68X/V9sGyX5UjtbmHIm6sqzhltpKl70uKBWtWTPTRyecxjuqPQYlAY8XoMKcTBXWnN72LHPCKklCIfgsIcdAR4jTQDw+5aPZd9WYXIOQb3rWcgAp38ILEEV4glcgWGVadMKplzVZKy6lRpK3+oBdNU245ksRHKf1koRjbbp12VpVzz8SUz73svd2R5Dc3fTU0nlgsv5F/pApVCdwAAAABJRU5ErkJggg=='
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAD1BMVEVDkiRtsg5tbSRutBS324tBdjoXAAAAA3RSTlMBuKrhq8CvAAAAS0lEQVR4XmMAAUYGOGAUgDIEBYUNBQUVgSxhYwgwZGA0hjNBgi7OcKYJGlOAgRnOhKh1ASlAMI2BTIS5giDbgAhiNZMCkCCbifAFAN6zEyVNyrfjAAAAAElFTkSuQmCC',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAD1BMVEU/b8FMaXFEecNIf8GpxOSP1hZTAAAAA3RSTlOGAMyNHC13AAAAWklEQVR4XpXOwQ2AMAgF0A8sgE5QcQEj3aDdfyZbUluvcvh5IUDA1kqpZ3AfBCCJGQT1URe4ZS5BaVnrZMmT3rtpzAZ9zi46ZN2FmZ1mftP7A+j7TlCPH4y1B1V0GE6KvG7FAAAAAElFTkSuQmCC',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAD1BMVEX5fg/sbgnxdw/zn1X61LJRsA56AAAAA3RSTlP9CKUpD/kyAAAAWklEQVR4Xo2OwQ2AIAxFCzqA7QT1T0ACG8D+M1moiPHkOzQvP+9QYkO443q6ikAjAFO6CXTYzenR1oYqGXua69Y8WGunljTbUk3JgzxaBqBRKb5++Kvhqyu4AM44C8Q3rY/0AAAAAElFTkSuQmCC'

    ];
    this.image = images[idx];
    this.value = value;
    this.el = el;
    el.style.backgroundImage = "url("+this.image+")";
    this.elClassName = el.className;

    this.registerEvents = function(){
        var choiceB = this;
        $.on('reachedBlock_'+this.block.row + '_' + this.block.col, function(){
            if(choiceB.active){
                require('scripts/game').story.choose(choiceB.value);
            }
        });

        this.draw = function(){
            if ( this.active ) {
                var padding = 5;
                var top = this.block.row * this.block.size + padding * 1.5;
                var left = this.block.col * this.block.size + padding * 1.5;
                var size = this.block.size - padding * 2;
                require('scripts/display').drawImage(this.image, top, left, size, size);
            }
        };

        this.addMouseOver(function(){
            // In callback
            $("#sB ."+choiceB.elClassName).className = choiceB.elClassName + ' h';
        }, function(){
            // Out callback
            $("#sB ."+choiceB.elClassName).className = choiceB.elClassName;
        });
    };

    this.disable = function(){
        this.active = false;
        this.clear();
    };
};
StoryChoiceBlock.prototype = Object.create(Content.prototype);
StoryChoiceBlock.prototype.constructor = StoryChoiceBlock;

module.exports = StoryChoiceBlock;