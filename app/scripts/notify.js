'use strict';
/**
 * Events:
 */
/* globals $, module, require */
var Notify = (function(){
    var timeDisplayed = 4000;
    var types = {
        info: '#1e90ff',
        warn: '#FFFF00' ,
        error: '#FF5D05'
    };

    var el = $("#notification");
    var Display = require('scripts/display');
    var pos = Display.getPosition();
    el.style.top = pos.top + 'px';
    el.style.left = pos.left + 'px';
    var width = Display.getWidth();
    el.style.width = width + 'px';

    return {
        show: function(type, message){
            // @todo: style the message better
            el.style.color = types[type];
            el.innerHTML = message;
            el.style.display = 'block';
            setTimeout(function(){
                $("#notification").style.display = 'none';
            }, timeDisplayed);
        }
    };
})();

module.exports = Notify;