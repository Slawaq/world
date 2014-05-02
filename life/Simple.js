var mixin = require('mixin');
var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var Life = function () {
    this.name = "life1";
    this.food = 10;
};
mixin(Life.prototype, {

    identity: function (info) {
        this.info = info;
        this.world = info.world;
    },

    nextTick: function() {
        var foods = this.info.point.getResources("food");
        
        if (resources) {
            this.info.point.
            console.log("life have food!", this.info.x, this.info.y);
        } else {
            this.goNext();

        }
    },

    goNext: function () {
        if (this.food == 0)
            this.die();

        var acts = this.info.whereICanGoing();
        if (acts.length > 0) {
            var act = getRandomInt(0, acts.length - 1);
            acts[act]();
            console.log("life doing next act");
        }
        this.food--;
    },

    die: function () {
        console.log("Life is dead on: ", this.info.x, this.info.y);
        this.info.die();
    }

});

module.exports = Life;