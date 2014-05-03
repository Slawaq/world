var mixin = require('mixin');

var Point = require('./Point');
var Corpse = require('./resource/Corpse');

var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var World = function (config) {
    this.config = config;
    this.area = this.generateArea();
    this.lifes = [];
    this.mustDead = [];
    this.ticks = 0;
}
mixin(World.prototype, {

    generateArea: function () {
        var size = this.config.size;
        var area = new Array(size);
        for (var i = 0; i < size; i++) {
            area[i] = new Array(size);
            for (var j = 0; j < size; j++)
                area[i][j] = new Point();
        }
        return area;
    },

    getColoredArea: function () {
        return this.area
            .map(function (mediana) {
                return mediana
                    .map(function (point) {
                        return point.getRgbState();
                    });
            });
    },

    getArea: function() {
        return this.area;
    },

    addLife: function(life) {
        var x = getRandomInt(0, this.config.size - 1);
        var y = getRandomInt(0, this.config.size - 1);
        var registredLife = new RegistredLife(this, life, this.area[x][y], x, y);
        this.lifes.push(registredLife);
        life.identity(registredLife);
    },

    nextTick: function () {
        this.ticks++;
        this.lifes.forEach(function(l) {
            l.life.nextTick();
        });
        this.lifes = this.lifes
            .filter(function(l) {
                return this.mustDead.indexOf(l) === -1;
            }, this);
        this.mustDead = this.mustDead.filter(function (rl) {
            rl.point.removeResource(rl.life);
            rl.point.addResource(new Corpse(rl.life));
            console.log("Life #", rl.life.number," is dead on: ", rl.x, rl.y, ", on ", this.ticks, " tick");
            return false;
        }, this);
    }

});

var RegistredLife = function (world, life, point, x, y) {
    this.world = world;
    this.life = life;
    this.point = point;
    this.x = x;
    this.y = y;
    this.point.addResource(life);
    console.log("Life added to point[" + x + "][" + y + "] : ", this.point.hasExistResource(life));
}
mixin(RegistredLife.prototype, {

    whereICanGoing: function() {
        var acts = [];
        var x = this.x;
        var y = this.y;
        if (this.testPoint(x, y - 1))
            acts.push(this.createActTo(x, y - 1));

        if (this.testPoint(x, y + 1))
            acts.push(this.createActTo(x, y + 1));

        if (this.testPoint(x - 1, y))
            acts.push(this.createActTo(x - 1, y));

        if (this.testPoint(x + 1, y))
            acts.push(this.createActTo(x + 1, y));

        return acts;
    },

    createActTo: function(x, y) {
        var offset = Math.abs(this.x - x) + Math.abs(this.y - y);
        if (offset > 1) throw new Error("Life trying to going wrong path!");
        var info = this;
        var area = this.world.getArea(); 

        return function () {
            info.x = x;
            info.y = y;
            info.point.removeResource(info.life);
            info.point = area[x][y];
            info.point.addResource(info.life);
        }
    },

    testPoint: function (x, y) {
        try {
            return x >= 0 && y >= 0 && this.world.getArea()[x][y].passable;
        } catch (e) {
            return false;
        }
    },

    die: function () {
        this.world.mustDead.push(this);
    }

});

module.exports = World;