'use strict';
/* globals $, require, module */

var Assets = function(){
    var items = {};
    var types = {

    };

    return {
        register: function(type, name, image){
            items[type] = [];
            types[type] = {
                name: name,
                image: image
            };
        },
        getCountFromType: function(type){
            return items[type].length;
        },
        use: function(type){
            var item = this.remove(type);
            if (item){
                var itemEl = $("#bonuses #inv" + type);
                itemEl.style.cursor = 'wait';
                item.use();
            } else {
                require('scripts/notify').show('warn', 'Gotta have some to use some');
            }
        },
        add: function(item){
            var type = item.type;
            items[type].push(item);
            var itemEl = $("#bonuses #inv" + type);
            itemEl.style.display = 'block';
        },
        hide: function(type){
            if ( items[type].length === 0 ) {
                var itemEl = $("#bonuses #inv" + type);
                itemEl.style.display = 'none';
                itemEl.style.cursor = 'pointer';
            }
        },
        remove: function(type){
            var item = false;
            if ( items[type].length > 0 ) {
                item = items[type].shift();
            }
            return item;
        },
        draw: function(){
            var el = $("#bonuses");
            for (var type in types) {
                if( types.hasOwnProperty( type ) ) {
                    var li = document.createElement('li');
                    li.title = types[type].name;
                    li.id = 'inv'+type;
                    li.innerHTML = '&nbsp;';
                    li.dataset.type = type;
                    li.style.backgroundImage = "url(" + types[type].image + ")";
                    el.appendChild(li);
                    $("#"+li.id).on('click', function(){
                        var type = this.getAttribute('data-type');
                        require('scripts/game').player.assets.use(type);
                    });
                }
            }
        }
    };
};

module.exports = Assets;