var mixin = require('mixin');
var fs = require('fs');
var Buffer = require('buffer');
var PNG = require("pngjs").PNG;

var Saver = function (config, world) {
    this.config = config;
    this.world = world;
    this.saving = false;
}
mixin(Saver.prototype, {

    packWorld: function () {
        return "<html><head></head><body style='margin: 0px;'><canvas id='canvas' height='" + this.config.size + "' width='" + this.config.size + "'></canvas><script type='text/javascript'>var ctx = document.getElementById('canvas').getContext('2d');var canvas = document.getElementById(\"canvas\");var canvasWidth = canvas.width;var canvasHeight = canvas.height;var ctx = canvas.getContext(\"2d\");var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);function drawPixel (x, y, r, g, b, a) {var index = (x + y * canvasWidth) * 4;canvasData.data[index + 0] = r;canvasData.data[index + 1] = g;canvasData.data[index + 2] = b;canvasData.data[index + 3] = a;}" +
            JSON.stringify(this.world.getColoredArea()) + '.forEach(function(median, i){ median.forEach(function(point, j){ drawPixel(i, j, point[0], point[1], point[2], 255); }); });' +
            'ctx.putImageData(canvasData, 0, 0);</script></body></html>';
    },

    save: function () {
        var saving = this.saving;

        if (saving)
            throw new Error("Saving started!");

        saving = true;

        //        fs.writeFile(this.config.path, this.packWorld(), function(err) {
        //            if (err) throw err;
        //            saving = false;
        //            console.log("world saved!");
        //        });

        var size = this.config.size;

        var png = new PNG({
            filterType: -1
        });
        png.width = size;
        png.height = size;
        png.data = new Uint8Array(size * size * 4);

        this.world.getColoredArea().forEach(function (median, x) {
            median.forEach(function (rgb, y) {
                var idx = (size * y + x) << 2;

                png.data[idx] = rgb[0];
                png.data[idx + 1] = rgb[1];
                png.data[idx + 2] = rgb[2];

                png.data[idx + 3] = 255;
            });
        });

        var stream = fs.createWriteStream(this.config.path);
        stream.on('error', function (err) {
            console.error('cant save!');
        });
        png.pack().pipe(stream);

        saving = false;
    },

});

module.exports = Saver;