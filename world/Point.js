var mixin = require("mixin");
var Food = require("./resource/Food");
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var RgbStates = {
    deadly: [255, 255, 255],
    withFood: [0, 255, 0],
    withLife: [255, 255, 0],
    withCorpse: [255, 0, 255],
    passable: [80,80,80]
};

var Point = function () {
    var random = getRandomInt(0, 100);
    this.passable = random > 5;
    this.resources = [];
    
    if (random > 10 && random < 20) 
        this.addFoods(getRandomInt(1, 7));
}
mixin(Point.prototype, {

    addFoods: function(count) {
        for (var i = 0; i < count; i++)
            this.resources.push(new Food());
    },

    addResource: function(res) {
        this.resources.push(res);
    },

    removeResource: function (res) {
        if (this.getResources(res).length)
        this.resource = this.resource
            .filter(function (r) {
                return r !== res;
            });
    },

    getRgbState: function () {
        if (!this.passable)
            return RgbStates.deadly;
        
        if (this.haveResource("life1"))
            return RgbStates.withLife;

        if (this.haveResource("corpse"))
            return RgbStates.withCorpse;

        if (this.haveResource("food"))
            return RgbStates.withFood;

        return RgbStates.passable;
    },

    haveResource: function(name) {
        return this.getResources(name).length > 0;
    },

    getResources: function (name) {
        var point = this;
        return this.resources
            .filter(function(r) {
                return r.name === name;
            })
            .map(wrappResource);

        function wrappResource(resource) {
            return {
                unwrap: function() {
                    point.removeResource(resource);
                    return resource;
                }
            }
        }
    }

});


module.exports = Point;