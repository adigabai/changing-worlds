'use strict';
/* globals $, module, require */
var Display = (function() {
    /*
    In a world with more then 13k, this will be converted to
    a factory to load classes to support more then just
    canvas display
     */
    var canvas = $('canvas');
    var ctx = canvas.getContext("2d");
    var lineImgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKBAMAAAB/HNKOAAAAGFBMVEUxMTE6OjpCQkJKSkpSUlJaWlopKSkhISEHxUPBAAAAQ0lEQVR4XgVAyw1AQBB96+I6ySpgZ1YB5j2cJTRACUrQ/0dQYlwmFNIdbyo7TK4LvvEG5rrGjtpowpDUCesWQvv4HD/f/AgYtHxdLQAAAABJRU5ErkJggg==';
    var subMouseOver = [];
    //var pendingClick = {};
    //var isPendingClick = false;

    /**canvas.on('click', function(event){
        if (isPendingClick){
            var coords = getCoordsOnCanvas(event);
            var blockInfo = require('scripts/game').maze.getBlockAndWall(coords);
            pendingClick.click(blockInfo);
            isPendingClick = false;
            pendingClick = {};
            canvas.style.cursor = 'default';
        }
    });*/
    canvas.on('mousemove', function(event){
        var coords = getCoordsOnCanvas(event);
        // Go over all the event subscribers
        for(var s=0; s<subMouseOver.length; ++s) {
            var subscriber = subMouseOver[s];
            if ( subscriber ) {
                var inRange = false;
                if (coords.x > subscriber.left && coords.x < subscriber.left + subscriber.width &&
                    coords.y > subscriber.top && coords.y < subscriber.top + subscriber.height){
                    inRange = true;
                }
                // Check if the subscriber already has the mouse in effect
                if (subscriber.hovered && !inRange){
                    subscriber.outCallback();
                    subscriber.hovered = false;
                } else if (!subscriber.hovered && inRange){
                    subscriber.inCallback();
                    subscriber.hovered = true;
                }
            } // End subscriber exists check
        } // End loop over the subscribers to the mouse over events
    });

    function getCoordsOnCanvas(event) {
        var element = canvas;
        var offsetX = 0;
        var offsetY = 0;
        var x;
        var y;

        if (element.offsetParent !== undefined) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
                element = element.offsetParent;
            } while (element);
        }

        x = event.pageX - offsetX;
        y = event.pageY - offsetY;
        return {x: x, y: y};
    }

    return {
        setSize: function (width, height){
            canvas.height = height;
            canvas.width = width;
        },
        drawLine: function(from, to, size){
            var height = Math.abs(to.y - from.y)+size;
            var width = Math.abs(to.x - from.x)+size;

            var x = from.x < to.x ? from.x : to.x;
            var y = from.y < to.y ? from.y : to.y;
            this.drawImage(lineImgSrc, y, x, width, height);
        },
        drawImage: function(imageSrc, y, x, width, height){
            var imageObj = new Image();

            imageObj.onload = function() {
                ctx.drawImage(imageObj, x, y, width, height);
            };
            imageObj.src = imageSrc;
        },
        /**waitForClick: function(object){
            canvas.style.cursor = 'crosshair';
            if(isPendingClick!==false){
                pendingClick.cancel();
            }
            pendingClick = object;
            isPendingClick = true;
        },*/
        removeMouseOver: function(index){
            subMouseOver[index] = false;
        },
        addMouseOver: function(y, x, width, height, inCallback, outCallback){
            var subscriber = {
                left: x,
                top: y,
                width: width,
                height: height,
                inCallback: inCallback,
                outCallback: outCallback,
                hovered: false
            };
            subMouseOver.push(subscriber);
            return subMouseOver.length - 1;
        },
        clear: function(y, x, width, height){
            ctx.clearRect(x, y, width, height);
        },
        getWidth: function(){
            return $("canvas").attributes.width.value;
        },
        getPosition: function() {
            var el = $("canvas");
            var left = 0;
            var top = 0;

            while(el) {
                left += el.offsetLeft - el.scrollLeft + el.clientLeft;
                top += el.offsetTop - el.scrollTop + el.clientTop;
                el = el.offsetParent;
            }
            return { left: left, top: top };
        }
    };
})();

module.exports = Display;