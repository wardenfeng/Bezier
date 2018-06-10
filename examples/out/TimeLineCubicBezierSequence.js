/**
 * 基于时间轴的连续三阶Bézier曲线
 *
 * @author feng / http://feng3d.com 10/06/2018
 */
var TimeLineCubicBezierSequence = /** @class */ (function () {
    function TimeLineCubicBezierSequence() {
        /**
         * 最大tan值，超出该值后将会变成分段
         */
        this.maxtan = 1000;
        this.keys = [];
    }
    TimeLineCubicBezierSequence.prototype.findPoint = function (x, y, precision) {
        var keys = this.keys;
        for (var i = 0; i < keys.length; i++) {
            if (Math.abs(keys[i].x - x) < precision && Math.abs(keys[i].y - y) < precision) {
                return keys[i];
            }
        }
        return null;
    };
    /**
     * 点击曲线添加关键点
     * @param x x坐标
     * @param y y坐标
     */
    TimeLineCubicBezierSequence.prototype.addPoint = function (x, y, precision) {
        var keys = this.keys;
        var maxtan = this.maxtan;
        for (var i = 0, n = keys.length; i < n; i++) {
            // 使用 bezierCurve 进行采样曲线点
            var key = keys[i];
            var prekey = keys[i - 1];
            if (i > 0 && prekey.x < x && x < key.x) {
                var xstart = prekey.x;
                var ystart = prekey.y;
                var tanstart = prekey.tan;
                var xend = key.x;
                var yend = key.y;
                var tanend = key.tan;
                if (maxtan > Math.abs(tanstart) && maxtan > Math.abs(tanend)) {
                    var t = (x - prekey.x) / (key.x - prekey.x);
                    var sys = [ystart, ystart + tanstart * (xend - xstart) / 3, yend - tanend * (xend - xstart) / 3, yend];
                    var fy = bezier.getValue(t, sys);
                    if (Math.abs(fy - y) < precision) {
                        var result = { x: x, y: fy, tan: bezier.getDerivative(t, sys) / (xend - xstart) };
                        keys.push(result);
                        return result;
                    }
                }
                else {
                    // 
                    if (Math.abs(y - prekey.y) < precision) {
                        var result = { x: x, y: prekey.y, tan: 0 };
                        keys.push(result);
                        return result;
                    }
                }
            }
            if (i == 0 && x < key.x && Math.abs(y - key.y) < precision) {
                var result = { x: x, y: key.y, tan: 0 };
                keys.push(result);
                return result;
            }
            if (i == n - 1 && x > key.x && Math.abs(y - key.y) < precision) {
                var result = { x: x, y: key.y, tan: 0 };
                keys.push(result);
                return result;
            }
        }
        return null;
    };
    TimeLineCubicBezierSequence.prototype.deletePoint = function (key) {
        var keys = this.keys;
        var index = keys.indexOf(key);
        keys.splice(index, 1);
    };
    return TimeLineCubicBezierSequence;
}());
//# sourceMappingURL=TimeLineCubicBezierSequence.js.map