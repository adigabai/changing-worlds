'use strict';
/**
 *
 */
/* globals $, module, require */

var Story = function(el){
    var element = el;
    var stage = 'prologue';
    var choices = [];
    var cBlocks = [];
    var StoryChoiceBlock = require('scripts/choice');

    return {
        choose: function(value){
            choices.push(value);
            this.continue();
        },
        createChoices: function(){
            var choices = $("#sB li");
            var story = this;
            choices.forEach(function(choice, idx){
                var value = choice.attributes.rel.value;
                var choiceB = new StoryChoiceBlock(value, idx, choice);
                var block = require('scripts/game').maze.getRandomCorneredBlock();
                choiceB.setBlock(block);
                choiceB.draw();
                choiceB.registerEvents();
                story.cBlocks.push(choiceB);
            });
        },
        clearChoices: function(){
            for(var b=0; b < cBlocks.length; ++b){
                cBlocks[b].disable();
            }
        },
        start: function(){
            var el = element;
            var s = stage;
            var contentEls = $(element+' .' + s + ' p');

            var h2el = $(element+' .'+ s + ' h2');
            $("#sB").innerHTML = h2el.outerHTML;
            //$(element+' .'+ s + ' h2').remove(); IE....
            h2el.parentNode.removeChild(h2el);

            var firstP = $(element+' .' + s + ' p:nth-child(1)');
            $("#sB").innerHTML += firstP.outerHTML;
            firstP.parentNode.removeChild(firstP);

            for (var i=1; i < contentEls.length; ++i ){
                setTimeout(function(){
                    var p = $(el+' .'+ s + ' p:nth-child(1)');
                    $("#sB").innerHTML += p.outerHTML;
                    p.parentNode.removeChild(p);
                }, 1000 * (i + 0.5));
            }
            var self = this;
            setTimeout(function(){
                $('#sB button').on('click', function(){
                    var Game = require('scripts/game');
                    Game.maze.build();
                    Game.displayEvents();
                    Game.continue();
                    self.continue();
                }).className = 'active';
            }, 1000 * (i + 1.5));

            stage = 'chapter1';
        },
        continue: function(){
            this.clearChoices();
            var makeChoiceVisible = true;
            // Todo: add an automatic calculation to split into sections according to textContent size.
            $("#sB").innerHTML = $(element+' .'+stage).innerHTML;
            if($("#sB div.section") && $("#sB div.section").length > 0){
                makeChoiceVisible = false;
                $("#sB div.section").forEach(function(section, idx){
                    if(idx>0){
                        section.style.display = "none";
                    }
                });
                // @todo when the 13kb limit is lifted support longer stories and make this forEach
                $("#sB .sectionBtn").on('click', function(){
                    var sections = $("#sB .section");
                    sections[0].style.display = "none";
                    sections[1].style.display = "block";
                    this.style.display = "none";
                    $("#sB>button").style.display = "block";
                });
            }
            if ( stage !== 'finish' && stage !== 'exit' ){
                var btn = document.createElement("button");
                btn.innerHTML = 'Make a choice';
                $("#sB ol").style.display = "none";
                if (!makeChoiceVisible){
                    btn.style.display = "none";
                }
                $("#sB").insertBefore(btn, $("#sB ol"));
                $("#sB>button").on('click', function(){
                    $("#sB p, #sB>button").forEach(function (el) {
                        el.style.display = "none";
                    });
                    $("#sB ol").style.display = "block";
                });
            }

            this.createChoices();
            if (stage === 'chapter1'){
                stage = 'chapter2';
            } else if (stage === 'chapter2'){
                stage = 'chapter3';
            } else if (stage === 'chapter3') {
                stage = 'exit';
            } else if (stage === 'exit'){
                stage = 'finish';
                require('scripts/game').endEpisode();
            }
        },
        finish: function(){
            var endingEl = $(element+' .'+stage+ ' .'+choices.join(''));
            if ( endingEl.length === 0 ){
                endingEl = $(element+' .'+stage+ ' .other');
            }
            $("#sB").innerHTML = endingEl.innerHTML;
            var btn = document.createElement("button");
            btn.innerHTML = 'Restart';
            btn.className = 'active';
            $("#sB").appendChild(btn);
            $("#sB").on('click', function(){
                // @todo make this a real end game screen
                document.location.reload();
            });
            require('scripts/game').pause();
        },
        cBlocks: cBlocks
    };
};

module.exports = Story;