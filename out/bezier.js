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
var BezierTest = /** @class */ (function () {
    function BezierTest() {
        var canvas = document.getElementById("viewport"), ctx = canvas.getContext("2d");
        var bezier = new Bezier(0.44, 0.32, 0.82, 0.56);
        // var bezier = new Bezier(0.25, 0.1, 0.0, 1.0);
        var points = [[20, 20], [80, 80], [60, 50]];
        points.length = 0;
        for (var i = 0; i < 1; i += 1 / 100) {
            points.push([i * 100, (1 - bezier.getValue(i)) * 100]);
        }
        ctx.fillStyle = 'brack';
        ctx.fillRect(0, 0, 100, 100);
        // First path
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.moveTo(points[0][0], points[0][1]);
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.stroke();
    }
    return BezierTest;
}());
new BezierTest();
//# sourceMappingURL=bezier.js.map