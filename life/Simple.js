var mixin = require('mixin');

var Food = require("../world/resource/Food");
var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var index = 0;

var Life = function () {
    this.name = "life1";
    this.number = ++index;
    this.foodReserve = [new Food(), new Food(), new Food(), new Food(), new Food(), new Food(), new Food(), new Food(), new Food(), new Food()];
    this.maxFoodsCapacity = 20;
    this.minFoodsCapacity = 10;
    this.eatenFood = [];
};
mixin(Life.prototype, {

    identity: function (info) {
        this.info = info;
        this.world = info.world;
    },

    nextTick: function () {
        if (this.foodReserve.length === 0)
            this.die();

        var food = this.foodReserve.pop();
        this.eatenFood.push(food);

        this.restoreFoodReserve();
    },

    restoreFoodReserve: function() {
        var reserve = this.foodReserve;
        var packedFoods = this.info.point.getResources("food");

        if (reserve.length <= this.minFoodsCapacity) {
            var takenFoods = 0;
            packedFoods
                .forEach(function(food) {
                    try {
                        if (reserve.length < this.maxFoodsCapacity) {
                            food = food.unwrap();
                            reserve.push(food);
                            takenFoods++;
                        }
                    } catch (error) {
                    }
                }, this);
            if (takenFoods == 0)
                this.findFood();
        } else {
            this.findFood();
        }
    },

    findFood: function() {
        var acts = this.info.whereICanGoing();
        if (acts.length > 0) {
            var act = getRandomInt(0, acts.length - 1);
            acts[act]();
        }
    },

    die: function () {
        this.info.die();
    }

});

module.exports = Life;