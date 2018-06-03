/**
 * Bézier曲线
 */
var bezierCurve;
/**
 * Bézier曲线
 * @see https://en.wikipedia.org/wiki/B%C3%A9zier_curve
 *
 * @author feng / http://feng3d.com 03/06/2018
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
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     */
    BezierCurve.prototype.linear = function (t, p0, p1) {
        return p0 + t * (p1 - p0);
        // return (1 - t) * p0 + t * p1;
    };
    /**
     * 线性Bézier曲线关于t的导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     */
    BezierCurve.prototype.linearDerivative = function (t, p0, p1) {
        return p1 - p0;
    };
    /**
     * 线性Bézier曲线关于t的二阶导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     */
    BezierCurve.prototype.linearSecondDerivative = function (t, p0, p1) {
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
    BezierCurve.prototype.quadratic = function (t, p0, p1, p2) {
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
    BezierCurve.prototype.quadraticDerivative = function (t, p0, p1, p2) {
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
    BezierCurve.prototype.quadraticSecondDerivative = function (t, p0, p1, p2) {
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
    BezierCurve.prototype.cubic = function (t, p0, p1, p2, p3) {
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
    BezierCurve.prototype.cubicDerivative = function (t, p0, p1, p2, p3) {
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
    BezierCurve.prototype.cubicSecondDerivative = function (t, p0, p1, p2, p3) {
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
     */
    BezierCurve.prototype.bn = function (t, ps) {
        ps = ps.concat();
        // n次Bézier递推
        for (var i = ps.length - 1; i > 0; i--) {
            for (var j = 0; j < i; j++) {
                ps[j] = (1 - t) * ps[j] + t * ps[j + 1];
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
    BezierCurve.prototype.bnDerivative = function (t, ps) {
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
    BezierCurve.prototype.bnSecondDerivative = function (t, ps) {
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
    BezierCurve.prototype.bnND = function (t, dn, ps) {
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
    BezierCurve.prototype.getValue = function (t, ps) {
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
    BezierCurve.prototype.getDerivative = function (t, ps) {
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
    BezierCurve.prototype.getSecondDerivative = function (t, ps) {
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
     * 查找区间内极值所在插值度列表
     *
     * @param ps 点列表
     * @param numSamples 采样次数，用于分段查找极值
     * @param precision  查找精度
     *
     * @returns 插值度列表
     */
    BezierCurve.prototype.getTAtExtremums = function (ps, numSamples, precision) {
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
                resultRanges.push(i / numSamples);
            }
        }
        //
        var results = [];
        for (var i = 0, n = resultRanges.length; i < n; i++) {
            var guessT = resultRanges[i];
            var derivative = this.getDerivative(guessT, ps);
            while (Math.abs(derivative) > precision) {
                // 使用斜率进行预估目标位置
                var slope = this.getSecondDerivative(guessT, ps);
                if (slope == 0)
                    break;
                guessT += -derivative / slope;
                derivative = this.getDerivative(guessT, ps);
            }
            if (guessT < 0 || guessT > 1) {
                console.log(guessT + " \u4E0D\u6B63\u786E\uFF01");
            }
            results.push(guessT);
        }
        return results;
    };
    /**
     * 获取单调区间列表
     * @returns {} {ts: 区间节点插值度列表,vs: 区间节点值列表}
     */
    BezierCurve.prototype.getMonotoneIntervals = function (ps, numSamples, precision) {
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        // 区间内的单调区间
        var monotoneIntervalTs = [0, 1];
        var monotoneIntervalVs = [ps[0], ps[ps.length - 1]];
        // 预先计算好极值
        var extremumTs = this.getTAtExtremums(ps, numSamples, precision);
        var extremumVs = [];
        for (var i = 0; i < extremumTs.length; i++) {
            extremumVs[i] = this.getValue(extremumTs[i], ps);
            // 增加单调区间
            monotoneIntervalTs.splice(i + 1, 0, extremumTs[i]);
            monotoneIntervalVs.splice(i + 1, 0, extremumVs[i]);
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
    BezierCurve.prototype.getTFromValue = function (targetV, ps, numSamples, precision) {
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        // 获取单调区间
        var monotoneIntervals = this.getMonotoneIntervals(ps, numSamples, precision);
        var monotoneIntervalTs = monotoneIntervals.ts;
        var monotoneIntervalVs = monotoneIntervals.vs;
        // 目标估计值列表
        var guessTs = [];
        // 遍历单调区间
        for (var i = 0, n = monotoneIntervalVs.length - 1; i < n; i++) {
            if ((monotoneIntervalVs[i] - targetV) * (monotoneIntervalVs[i + 1] - targetV) <= 0) {
                guessTs.push((monotoneIntervalTs[i] + monotoneIntervalTs[i + 1]) / 2);
            }
        }
        var results = [];
        for (var i = 0, n = guessTs.length; i < n; i++) {
            var result = this.getTFromValueAtRange(targetV, ps, guessTs[i], precision);
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
     * @param guessT 预估目标T值，单调区间内的一个预估值
     * @param precision  查找精度
     */
    BezierCurve.prototype.getTFromValueAtRange = function (targetV, ps, guessT, precision) {
        if (guessT === void 0) { guessT = 0; }
        if (precision === void 0) { precision = 0.0000001; }
        var middleV = this.getValue(guessT, ps);
        while (Math.abs(middleV - targetV) > precision) {
            // 使用斜率进行预估目标位置
            var slope = this.getDerivative(guessT, ps);
            if (slope == 0)
                break;
            guessT += (targetV - middleV) / slope;
            middleV = this.getValue(guessT, ps);
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
    BezierCurve.prototype.getSamples = function (ps, num) {
        if (num === void 0) { num = 100; }
        var results = [];
        for (var i = 0; i <= num; i++) {
            var p = this.getValue(i / num, ps);
            results.push(p);
        }
        return results;
    };
    return BezierCurve;
}());
bezierCurve = new BezierCurve();
QUnit.module("BezierCurve", function () {
    // 允许误差
    var deviation = 0.0000001;
    QUnit.test("bn linear ，使用n次Bézier计算一次Bézier曲线", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        var v0 = bezierCurve.linear(t, ps[0], ps[1]);
        var v1 = bezierCurve.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);
    });
    QUnit.test("bn quadratic ，使用n次Bézier计算二次Bézier曲线", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        var v0 = bezierCurve.quadratic(t, ps[0], ps[1], ps[2]);
        var v1 = bezierCurve.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);
    });
    QUnit.test("bn cubic ，使用n次Bézier计算三次Bézier曲线", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        var v0 = bezierCurve.cubic(t, ps[0], ps[1], ps[2], ps[3]);
        var v1 = bezierCurve.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);
        var v2 = bezierCurve.getValue(t, ps);
        assert.ok(Math.abs(v0 - v2) < deviation);
    });
    QUnit.test("bnD linearDerivative ，使用n次Bézier导数计算一次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.linearDerivative(t, ps[0], ps[1]);
        var d1 = bezierCurve.bnDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnD quadraticDerivative ，使用n次Bézier导数计算二次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.quadraticDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezierCurve.bnDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnD cubicDerivative ，使用n次Bézier导数计算三次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.cubicDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezierCurve.bnDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnSD linearSecondDerivative ，使用n次Bézier二阶导数计算一次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.linearSecondDerivative(t, ps[0], ps[1]);
        var d1 = bezierCurve.bnSecondDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnSD quadraticSecondDerivative ，使用n次Bézier二阶导数计算二次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.quadraticSecondDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezierCurve.bnSecondDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnSD cubicSecondDerivative ，使用n次Bézier二阶导数计算三次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.cubicSecondDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezierCurve.bnSecondDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND linearDerivative ，使用n次BézierN阶导数计算一次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.linearDerivative(t, ps[0], ps[1]);
        var d1 = bezierCurve.bnND(t, 1, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND quadraticDerivative ，使用n次BézierN阶导数计算二次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.quadraticDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezierCurve.bnND(t, 1, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND cubicDerivative ，使用n次BézierN阶导数计算三次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.cubicDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezierCurve.bnND(t, 1, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND linearSecondDerivative ，使用n次BézierN阶导数计算一次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.linearSecondDerivative(t, ps[0], ps[1]);
        var d1 = bezierCurve.bnND(t, 2, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND quadraticSecondDerivative ，使用n次BézierN阶导数计算二次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.quadraticSecondDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezierCurve.bnND(t, 2, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND cubicSecondDerivative ，使用n次BézierN阶导数计算三次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.cubicSecondDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezierCurve.bnND(t, 2, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("getTAtExtremums ，查找区间内极值所在插值度列表 ", function (assert) {
        for (var j = 0; j < 10; j++) {
            var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
            // 测试高次Bézier曲线
            var n = Math.floor(Math.random() * 5);
            for (var i = 0; i < n; i++) {
                ps.push(Math.random());
            }
            // 查找区间内极值所在插值度列表
            var extremumXs = bezierCurve.getTAtExtremums(ps, 20, deviation);
            for (var i = 0, n_1 = extremumXs.length; i < n_1; i++) {
                // 极值
                var extremum = bezierCurve.getValue(extremumXs[i], ps);
                // 极值前面的数据
                var prex = extremumXs[i] - 0.001;
                if (0 < i)
                    prex = bezierCurve.linear(0.999, extremumXs[i - 1], extremumXs[i]);
                var prev = bezierCurve.getValue(prex, ps);
                // 极值后面面的数据
                var nextx = extremumXs[i] + 0.001;
                if (i < n_1 - 1)
                    nextx = bezierCurve.linear(0.001, extremumXs[i], extremumXs[i + 1]);
                var nextv = bezierCurve.getValue(nextx, ps);
                // 斜率
                var derivative = bezierCurve.getDerivative(extremumXs[i], ps);
                assert.ok(Math.abs(derivative) < deviation, ps.length - 1 + "\u6B21B\u00E9zier\u66F2\u7EBF \u7B2C" + i + "\u4E2A\u89E3 \u6781\u503C\u4F4D\u7F6E\uFF1A" + extremumXs[i] + " \u659C\u7387\uFF1A " + derivative + " \n \u524D\u9762\u503C\uFF1A " + prev + " \n \u6781\u503C\uFF1A " + extremum + " \n \u540E\u9762\u7684\u503C " + nextv);
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
            var ts = bezierCurve.getTFromValue(targetV, ps, 10, deviation);
            if (ts.length > 0) {
                for (var i = 0; i < ts.length; i++) {
                    var tv = bezierCurve.getValue(ts[i], ps);
                    assert.ok(Math.abs(tv - targetV) < deviation, ps.length - 1 + "\u6B21B\u00E9zier\u66F2\u7EBF \u7B2C" + i + "\u4E2A\u89E3 \u76EE\u6807\u503C\uFF1A" + targetV + " \u67E5\u627E\u5230\u7684\u503C\uFF1A" + tv + " \u67E5\u627E\u5230\u7684\u4F4D\u7F6E\uFF1A" + ts[i]);
                }
            }
        }
        assert.ok(true);
    });
});
//# sourceMappingURL=tests.js.map