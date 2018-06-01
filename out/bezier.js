var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    };
    Point.prototype.lerpNumber = function (v, alpha) {
        this.x = (1 - alpha) * this.x + alpha * v.x;
        this.y = (1 - alpha) * this.y + alpha * v.y;
        return this;
    };
    return Point;
}());
var Curve = /** @class */ (function () {
    function Curve(numbers) {
        this.map = {};
        this.numbers = numbers;
        this.map[0] = numbers[0];
        this.map[1] = numbers[numbers.length - 1];
    }
    Curve.prototype.getValue = function (t) {
        if (this.map[t] != undefined)
            return this.map[t];
        var v = curve(t, this.numbers);
        this.map[t] = v;
        return v;
    };
    Curve.prototype.findTatValue = function (targetX) {
        /**
         * 细分精度
         */
        var SUBDIVISION_PRECISION = 0.0000001;
        /**
         * 细分最大迭代次数
         */
        var SUBDIVISION_MAX_ITERATIONS = 10;
        var t0 = 0;
        var t1 = 1;
        var x0 = this.getValue(0);
        var x1 = this.getValue(1);
        // console.assert((x0 - targetX) * (x1 - targetX) < 0, `targetX 必须在 起点终点之间！`);
        var i = 0;
        while (Math.abs(x0 - x1) > SUBDIVISION_PRECISION && i++ < SUBDIVISION_MAX_ITERATIONS) {
            var mt = (t0 + t1) / 2;
            var mv = this.getValue(mt);
            if ((x0 - targetX) * (mv - targetX) < 0) {
                t1 = mt;
                x1 = mv;
            }
            else {
                t0 = mt;
                x0 = mv;
            }
        }
        return (t0 + t1) / 2;
    };
    return Curve;
}());
function curve1(t, p0, p1, p2, p3) {
    var t1 = 1 - t;
    return t1 * t1 * t1 * p0 + 3 * t1 * t1 * t * p1 + 3 * t1 * t * t * p2 + t * t * t * p3;
}
function curve2(t, ps) {
    var t1 = 1 - t;
    return t1 * t1 * t1 * ps[0] + 3 * t1 * t1 * t * ps[1] + 3 * t1 * t * t * ps[2] + t * t * t * ps[3];
}
function curve(t, numbers) {
    if (numbers.length == 2) {
        return (1 - t) * numbers[0] + t * numbers[1];
    }
    var newpoints = [];
    for (var i = 0, end = numbers.length - 1; i < end; i++) {
        newpoints.push(curve(t, [numbers[i], numbers[i + 1]]));
    }
    return curve(t, newpoints);
}
function findTatValue(targetX, numbers) {
    /**
     * 细分精度
     */
    var SUBDIVISION_PRECISION = 0.0000001;
    /**
     * 细分最大迭代次数
     */
    var SUBDIVISION_MAX_ITERATIONS = 10;
    var t0 = 0;
    var t1 = 1;
    var x0 = numbers[0];
    var x1 = numbers[numbers.length - 1];
    // console.assert((x0 - targetX) * (x1 - targetX) < 0, `targetX 必须在 起点终点之间！`);
    var i = 0;
    while (Math.abs(x0 - x1) > SUBDIVISION_PRECISION && i++ < SUBDIVISION_MAX_ITERATIONS) {
        var mt = (t0 + t1) / 2;
        var mv = curve(mt, numbers);
        if ((x0 - targetX) * (mv - targetX) < 0) {
            t1 = mt;
            x1 = mv;
        }
        else {
            t0 = mt;
            x0 = mv;
        }
    }
    return (t0 + t1) / 2;
}
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
    for (var i = 0; i <= 1; i += 1 / num) {
        points.push(new Point(i, bezier.getValue(i)));
    }
    return points;
}
function getCurveSamples(points, num) {
    if (num === void 0) { num = 100; }
    var xs = points.map(function (i) { return i.x; });
    var ys = points.map(function (i) { return i.y; });
    var results = [];
    for (var i = 0; i <= 1; i += 1 / num) {
        var p = new Point(curve(i, xs), curve(i, ys));
        results.push(p);
    }
    return results;
}
function getCurveSamples1(cx, cy, num) {
    if (num === void 0) { num = 100; }
    var results = [];
    for (var i = 0; i <= 1; i += 1 / num) {
        var p = new Point(cx.getValue(i), cy.getValue(i));
        results.push(p);
    }
    return results;
}
function getCurveAtX(points, targetX) {
    var xs = points.map(function (i) { return i.x; });
    var ys = points.map(function (i) { return i.y; });
    var t0 = findTatValue(targetX, xs);
    var y = curve(t0, ys);
    return new Point(targetX, y);
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
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
}
var canvas = createCanvas(100, 100, 400, 300);
var point0 = [Math.random(), Math.random()];
var point1 = [Math.random(), Math.random()];
clearCanvas(canvas);
//
var bezier = new Bezier(this.point0[0], this.point0[1], this.point1[0], this.point1[1]);
var points = getBezierSamples(this.bezier, 100);
points = points.map(function (item) { return new Point(item.x * canvas.width, (1 - item.y) * canvas.height); ; });
drawCurve(canvas, points, 'white', 9);
//
var points1 = getCurveSamples([new Point(0, 0), new Point(this.point0[0], this.point0[1]), new Point(this.point1[0], this.point1[1]), new Point(1, 1)]);
points1 = points1.map(function (item) { return new Point(item.x * canvas.width, (1 - item.y) * canvas.height); });
drawCurve(canvas, points1, "red", 6);
//
// var cx = new Curve([0, this.point0[0], this.point1[0], 1]);
// var cy = new Curve([0, this.point0[1], this.point1[1], 1]);
//
var points = [new Point(0, 0), new Point(this.point0[0], this.point0[1]), new Point(this.point1[0], this.point1[1]), new Point(1, 1)];
var xs = points.map(function (i) { return i.x; });
var ys = points.map(function (i) { return i.y; });
var cx = new Curve(xs);
var cy = new Curve(ys);
var points2 = getCurveSamples1(cx, cy);
points2 = points2.map(function (item) { return new Point(item.x * canvas.width, (1 - item.y) * canvas.height); });
drawCurve(canvas, points2, "green", 3);
var x = Math.random();
var num = 10000;
console.time("feng");
for (var i = 0; i < num; i++) {
    var v2 = getCurveAtX([new Point(0, 0), new Point(this.point0[0], this.point0[1]), new Point(this.point1[0], this.point1[1]), new Point(1, 1)], x);
}
console.timeEnd("feng");
console.time("feng1");
for (var i = 0; i < num; i++) {
    var t = cx.findTatValue(x);
    var v3 = cy.getValue(t);
}
console.timeEnd("feng1");
console.time("bezier");
for (var i = 0; i < num; i++) {
    var v1 = bezier.getValue(x);
}
console.timeEnd("bezier");
console.log(v2.x, v2.y);
console.log(x, v1);
console.log(x, v3);
// new BezierTest();
// var points = [new Point(0, 0), new Point(Math.random(), Math.random()), new Point(Math.random(), Math.random()), new Point(1, 1)];
// var bezier = new Bezier(points[1].x, points[1].y, points[2].x, points[2].y);
// var t = 0.5;
// var v1 = bezier.getValue(t);
// var v2 = curve(t, points);
// v1;
// v2; 
//# sourceMappingURL=bezier.js.map