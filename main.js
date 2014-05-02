var World = require('./world/World');
var Life = require('./life/Simple');
var Saver = require('./saver');

var config = {
    size: 100,
    path: "out.png"
};
var world = new World(config);
var saver = new Saver(config, world);

for(var i = 0; i < 20; i++)
    world.register(new Life());

var nextTick = function () {
    world.nextTick();
    saver.save();
};

setInterval(nextTick, 1000);