module.exports = function (dst, src) {
    var tobj = {};
    for (var x in src) {
        if ((typeof tobj[x] == "undefined") || (tobj[x] != src[x])) {
            dst[x] = src[x];
        }
    }
    var p = src.toString;
    if (typeof p == "function" && p != dst.toString && p != tobj.toString &&
        p != "\nfunction toString() {\n    [native code]\n}\n") {
        dst.toString = src.toString;
    }

};