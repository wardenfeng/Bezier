/**
 * Bézier曲线
 */
var bezier;
/**
 * 方程求解
 */
var equationSolving;
/**
 * 方程求解
 * 参考：高等数学 第七版上册 第三章第八节 方程的近似解
 * 当f(x)在区间 [a, b] 上连续，且f(a) * f(b) <= 0 时，f(x)在区间 [a, b] 上至少存在一个解使得 f(x) == 0
 *
 * 当f(x)在区间 [a, b] 上连续，且 (f(a) - y) * (f(b) - y) < 0 时，f(x)在区间 [a, b] 上至少存在一个解使得 f(x) == y
 */
var EquationSolving = /** @class */ (function () {
    function EquationSolving() {
    }
    /**
     * 比较 a 与 b 是否相等
     * @param a 值a
     * @param b 值b
     * @param precision 比较精度
     */
    EquationSolving.prototype.equalNumber = function (a, b, precision) {
        if (precision === void 0) { precision = 0.0000001; }
        return Math.abs(a - b) < precision;
    };
    /**
     * 函数是否连续
     * @param f 函数
     */
    EquationSolving.prototype.isContinuous = function (f) {
        return true;
    };
    /**
     * 方程 f(x) == 0 在 [a, b] 区间内是否有解
     *
     * 当f(x)在区间 [a, b] 上连续，且f(a) * f(b) <= 0 时，f(x)在区间 [a, b] 上至少存在一个解使得 f(x) == 0
     *
     * @param f 函数f(x)
     * @param a 区间起点
     * @param b 区间终点
     * @param errorcallback  错误回调函数
     *
     * @returns 是否有解
     */
    EquationSolving.prototype.hasSolution = function (f, a, b, errorcallback) {
        if (!this.isContinuous(f)) {
            errorcallback && errorcallback(new Error("\u51FD\u6570 " + f + " \u5728 [" + a + " ," + b + "] \u533A\u95F4\u5185\u4E0D\u8FDE\u7EED\uFF0C\u65E0\u6CD5\u4E3A\u5176\u6C42\u89E3\uFF01"));
            return false;
        }
        var fa = f(a);
        var fb = f(b);
        if (fa * fb > 0) {
            errorcallback && errorcallback(new Error("f(a) * f(b) \u503C\u4E3A " + fa * fb + "\uFF0C\u4E0D\u6EE1\u8DB3 f(a) * f(b) <= 0\uFF0C\u65E0\u6CD5\u4E3A\u5176\u6C42\u89E3\uFF01"));
            return false;
        }
        return true;
    };
    /**
     * 二分法
     *
     * @param f 函数f(x)
     * @param a 区间起点
     * @param b 区间终点
     * @param precision 求解精度
     * @param errorcallback  错误回调函数
     *
     * @returns 不存在解时返回 undefined ，存在时返回 解
     */
    EquationSolving.prototype.binary = function (f, a, b, precision, errorcallback) {
        if (precision === void 0) { precision = 0.0000001; }
        if (!this.hasSolution(f, a, b, errorcallback))
            return undefined;
        var fa = f(a);
        var fb = f(b);
        if (this.equalNumber(fa, 0, precision)) {
            return a;
        }
        if (this.equalNumber(fb, 0, precision)) {
            return b;
        }
        do {
            var r = (a + b) / 2;
            var fr = f(r);
            if (fa * fr < 0) {
                b = r;
                fb = fr;
            }
            else {
                a = r;
                fa = fr;
            }
        } while (!this.equalNumber(fr, 0, precision));
        return r;
    };
    return EquationSolving;
}());
equationSolving = new EquationSolving();
/**
 * Bézier曲线
 * @see https://en.wikipedia.org/wiki/B%C3%A9zier_curve
 *
 * #### getTFromValueAtRange 与 getExtremumAtRange 使用到了方程求解
 *
 * 方程的近似解
 * 参考：高等数学 第七版上册 第三章第八节 方程的近似解
 * 定义： f(x)在区间 [a, b] 上连续，且 (f(a) - y) * (f(b) - y) < 0
 * 推论： f(x)在区间 [a, b] 上至少存在一个解使得 f(x) == 0
 *
 * 以下方法可以求解
 * 1. 二分法
 *      if( f((a+b)/2 )
 *
 * 1. 放弃，二分法；估计结果在两个端点之间；效率最差，区间内有解情况下可以确保取到解
 * 1. 选用，两端评估，根据两端作为斜率进行对目标值位置进行评估；区间内有解情况下可以确保取到解
 * 1. 放弃，切线法，根据当前斜率进行对目标值位置进行评估 （貌似是牛顿迭代）；可能会跳出该区间取到其他区间的解（特别是在高次Bézier曲线时），很难控制
 * 1.
 *
 * @author feng / http://feng3d.com 03/06/2018
 */
var Bezier = /** @class */ (function () {
    function Bezier() {
    }
    /**
     * 线性Bézier曲线
     * 给定不同的点P0和P1，线性Bézier曲线就是这两个点之间的直线。曲线由下式给出
     * ```
     * B(t) = p0 + t * (p1 - p0) = (1 - t) * p0 + t * p1 , 0 <= t && t <= 1
     * ```
     * 相当于线性插值
     *
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     */
    Bezier.prototype.linear = function (t, p0, p1) {
        return p0 + t * (p1 - p0);
        // return (1 - t) * p0 + t * p1;
    };
    /**
     * 线性Bézier曲线关于t的导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     */
    Bezier.prototype.linearDerivative = function (t, p0, p1) {
        return p1 - p0;
    };
    /**
     * 线性Bézier曲线关于t的二阶导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     */
    Bezier.prototype.linearSecondDerivative = function (t, p0, p1) {
        return 0;
    };
    /**
     * 二次Bézier曲线
     *
     * 二次Bézier曲线是由函数B（t）跟踪的路径，给定点P0，P1和P2，
     * ```
     * B(t) = (1 - t) * ((1 - t) * p0 + t * p1) + t * ((1 - t) * p1 + t * p2) , 0 <= t && t <= 1
     * ```
     * 这可以解释为分别从P0到P1和从P1到P2的线性Bézier曲线上相应点的线性插值。重新排列前面的等式得出：
     * ```
     * B(t) = (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2 , 0 <= t && t <= 1
     * ```
     * Bézier曲线关于t的导数是
     * ```
     * B'(t) = 2 * (1 - t) * (p1 - p0) + 2 * t * (p2 - p1)
     * ```
     * 从中可以得出结论：在P0和P2处曲线的切线在P 1处相交。随着t从0增加到1，曲线沿P1的方向从P0偏离，然后从P1的方向弯曲到P2。
     *
     * Bézier曲线关于t的二阶导数是
     * ```
     * B''(t) = 2 * (p2 - 2 * p1 + p0)
     * ```
     *
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     */
    Bezier.prototype.quadratic = function (t, p0, p1, p2) {
        // return this.linear(t, this.linear(t, p0, p1), this.linear(t, p1, p2));
        // return (1 - t) * ((1 - t) * p0 + t * p1) + t * ((1 - t) * p1 + t * p2);
        return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    };
    /**
     * 二次Bézier曲线关于t的导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     */
    Bezier.prototype.quadraticDerivative = function (t, p0, p1, p2) {
        // return 2 * this.linear(t, this.linearDerivative(t, p0, p1), this.linearDerivative(t, p1, p2));
        return 2 * (1 - t) * (p1 - p0) + 2 * t * (p2 - p1);
    };
    /**
     * 二次Bézier曲线关于t的二阶导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     */
    Bezier.prototype.quadraticSecondDerivative = function (t, p0, p1, p2) {
        // return 1 * 2 * this.linearDerivative(t, p1 - p0, p2 - p1)
        // return 1 * 2 * ((p2 - p1) - (p1 - p0));
        return 2 * (p2 - 2 * p1 + p0);
    };
    /**
     * 立方Bézier曲线
     *
     * 平面中或高维空间中（其实一维也是成立的，这里就是使用一维计算）的四个点P0，P1，P2和P3定义了三次Bézier曲线。
     * 曲线开始于P0朝向P1并且从P2的方向到达P3。通常不会通过P1或P2; 这些点只是为了提供方向信息。
     * P1和P2之间的距离在转向P2之前确定曲线向P1移动的“多远”和“多快” 。
     *
     * 对于由点Pi，Pj和Pk定义的二次Bézier曲线，可以将Bpipjpk(t)写成三次Bézier曲线，它可以定义为两条二次Bézier曲线的仿射组合：
     * ```
     * B(t) = (1 - t) * Bp0p1p2(t) + t * Bp1p2p3(t) , 0 <= t && t <= 1
     * ```
     * 曲线的显式形式是：
     * ```
     * B(t) = (1 - t) * (1 - t) * (1 - t) * p0 + 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t * p3 , 0 <= t && t <= 1
     * ```
     * 对于P1和P2的一些选择，曲线可以相交，或者包含尖点。
     *
     * 三次Bézier曲线相对于t的导数是
     * ```
     * B'(t) = 3 * (1 - t) * (1 - t) * (p1 - p0) + 6 * (1 - t) * t * (p2 - p1) + 3 * t * t * (p3 - p2);
     * ```
     * 三次Bézier曲线关于t的二阶导数是
     * ```
     * 6 * (1 - t) * (p2 - 2 * p1 + p0) + 6 * t * (p3 - 2 * p2 + p1);
     * ```
     *
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     * @param p3 点3
     */
    Bezier.prototype.cubic = function (t, p0, p1, p2, p3) {
        // return this.linear(t, this.quadratic(t, p0, p1, p2), this.quadratic(t, p1, p2, p3));
        return (1 - t) * (1 - t) * (1 - t) * p0 + 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t * p3;
    };
    /**
     * 三次Bézier曲线关于t的导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     * @param p3 点3
     */
    Bezier.prototype.cubicDerivative = function (t, p0, p1, p2, p3) {
        // return 3 * this.linear(t, this.quadraticDerivative(t, p0, p1, p2), this.quadraticDerivative(t, p1, p2, p3));
        return 3 * (1 - t) * (1 - t) * (p1 - p0) + 6 * (1 - t) * t * (p2 - p1) + 3 * t * t * (p3 - p2);
    };
    /**
     * 三次Bézier曲线关于t的二阶导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     */
    Bezier.prototype.cubicSecondDerivative = function (t, p0, p1, p2, p3) {
        // return 3 * this.linear(t, this.quadraticSecondDerivative(t, p0, p1, p2), this.quadraticSecondDerivative(t, p1, p2, p3));
        return 6 * (1 - t) * (p2 - 2 * p1 + p0) + 6 * t * (p3 - 2 * p2 + p1);
    };
    /**
     * n次Bézier曲线
     *
     * 一般定义
     *
     * Bézier曲线可以定义为任意度n。
     *
     * @param t 插值度
     * @param ps 点列表 ps.length == n+1
     * @param processs 收集中间过程数据，可用作Bézier曲线动画数据
     */
    Bezier.prototype.bn = function (t, ps, processs) {
        if (processs === void 0) { processs = null; }
        ps = ps.concat();
        if (processs)
            processs.push(ps.concat());
        // n次Bézier递推
        for (var i = ps.length - 1; i > 0; i--) {
            for (var j = 0; j < i; j++) {
                ps[j] = (1 - t) * ps[j] + t * ps[j + 1];
            }
            if (processs) {
                ps.length = ps.length - 1;
                processs.push(ps.concat());
            }
        }
        return ps[0];
    };
    /**
     * n次Bézier曲线关于t的导数
     *
     * 一般定义
     *
     * Bézier曲线可以定义为任意度n。
     *
     * @param t 插值度
     * @param ps 点列表 ps.length == n+1
     */
    Bezier.prototype.bnDerivative = function (t, ps) {
        if (ps.length < 2)
            return 0;
        ps = ps.concat();
        // 进行
        for (var i = 0, n = ps.length - 1; i < n; i++) {
            ps[i] = ps[i + 1] - ps[i];
        }
        //
        ps.length = ps.length - 1;
        var v = ps.length * this.bn(t, ps);
        return v;
    };
    /**
     * n次Bézier曲线关于t的二阶导数
     *
     * 一般定义
     *
     * Bézier曲线可以定义为任意度n。
     *
     * @param t 插值度
     * @param ps 点列表 ps.length == n+1
     */
    Bezier.prototype.bnSecondDerivative = function (t, ps) {
        if (ps.length < 3)
            return 0;
        ps = ps.concat();
        // 进行
        for (var i = 0, n = ps.length - 1; i < n; i++) {
            ps[i] = ps[i + 1] - ps[i];
        }
        //
        ps.length = ps.length - 1;
        var v = ps.length * this.bnDerivative(t, ps);
        return v;
    };
    /**
     * n次Bézier曲线关于t的dn阶导数
     *
     * Bézier曲线可以定义为任意度n。
     *
     * @param t 插值度
     * @param dn 求导次数
     * @param ps 点列表     ps.length == n+1
     */
    Bezier.prototype.bnND = function (t, dn, ps) {
        if (ps.length < dn + 1)
            return 0;
        var factorial = 1;
        ps = ps.concat();
        for (var j = 0; j < dn; j++) {
            // 进行
            for (var i = 0, n = ps.length - 1; i < n; i++) {
                ps[i] = ps[i + 1] - ps[i];
            }
            //
            ps.length = ps.length - 1;
            factorial *= ps.length;
        }
        var v = factorial * this.bn(t, ps);
        return v;
    };
    /**
     * 获取曲线在指定插值度上的值
     * @param t 插值度
     * @param ps 点列表
     */
    Bezier.prototype.getValue = function (t, ps) {
        if (ps.length == 2) {
            return this.linear(t, ps[0], ps[1]);
        }
        if (ps.length == 3) {
            return this.quadratic(t, ps[0], ps[1], ps[2]);
        }
        if (ps.length == 4) {
            return this.cubic(t, ps[0], ps[1], ps[2], ps[3]);
        }
        return this.bn(t, ps);
        // var t1 = 1 - t;
        // return t1 * t1 * t1 * ps[0] + 3 * t1 * t1 * t * ps[1] + 3 * t1 * t * t * ps[2] + t * t * t * ps[3];
    };
    /**
     * 获取曲线在指定插值度上的导数(斜率)
     * @param t 插值度
     * @param ps 点列表
     */
    Bezier.prototype.getDerivative = function (t, ps) {
        if (ps.length == 2) {
            return this.linearDerivative(t, ps[0], ps[1]);
        }
        if (ps.length == 3) {
            return this.quadraticDerivative(t, ps[0], ps[1], ps[2]);
        }
        if (ps.length == 4) {
            return this.cubicDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        }
        return this.bnDerivative(t, ps);
        // return 3 * (1 - t) * (1 - t) * (ps[1] - ps[0]) + 6 * (1 - t) * t * (ps[2] - ps[1]) + 3 * t * t * (ps[3] - ps[2]);
    };
    /**
     * 获取曲线在指定插值度上的二阶导数
     * @param t 插值度
     * @param ps 点列表
     */
    Bezier.prototype.getSecondDerivative = function (t, ps) {
        if (ps.length == 2) {
            return this.linearSecondDerivative(t, ps[0], ps[1]);
        }
        if (ps.length == 3) {
            return this.quadraticSecondDerivative(t, ps[0], ps[1], ps[2]);
        }
        if (ps.length == 4) {
            return this.cubicSecondDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        }
        return this.bnSecondDerivative(t, ps);
        // return 3 * (1 - t) * (1 - t) * (ps[1] - ps[0]) + 6 * (1 - t) * t * (ps[2] - ps[1]) + 3 * t * t * (ps[3] - ps[2]);
    };
    /**
     * 查找区间内极值列表
     *
     * @param ps 点列表
     * @param numSamples 采样次数，用于分段查找极值
     * @param precision  查找精度
     *
     * @returns 极值列表 {} {ts: 极值插值度列表,vs: 极值值列表}
     */
    Bezier.prototype.getExtremums = function (ps, numSamples, precision) {
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        var samples = [];
        for (var i = 0; i <= numSamples; i++) {
            samples.push(this.getDerivative(i / numSamples, ps));
        }
        // 查找存在解的分段
        var resultRanges = [];
        for (var i = 0, n = numSamples; i < n; i++) {
            if (samples[i] * samples[i + 1] < 0) {
                resultRanges.push([i / numSamples, (i + 1) / numSamples]);
            }
        }
        //
        var resultTs = [];
        var resultVs = [];
        for (var i = 0, n = resultRanges.length; i < n; i++) {
            var range = resultRanges[i];
            var guessT = this.getExtremumAtRange(0, ps, range[0], range[1], precision);
            resultTs.push(guessT);
            resultVs.push(this.getValue(guessT, ps));
        }
        return { ts: resultTs, vs: resultVs };
    };
    /**
     * 在导数曲线单调区间内查找指定导数所在插值度
     *
     * @param targetD 目标斜率
     * @param ps 点列表
     * @param startT 起始插值点
     * @param endT 终止插值点
     * @param precision 插值精度
     */
    Bezier.prototype.getExtremumAtRange = function (targetD, ps, startT, endT, precision) {
        if (precision === void 0) { precision = 0.0000001; }
        var startV = this.getDerivative(startT, ps);
        var endV = this.getDerivative(endT, ps);
        var dir = endV - startV;
        //
        var guessT = startT + (0 - startV) / (endV - startV) * (endT - startT);
        // 使用二分查找
        // var guessT = (startT + endT) / 2;
        var guessV = this.getDerivative(guessT, ps);
        while (Math.abs(guessV) > precision) 
        // while (Math.abs(startT - endT) > precision)
        {
            if (guessV * dir > 0) {
                endT = guessT;
                endV = guessV;
            }
            else {
                startT = guessT;
                startV = guessV;
            }
            guessT = startT + (0 - startV) / (endV - startV) * (endT - startT);
            // 使用二分查找
            // guessT = (startT + endT) / 2;
            guessV = this.getDerivative(guessT, ps);
        }
        return guessT;
    };
    /**
     * 获取单调区间列表
     * @returns {} {ts: 区间节点插值度列表,vs: 区间节点值列表}
     */
    Bezier.prototype.getMonotoneIntervals = function (ps, numSamples, precision) {
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        // 区间内的单调区间
        var monotoneIntervalTs = [0, 1];
        var monotoneIntervalVs = [ps[0], ps[ps.length - 1]];
        // 预先计算好极值
        var extremums = this.getExtremums(ps, numSamples, precision);
        for (var i = 0; i < extremums.ts.length; i++) {
            // 增加单调区间
            monotoneIntervalTs.splice(i + 1, 0, extremums.ts[i]);
            monotoneIntervalVs.splice(i + 1, 0, extremums.vs[i]);
        }
        return { ts: monotoneIntervalTs, vs: monotoneIntervalVs };
    };
    /**
     * 获取目标值所在的插值度T
     *
     * @param targetV 目标值
     * @param ps 点列表
     * @param numSamples 分段数量，用于分段查找，用于解决寻找多个解、是否无解等问题；过少的分段可能会造成找不到存在的解决，过多的分段将会造成性能很差。
     * @param precision  查找精度
     *
     * @returns 返回解数组
     */
    Bezier.prototype.getTFromValue = function (targetV, ps, numSamples, precision) {
        var _this = this;
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        // 获取单调区间
        var monotoneIntervals = this.getMonotoneIntervals(ps, numSamples, precision);
        var monotoneIntervalTs = monotoneIntervals.ts;
        var monotoneIntervalVs = monotoneIntervals.vs;
        // 存在解的单调区间
        var resultRanges = [];
        // 遍历单调区间
        for (var i = 0, n = monotoneIntervalVs.length - 1; i < n; i++) {
            if ((monotoneIntervalVs[i] - targetV) * (monotoneIntervalVs[i + 1] - targetV) <= 0) {
                resultRanges.push([monotoneIntervalTs[i], monotoneIntervalTs[i + 1]]);
            }
        }
        var results = [];
        for (var i = 0, n = resultRanges.length; i < n; i++) {
            var result = this.getTFromValueAtRange(targetV, ps, resultRanges[i][0], resultRanges[i][1], precision);
            // debugger;
            var result = equationSolving.binary(function (x) { return _this.getValue(x, ps) - targetV; }, resultRanges[i][0], resultRanges[i][1], precision);
            results.push(result);
        }
        return results;
    };
    /**
     * 从存在解的区域进行插值值
     *
     * 该函数只能从单调区间内查找值，并且 targetV 处于该区间内
     *
     * @param targetV 目标值
     * @param ps 点列表
     * @param startT 起始插值度
     * @param endT 终止插值度
     * @param precision  查找精度
     */
    Bezier.prototype.getTFromValueAtRange = function (targetV, ps, startT, endT, precision) {
        if (precision === void 0) { precision = 0.0000001; }
        var startV = this.getValue(startT, ps);
        var endV = this.getValue(endT, ps);
        var dir = endV - startV;
        var guessT = startT + (targetV - startV) / (endV - startV) * (endT - startT);
        // 使用二分查找
        // var guessT = (startT + endT) / 2;
        var guessV = this.getValue(guessT, ps);
        while (Math.abs(guessV - targetV) > precision) 
        // while (Math.abs(startT - endT) > precision)
        {
            if ((guessV - targetV) * dir > 0) {
                endT = guessT;
                endV = guessV;
            }
            else {
                startT = guessT;
                startV = guessV;
            }
            // 使用斜率进行预估目标位置
            guessT = startT + (targetV - startV) / (endV - startV) * (endT - startT);
            // 使用二分查找
            // guessT = (startT + endT) / 2;
            guessV = this.getValue(guessT, ps);
        }
        return guessT;
    };
    /**
     * 获取曲线样本数据
     *
     * 这些点可用于连线来拟合曲线。
     *
     * @param ps 点列表
     * @param num 采样次数 ，采样点分别为[0,1/num,2/num,....,(num-1)/num,1]
     */
    Bezier.prototype.getSamples = function (ps, num) {
        if (num === void 0) { num = 100; }
        var results = [];
        for (var i = 0; i <= num; i++) {
            var p = this.getValue(i / num, ps);
            results.push(p);
        }
        return results;
    };
    return Bezier;
}());
bezier = new Bezier();
/**
 * 立方Bézier曲线
 *
 * 为了提升性能以及简化接口单独从Bezier.ts提取出来。
 *
 * @author feng / http://feng3d.com 03/06/2018
 */
var CubicBezier = /** @class */ (function () {
    /**
     * 创建立方Bézier曲线
     * @param p0 起始点
     * @param p1 控制点1
     * @param p2 控制点2
     * @param p3 终止点
     */
    function CubicBezier(p0, p1, p2, p3) {
        // cache
        /**
         * 单调区间插值点列表
         */
        this.monotoneIntervalTs = [];
        /**
         * 单调区间值列表
         */
        this.monotoneIntervalVs = [];
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        // 缓存单调区间
        var monotoneIntervals = this.getMonotoneIntervals();
        this.monotoneIntervalTs = monotoneIntervals.ts;
        this.monotoneIntervalVs = monotoneIntervals.vs;
    }
    /**
     *
     * @param t 插值度
     */
    CubicBezier.prototype.getValue = function (t) {
        return (1 - t) * (1 - t) * (1 - t) * this.p0 + 3 * (1 - t) * (1 - t) * t * this.p1 + 3 * (1 - t) * t * t * this.p2 + t * t * t * this.p3;
    };
    /**
     * 三次Bézier曲线关于t的导数
     * @param t 插值度
     */
    CubicBezier.prototype.getDerivative = function (t) {
        return 3 * (1 - t) * (1 - t) * (this.p1 - this.p0) + 6 * (1 - t) * t * (this.p2 - this.p1) + 3 * t * t * (this.p3 - this.p2);
    };
    /**
     * 三次Bézier曲线关于t的二阶导数
     * @param t 插值度
     */
    CubicBezier.prototype.getSecondDerivative = function (t) {
        return 6 * (1 - t) * (this.p2 - 2 * this.p1 + this.p0) + 6 * t * (this.p3 - 2 * this.p2 + this.p1);
    };
    /**
     * 查找区间内极值列表
     *
     * @param numSamples 采样次数，用于分段查找极值
     * @param precision  查找精度
     *
     * @returns 极值列表 {} {ts: 极值插值度列表,vs: 极值值列表}
     */
    CubicBezier.prototype.getExtremums = function (numSamples, precision) {
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        var samples = [];
        for (var i = 0; i <= numSamples; i++) {
            samples.push(this.getDerivative(i / numSamples));
        }
        // 查找存在解的分段
        var resultRanges = [];
        for (var i = 0, n = numSamples; i < n; i++) {
            if (samples[i] * samples[i + 1] < 0) {
                resultRanges.push([i / numSamples, (i + 1) / numSamples]);
            }
        }
        //
        var resultTs = [];
        var resultVs = [];
        for (var i = 0, n = resultRanges.length; i < n; i++) {
            var range = resultRanges[i];
            var guessT = this.getExtremumAtRange(0, range[0], range[1], precision);
            resultTs.push(guessT);
            resultVs.push(this.getValue(guessT));
        }
        return { ts: resultTs, vs: resultVs };
    };
    /**
     * 在导数曲线单调区间内查找指定导数所在插值度
     *
     * @param targetD 目标斜率
     * @param startT 起始插值点
     * @param endT 终止插值点
     * @param precision 插值精度
     */
    CubicBezier.prototype.getExtremumAtRange = function (targetD, startT, endT, precision) {
        if (precision === void 0) { precision = 0.0000001; }
        var startV = this.getDerivative(startT);
        var endV = this.getDerivative(endT);
        var dir = endV - startV;
        //
        var guessT = startT + (0 - startV) / (endV - startV) * (endT - startT);
        // 使用二分查找
        // var guessT = (startT + endT) / 2;
        var guessV = this.getDerivative(guessT);
        while (Math.abs(guessV) > precision) 
        // while (Math.abs(startT - endT) > precision)
        {
            if (guessV * dir > 0) {
                endT = guessT;
                endV = guessV;
            }
            else {
                startT = guessT;
                startV = guessV;
            }
            guessT = startT + (0 - startV) / (endV - startV) * (endT - startT);
            // 使用二分查找
            // guessT = (startT + endT) / 2;
            guessV = this.getDerivative(guessT);
        }
        return guessT;
    };
    /**
     * 获取单调区间列表
     * @returns {} {ts: 区间节点插值度列表,vs: 区间节点值列表}
     */
    CubicBezier.prototype.getMonotoneIntervals = function (numSamples, precision) {
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        // 区间内的单调区间
        var monotoneIntervalTs = [0, 1];
        var monotoneIntervalVs = [this.p0, this.p3];
        // 预先计算好极值
        var extremums = this.getExtremums(numSamples, precision);
        for (var i = 0; i < extremums.ts.length; i++) {
            // 增加单调区间
            monotoneIntervalTs.splice(i + 1, 0, extremums.ts[i]);
            monotoneIntervalVs.splice(i + 1, 0, extremums.vs[i]);
        }
        return { ts: monotoneIntervalTs, vs: monotoneIntervalVs };
    };
    /**
     * 获取目标值所在的插值度T
     *
     * @param targetV 目标值
     * @param numSamples 分段数量，用于分段查找，用于解决寻找多个解、是否无解等问题；过少的分段可能会造成找不到存在的解决，过多的分段将会造成性能很差。
     * @param precision  查找精度
     *
     * @returns 返回解数组
     */
    CubicBezier.prototype.getTFromValue = function (targetV, numSamples, precision) {
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        // 获取单调区间
        var monotoneIntervals = this.getMonotoneIntervals(numSamples, precision);
        var monotoneIntervalTs = monotoneIntervals.ts;
        var monotoneIntervalVs = monotoneIntervals.vs;
        // 存在解的单调区间
        var resultRanges = [];
        // 遍历单调区间
        for (var i = 0, n = monotoneIntervalVs.length - 1; i < n; i++) {
            if ((monotoneIntervalVs[i] - targetV) * (monotoneIntervalVs[i + 1] - targetV) <= 0) {
                resultRanges.push([monotoneIntervalTs[i], monotoneIntervalTs[i + 1]]);
            }
        }
        var results = [];
        for (var i = 0, n = resultRanges.length; i < n; i++) {
            var result = this.getTFromValueAtRange(targetV, resultRanges[i][0], resultRanges[i][1], precision);
            results.push(result);
        }
        return results;
    };
    /**
     * 从存在解的区域进行插值值
     *
     * 该函数只能从单调区间内查找值，并且 targetV 处于该区间内
     *
     * @param targetV 目标值
     * @param startT 起始插值度
     * @param endT 终止插值度
     * @param precision  查找精度
     */
    CubicBezier.prototype.getTFromValueAtRange = function (targetV, startT, endT, precision) {
        if (precision === void 0) { precision = 0.0000001; }
        var startV = this.getValue(startT);
        var endV = this.getValue(endT);
        var dir = endV - startV;
        // 使用斜率进行预估目标位置
        var guessT = startT + (targetV - startV) / (endV - startV) * (endT - startT);
        // 使用二分查找
        // var guessT = (startT + endT) / 2;
        var guessV = this.getValue(guessT);
        while (Math.abs(guessV - targetV) > precision) 
        // while (Math.abs(startT - endT) > precision)
        {
            if ((guessV - targetV) * dir > 0) {
                endT = guessT;
                endV = guessV;
            }
            else {
                startT = guessT;
                startV = guessV;
            }
            // 使用斜率进行预估目标位置
            guessT = startT + (targetV - startV) / (endV - startV) * (endT - startT);
            // 使用二分查找
            // guessT = (startT + endT) / 2;
            guessV = this.getValue(guessT);
        }
        return guessT;
    };
    /**
     * 获取曲线样本数据
     *
     * 这些点可用于连线来拟合曲线。
     *
     * @param num 采样次数 ，采样点分别为[0,1/num,2/num,....,(num-1)/num,1]
     */
    CubicBezier.prototype.getSamples = function (num) {
        if (num === void 0) { num = 100; }
        var results = [];
        for (var i = 0; i <= num; i++) {
            var p = this.getValue(i / num);
            results.push(p);
        }
        return results;
    };
    return CubicBezier;
}());
QUnit.module("CubicBezier", function () {
    // 允许误差
    var deviation = 0.0000001;
    QUnit.test("getExtremums ，查找区间内极值列表 ", function (assert) {
        for (var j = 0; j < 10; j++) {
            var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
            var bezier = new CubicBezier(ps[0], ps[1], ps[2], ps[3]);
            // 查找区间内极值所在插值度列表
            var extremums = bezier.getExtremums(20, deviation);
            var ts = extremums.ts;
            var vs = extremums.vs;
            if (ts.length > 0) {
                for (var i = 0, n = ts.length; i < n; i++) {
                    assert.ok(0 <= ts[i] && ts[i] <= 1, "\u6781\u503C\u4F4D\u7F6E " + ts[i] + " \u5FC5\u987B\u5728\u533A\u57DF [0,1] \u5185");
                    // 极值
                    var extremum = vs[i];
                    // 极值前面的数据
                    var prex = ts[i] - 0.001;
                    if (0 < i)
                        prex = ts[i - 1] + 0.999 * (ts[i - 1] - ts[i]);
                    var prev = bezier.getValue(prex);
                    // 极值后面面的数据
                    var nextx = ts[i] + 0.001;
                    if (i < n - 1)
                        nextx = ts[i] + 0.001 * (ts[i] - ts[i + 1]);
                    var nextv = bezier.getValue(nextx);
                    // 斜率
                    var derivative = bezier.getDerivative(ts[i]);
                    assert.ok(Math.abs(derivative) < deviation, ps.length - 1 + "\u6B21B\u00E9zier\u66F2\u7EBF \u7B2C" + i + "\u4E2A\u89E3 \u6781\u503C\u4F4D\u7F6E\uFF1A" + ts[i] + " \u659C\u7387\uFF1A " + derivative + " \n \u524D\u9762\u503C\uFF1A " + prev + " \n \u6781\u503C\uFF1A " + extremum + " \n \u540E\u9762\u7684\u503C " + nextv);
                }
            }
            else {
                assert.ok(true, "没有找到极值");
            }
        }
    });
    QUnit.test("getTFromValue ，获取目标值所在的插值度T，返回区间内所有解", function (assert) {
        for (var j = 0; j < 10; j++) {
            var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
            var bezier = new CubicBezier(ps[0], ps[1], ps[2], ps[3]);
            // 为了确保有解，去平均值
            var targetV = ps.reduce(function (pre, item) { return pre + item; }, 0) / ps.length;
            var ts = bezier.getTFromValue(targetV, 10, deviation);
            if (ts.length > 0) {
                for (var i = 0; i < ts.length; i++) {
                    var tv = bezier.getValue(ts[i]);
                    assert.ok(Math.abs(tv - targetV) < deviation, ps.length - 1 + "\u6B21B\u00E9zier\u66F2\u7EBF \u7B2C" + i + "\u4E2A\u89E3 \u76EE\u6807\u503C\uFF1A" + targetV + " \u67E5\u627E\u5230\u7684\u503C\uFF1A" + tv + " \u67E5\u627E\u5230\u7684\u4F4D\u7F6E\uFF1A" + ts[i]);
                    assert.ok(0 <= ts[i] && ts[i] <= 1, ts[i] + " \u89E3\u5FC5\u987B\u5728 [0,1] \u533A\u95F4\u5185 ");
                }
            }
            else {
                assert.ok(false, "\u6CA1\u6709\u627E\u5230\u76EE\u6807\u503C");
            }
        }
    });
});
QUnit.module("Bezier", function () {
    // 允许误差
    var deviation = 0.0000001;
    QUnit.test("bn linear ，使用n次Bézier计算一次Bézier曲线", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        var v0 = bezier.linear(t, ps[0], ps[1]);
        var v1 = bezier.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);
    });
    QUnit.test("bn quadratic ，使用n次Bézier计算二次Bézier曲线", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        var v0 = bezier.quadratic(t, ps[0], ps[1], ps[2]);
        var v1 = bezier.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);
    });
    QUnit.test("bn cubic ，使用n次Bézier计算三次Bézier曲线", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        var v0 = bezier.cubic(t, ps[0], ps[1], ps[2], ps[3]);
        var v1 = bezier.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);
        var v2 = bezier.getValue(t, ps);
        assert.ok(Math.abs(v0 - v2) < deviation);
    });
    QUnit.test("bnD linearDerivative ，使用n次Bézier导数计算一次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezier.linearDerivative(t, ps[0], ps[1]);
        var d1 = bezier.bnDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnD quadraticDerivative ，使用n次Bézier导数计算二次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.quadraticDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezier.bnDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnD cubicDerivative ，使用n次Bézier导数计算三次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.cubicDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezier.bnDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnSD linearSecondDerivative ，使用n次Bézier二阶导数计算一次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezier.linearSecondDerivative(t, ps[0], ps[1]);
        var d1 = bezier.bnSecondDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnSD quadraticSecondDerivative ，使用n次Bézier二阶导数计算二次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.quadraticSecondDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezier.bnSecondDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnSD cubicSecondDerivative ，使用n次Bézier二阶导数计算三次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.cubicSecondDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezier.bnSecondDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND linearDerivative ，使用n次BézierN阶导数计算一次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezier.linearDerivative(t, ps[0], ps[1]);
        var d1 = bezier.bnND(t, 1, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND quadraticDerivative ，使用n次BézierN阶导数计算二次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.quadraticDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezier.bnND(t, 1, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND cubicDerivative ，使用n次BézierN阶导数计算三次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.cubicDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezier.bnND(t, 1, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND linearSecondDerivative ，使用n次BézierN阶导数计算一次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezier.linearSecondDerivative(t, ps[0], ps[1]);
        var d1 = bezier.bnND(t, 2, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND quadraticSecondDerivative ，使用n次BézierN阶导数计算二次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.quadraticSecondDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezier.bnND(t, 2, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND cubicSecondDerivative ，使用n次BézierN阶导数计算三次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.cubicSecondDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezier.bnND(t, 2, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("getExtremums ，查找区间内极值列表 ", function (assert) {
        for (var j = 0; j < 10; j++) {
            var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
            // 测试高次Bézier曲线
            var n = Math.floor(Math.random() * 5);
            for (var i = 0; i < n; i++) {
                ps.push(Math.random());
            }
            // 查找区间内极值所在插值度列表
            var extremums = bezier.getExtremums(ps, 20, deviation);
            var ts = extremums.ts;
            var vs = extremums.vs;
            for (var i = 0, n_1 = ts.length; i < n_1; i++) {
                assert.ok(0 <= ts[i] && ts[i] <= 1, "\u6781\u503C\u4F4D\u7F6E " + ts[i] + " \u5FC5\u987B\u5728\u533A\u57DF [0,1] \u5185");
                // 极值
                var extremum = vs[i];
                // 极值前面的数据
                var prex = ts[i] - 0.001;
                if (0 < i)
                    prex = bezier.linear(0.999, ts[i - 1], ts[i]);
                var prev = bezier.getValue(prex, ps);
                // 极值后面面的数据
                var nextx = ts[i] + 0.001;
                if (i < n_1 - 1)
                    nextx = bezier.linear(0.001, ts[i], ts[i + 1]);
                var nextv = bezier.getValue(nextx, ps);
                // 斜率
                var derivative = bezier.getDerivative(ts[i], ps);
                assert.ok(Math.abs(derivative) < deviation, ps.length - 1 + "\u6B21B\u00E9zier\u66F2\u7EBF \u7B2C" + i + "\u4E2A\u89E3 \u6781\u503C\u4F4D\u7F6E\uFF1A" + ts[i] + " \u659C\u7387\uFF1A " + derivative + " \n \u524D\u9762\u503C\uFF1A " + prev + " \n \u6781\u503C\uFF1A " + extremum + " \n \u540E\u9762\u7684\u503C " + nextv);
            }
        }
        assert.ok(true);
    });
    QUnit.test("getTFromValue ，获取目标值所在的插值度T，返回区间内所有解", function (assert) {
        for (var j = 0; j < 10; j++) {
            var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
            // 测试高次Bézier曲线
            var n = Math.floor(Math.random() * 5);
            for (var i = 0; i < n; i++) {
                ps.push(Math.random());
            }
            // 为了确保有解，去平均值
            var targetV = ps.reduce(function (pre, item) { return pre + item; }, 0) / ps.length;
            var ts = bezier.getTFromValue(targetV, ps, 10, deviation);
            if (ts.length > 0) {
                for (var i = 0; i < ts.length; i++) {
                    var tv = bezier.getValue(ts[i], ps);
                    assert.ok(Math.abs(tv - targetV) < deviation, ps.length - 1 + "\u6B21B\u00E9zier\u66F2\u7EBF \u7B2C" + i + "\u4E2A\u89E3 \u76EE\u6807\u503C\uFF1A" + targetV + " \u67E5\u627E\u5230\u7684\u503C\uFF1A" + tv + " \u67E5\u627E\u5230\u7684\u4F4D\u7F6E\uFF1A" + ts[i]);
                    assert.ok(0 <= ts[i] && ts[i] <= 1, ts[i] + " \u89E3\u5FC5\u987B\u5728 [0,1] \u533A\u95F4\u5185 ");
                }
            }
        }
        assert.ok(true);
    });
});
//# sourceMappingURL=tests.js.map