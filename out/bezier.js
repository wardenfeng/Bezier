/**
 * 细分精度
 */
var SUBDIVISION_PRECISION = 0.0000001;
/**
 * 细分最大迭代次数
 */
var SUBDIVISION_MAX_ITERATIONS = 10;
var bezierCurve;
/**
 * 贝塞尔曲线
 * @see https://en.wikipedia.org/wiki/B%C3%A9zier_curve
 */
var BezierCurve = /** @class */ (function () {
    function BezierCurve() {
    }
    /**
     * 线性Bézier曲线
     * 给定不同的点P0和P1，线性Bézier曲线就是这两个点之间的直线。曲线由下式给出
     * ```
     * B(t) = p0 + t * (p1 - p0) = (1 - t) * p0 + t * p1 , 0 <= t && t <= 1
     * ```
     * 相当于线性插值
     *
     * @param t 插值度 0<=t<=1
     * @param p0 点1
     * @param p1 点2
     */
    BezierCurve.prototype.linear = function (t, p0, p1) {
        return p0 + t * (p1 - p0);
        // return (1 - t) * p0 + t * p1;
    };
    /**
     * 二次Bézier曲线
     * 二次Bézier曲线是由函数B（t）跟踪的路径，给定点P0，P1和P2，
     *
     *
     * @param t 插值度
     * @param p0 点1
     * @param p1 点2
     * @param p2 点3
     */
    BezierCurve.prototype.quadratic = function (t, p0, p1, p2) {
    };
    BezierCurve.prototype.getValue = function (t, numbers) {
        // if (this.map[t] != undefined)
        //     return this.map[t];
        // var v = this.curve(t, this.numbers);
        var v = this.curve2(t, numbers);
        // this.map[t] = v;
        return v;
    };
    BezierCurve.prototype.curve = function (t, numbers) {
        numbers = numbers.concat();
        for (var i = numbers.length - 1; i > 1; i--) {
            for (var j = 0; j < j; j++) {
                numbers[j] = (1 - t) * numbers[j] + t * numbers[j + 1];
            }
        }
        return numbers[0];
    };
    // curve(t: number, numbers: number[]): number
    // {
    //     if (numbers.length == 2)
    //     {
    //         return (1 - t) * numbers[0] + t * numbers[1];
    //     }
    //     var newpoints: number[] = [];
    //     for (let i = 0, end = numbers.length - 1; i < end; i++)
    //     {
    //         newpoints.push(this.curve(t, [numbers[i], numbers[i + 1]]));
    //     }
    //     return this.curve(t, newpoints);
    // }
    BezierCurve.prototype.curve2 = function (t, ps) {
        var t1 = 1 - t;
        return t1 * t1 * t1 * ps[0] + 3 * t1 * t1 * t * ps[1] + 3 * t1 * t * t * ps[2] + t * t * t * ps[3];
    };
    BezierCurve.prototype.findTatValue = function (targetX, numbers) {
        var t0 = 0;
        var t1 = 1;
        var x0 = numbers[0];
        var x1 = numbers[numbers.length - 1];
        var mt = mt = t0 + (t1 - t0) * (targetX - x0) / (x1 - x0);
        var mv = this.getValue(mt, numbers);
        // console.assert((x0 - targetX) * (x1 - targetX) < 0, `targetX 必须在 起点终点之间！`);
        var i = 0;
        while (Math.abs(mv - targetX) > SUBDIVISION_PRECISION && i++ < SUBDIVISION_MAX_ITERATIONS) {
            // 进行线性插值预估目标位置
            mt = t0 + (t1 - t0) * (targetX - x0) / (x1 - x0);
            mv = this.getValue(mt, numbers);
            if ((x0 - targetX) * (mv - targetX) < 0) {
                t1 = mt;
                x1 = mv;
            }
            else {
                t0 = mt;
                x0 = mv;
            }
        }
        return mt;
    };
    BezierCurve.prototype.getCurveSamples1 = function (ps, num) {
        if (num === void 0) { num = 100; }
        var results = [];
        for (var i = 0; i <= num; i++) {
            var p = this.curve2(i / num, ps);
            results.push(p);
        }
        return results;
    };
    return BezierCurve;
}());
bezierCurve = new BezierCurve();
/**
 * 贝塞尔曲线
 *
 * 参考：https://github.com/gre/bezier-easing
 * @see https://github.com/gre/bezier-easing
 */
var Bezier = /** @class */ (function () {
    /**
     * 贝塞尔
     * @param mX1
     * @param mY1
     * @param mX2
     * @param mY2
     */
    function Bezier(mX1, mY1, mX2, mY2) {
        if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
            throw new Error('bezier x values must be in [0, 1] range');
        }
        this.mX1 = mX1;
        this.mY1 = mY1;
        this.mX2 = mX2;
        this.mY2 = mY2;
        // Precompute samples table
        var sampleValues = this.sampleValues = [];
        for (var i = 0; i < kSplineTableSize; ++i) {
            sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }
    }
    Bezier.prototype.getTForX = function (aX) {
        var sampleValues = this.sampleValues;
        var mX1 = this.mX1;
        var mY1 = this.mY1;
        var mX2 = this.mX2;
        var mY2 = this.mY2;
        var intervalStart = 0.0;
        var currentSample = 1;
        var lastSample = kSplineTableSize - 1;
        for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
            intervalStart += kSampleStepSize;
        }
        --currentSample;
        // Interpolate to provide an initial guess for t
        var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
        var guessForT = intervalStart + dist * kSampleStepSize;
        var initialSlope = getSlope(guessForT, mX1, mX2);
        if (initialSlope >= NEWTON_MIN_SLOPE) {
            return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
        }
        else if (initialSlope === 0.0) {
            return guessForT;
        }
        else {
            return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
        }
    };
    Bezier.prototype.getValue = function (x) {
        if (this.mX1 === this.mY1 && this.mX2 === this.mY2) {
            return x;
        }
        // Because JavaScript number are imprecise, we should guarantee the extremes are right.
        if (x === 0) {
            return 0;
        }
        if (x === 1) {
            return 1;
        }
        return calcBezier(this.getTForX(x), this.mY1, this.mY2);
    };
    return Bezier;
}());
/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */
// These values are established by empiricism with tests (tradeoff: performance VS precision)
/**
 * 牛顿迭代次数
 */
var NEWTON_ITERATIONS = 4;
/**
 * 牛顿最小斜率
 */
var NEWTON_MIN_SLOPE = 0.001;
/**
 * 细分精度
 */
var SUBDIVISION_PRECISION = 0.0000001;
/**
 * 细分最大迭代次数
 */
var SUBDIVISION_MAX_ITERATIONS = 10;
/**
 * 表格尺寸
 */
var kSplineTableSize = 11;
/**
 * 表格格子步长
 */
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
function C(aA1) { return 3.0 * aA1; }
/**
 * 计算贝塞尔值
 */
// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }
/**
 * 获取斜率
 */
// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }
/**
 * 二分细分
 * @param aX
 * @param aA
 * @param aB
 * @param mX1
 * @param mX2
 */
function binarySubdivide(aX, aA, aB, mX1, mX2) {
    var currentX, currentT, i = 0;
    do {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;
        if (currentX > 0.0) {
            aB = currentT;
        }
        else {
            aA = currentT;
        }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
}
/**
 * 牛顿迭代
 * @param aX
 * @param aGuessT
 * @param mX1
 * @param mX2
 */
function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
        var currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) {
            return aGuessT;
        }
        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
}
function createCanvas(x, y, width, height) {
    if (x === void 0) { x = 0; }
    if (y === void 0) { y = 0; }
    if (width === void 0) { width = 100; }
    if (height === void 0) { height = 100; }
    var canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.left = x + "px";
    canvas.style.top = y + "px";
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    return canvas;
}
function getBezierSamples(bezier, num) {
    if (num === void 0) { num = 100; }
    var points = [];
    for (var i = 0, step = 1 / num; i <= 1; i += step) {
        points.push([i, bezier.getValue(i)]);
    }
    return points;
}
/**
 * 清理画布
 * @param canvas 画布
 */
function clearCanvas(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制背景
    ctx.fillStyle = 'brack';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
/**
 * 绘制曲线
 * @param canvas 画布
 * @param points 曲线上的点
 * @param strokeStyle 曲线颜色
 */
function drawCurve(canvas, points, strokeStyle, lineWidth) {
    if (strokeStyle === void 0) { strokeStyle = 'white'; }
    if (lineWidth === void 0) { lineWidth = 3; }
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(points[0][0], points[0][1]);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.stroke();
}
var canvas = createCanvas(100, 100, 400, 300);
// var point0 = [Math.random(), Math.random()];
// var point1 = [Math.random(), Math.random()];
var point0 = [0.25, Math.random()];
var point1 = [0.75, Math.random()];
var xs = [0, point0[0], point1[0], 1];
var ys = [0, point0[1], point1[1], 1];
clearCanvas(canvas);
//
var bezier = new Bezier(point0[0], point0[1], point1[0], point1[1]);
var points = getBezierSamples(bezier, 100);
points = points.map(function (item) { return [item[0] * canvas.width, (1 - item[1]) * canvas.height]; });
drawCurve(canvas, points, 'white', 9);
//
var xSamples = bezierCurve.getCurveSamples1(xs);
var ySamples = bezierCurve.getCurveSamples1(ys);
var points2 = [];
for (var i = 0; i < xSamples.length; i++) {
    points2[i] = [xSamples[i] * canvas.width, (1 - ySamples[i]) * canvas.height];
}
drawCurve(canvas, points2, "green", 3);
var x = Math.random();
var num = 100000;
console.time("feng");
for (var i = 0; i < num; i++) {
    var t = bezierCurve.findTatValue(x, xs);
    var v3 = bezierCurve.getValue(t, ys);
}
console.timeEnd("feng");
console.time("bezier");
for (var i = 0; i < num; i++) {
    var v1 = bezier.getValue(x);
}
console.timeEnd("bezier");
console.log(x, v1);
console.log(x, v3);
//# sourceMappingURL=bezier.js.map