var World = require('./world/World');
var Life = require('./life/Simple');
var Saver = require('./saver');

process.on('SIGINT', function () {
    console.log('SIGINT');
    process.exit();
});
console.log('PID: ', process.pid);

var config = {
    size: 200,
    path: "out.png"
};
var world = new World(config);
var saver = new Saver(config, world);

for(var i = 0; i < 60; i++)
    world.addLife(new Life());

var nextTick = function () {
    world.nextTick();
    saver.save();
};

setInterval(nextTick, 1000);
