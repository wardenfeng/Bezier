/**
 * Bézier曲线
 */
var bezier;
/**
 * Bézier曲线
 * @see https://en.wikipedia.org/wiki/B%C3%A9zier_curve
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
        var _this = this;
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        var samples = [];
        for (var i = 0; i <= numSamples; i++) {
            samples.push(this.getDerivative(i / numSamples, ps));
        }
        // 查找存在解的分段
        //
        var resultTs = [];
        var resultVs = [];
        for (var i = 0, n = numSamples; i < n; i++) {
            if (samples[i] * samples[i + 1] < 0) {
                var guessT = equationSolving.line(function (x) { return _this.getDerivative(x, ps); }, i / numSamples, (i + 1) / numSamples, precision);
                resultTs.push(guessT);
                resultVs.push(this.getValue(guessT, ps));
            }
        }
        return { ts: resultTs, vs: resultVs };
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
        var results = [];
        // 遍历单调区间
        for (var i = 0, n = monotoneIntervalVs.length - 1; i < n; i++) {
            if ((monotoneIntervalVs[i] - targetV) * (monotoneIntervalVs[i + 1] - targetV) <= 0) {
                var fx = function (x) { return _this.getValue(x, ps) - targetV; };
                // 连线法
                var result = equationSolving.line(fx, monotoneIntervalTs[i], monotoneIntervalTs[i + 1], precision);
                results.push(result);
            }
        }
        return results;
    };
    /**
     * 分割曲线
     *
     * 在曲线插值度t位置分割为两条连接起来与原曲线完全重合的曲线
     *
     * @param t 分割位置（插值度）
     * @param ps 被分割曲线点列表
     * @returns 返回两条曲线组成的数组
     */
    Bezier.prototype.split = function (t, ps) {
        // 获取曲线的动画过程
        var processs = [];
        bezier.bn(t, ps, processs);
        // 第一条曲线
        var fps = [];
        // 第二条曲线
        var sps = [];
        // 使用当前t值进行分割曲线
        for (var i = processs.length - 1; i >= 0; i--) {
            if (i == processs.length - 1) {
                // 添加关键点
                fps.push(processs[i][0]);
                fps.push(processs[i][0]);
            }
            else {
                // 添加左右控制点
                fps.unshift(processs[i][0]);
                sps.push(processs[i].pop());
            }
        }
        return [fps, sps];
    };
    /**
     * 合并曲线
     *
     * 合并两条连接的曲线为一条曲线并且可以还原为分割前的曲线
     *
     * @param fps 第一条曲线点列表
     * @param sps 第二条曲线点列表
     * @param mergeType 合并方式。mergeType = 0时进行还原合并，还原拆分之前的曲线；mergeType = 1时进行拟合合并，合并后的曲线会经过两条曲线的连接点；
     */
    Bezier.prototype.merge = function (fps, sps, mergeType) {
        if (mergeType === void 0) { mergeType = 0; }
        fps = fps.concat();
        sps = sps.concat();
        var processs = [];
        var t;
        // 上条曲线
        var pps;
        // 当前曲线
        var ps;
        for (var i = 0, n = fps.length; i < n; i++) {
            ps = processs[i] = [];
            if (i == 0) {
                processs[i][0] = fps.pop();
                sps.shift();
            }
            else if (i == 1) {
                // 计算t值
                processs[i][0] = fps.pop();
                processs[i][1] = sps.shift();
                t = (processs[i - 1][0] - processs[i][0]) / (processs[i][1] - processs[i][0]);
            }
            else {
                pps = processs[i - 1];
                // 前面增加点
                var nfp = fps.pop();
                // 后面增加点
                var nsp = sps.shift();
                // 从前往后计算
                var ps0 = [];
                ps0[0] = nfp;
                for (var j = 0, n_1 = pps.length; j < n_1; j++) {
                    ps0[j + 1] = ps0[j] + (pps[j] - ps0[j]) / t;
                }
                // 从后往前计算
                var ps1 = [];
                ps1[pps.length] = nsp;
                for (var j = pps.length - 1; j >= 0; j--) {
                    ps1[j] = ps1[j + 1] - (ps1[j + 1] - pps[j]) / (1 - t);
                }
                // 拟合合并,合并前后两个方向的计算
                if (mergeType == 1) {
                    for (var j = 0, n_2 = ps0.length - 1; j <= n_2; j++) {
                        ps[j] = (ps0[j] * (n_2 - j) + ps1[j] * j) / n_2;
                    }
                }
                else if (mergeType == 0) {
                    // 还原合并，前半段使用从前往后计算，后半段使用从后往前计算
                    for (var j = 0, n_3 = ps0.length - 1; j <= n_3; j++) {
                        if (j < n_3 / 2) {
                            ps[j] = ps0[j];
                        }
                        else if (j > n_3 / 2) {
                            ps[j] = ps1[j];
                        }
                        else {
                            ps[j] = (ps0[j] + ps1[j]) / 2;
                        }
                    }
                }
                else {
                    throw "\u5408\u5E76\u7C7B\u578B mergeType " + mergeType + " \u9519\u8BEF!";
                }
            }
        }
        return processs.pop();
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
 * 方程求解
 */
var equationSolving;
/**
 * 方程求解
 *
 * 求解方程 f(x) == 0 在[a, b]上的解
 *
 * 参考：高等数学 第七版上册 第三章第八节 方程的近似解
 * 当f(x)在区间 [a, b] 上连续，且f(a) * f(b) <= 0 时，f(x)在区间 [a, b] 上至少存在一个解使得 f(x) == 0
 *
 * 当f(x)在区间 [a, b] 上连续，且 (f(a) - y) * (f(b) - y) < 0 时，f(x)在区间 [a, b] 上至少存在一个解使得 f(x) == y
 *
 * @author feng / http://feng3d.com 05/06/2018
 */
var EquationSolving = /** @class */ (function () {
    function EquationSolving() {
    }
    /**
     * 获取数字的(正负)符号
     * @param n 数字
     */
    EquationSolving.prototype.getSign = function (n) {
        return n > 0 ? "+" : "-";
    };
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
     * 获取近似导函数 f'(x)
     *
     * 导函数定义
     * f'(x) = (f(x + Δx) - f(x)) / Δx , Δx → 0
     *
     * 注：通过测试Δx不能太小，由于方程内存在x的n次方问题（比如0.000000000000001的10次方为0），过小会导致计算机计算进度不够反而导致求导不准确！
     *
     * 另外一种办法是还原一元多次函数，然后求出导函数。
     *
     * @param f 函数
     * @param delta Δx，进过测试该值太小或者过大都会导致求导准确率降低（个人猜测是计算机计算精度问题导致）
     */
    EquationSolving.prototype.getDerivative = function (f, delta) {
        if (delta === void 0) { delta = 0.000000001; }
        return function (x) {
            var d = (f(x + delta) - f(x)) / delta;
            return d;
        };
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
     * 二分法 求解 f(x) == 0
     *
     * 通过区间中点作为边界来逐步缩小求解区间，最终获得解
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
            var x = (a + b) / 2;
            var fr = f(x);
            if (fa * fr < 0) {
                b = x;
                fb = fr;
            }
            else {
                a = x;
                fa = fr;
            }
        } while (!this.equalNumber(fr, 0, precision));
        return x;
    };
    /**
     * 连线法 求解 f(x) == 0
     *
     * 连线法是我自己想的方法，自己取的名字，目前没有找到相应的资料（这方法大家都能够想得到。）
     *
     * 用曲线弧两端的连线来代替曲线弧与X轴交点作为边界来逐步缩小求解区间，最终获得解
     *
     * 通过 A，B两点连线与x轴交点来缩小求解区间最终获得解
     *
     * A，B两点直线方程 f(x) = f(a) + (f(b) - f(a)) / (b - a) * (x-a) ,求 f(x) == 0 解得 x = a - fa * (b - a)/ (fb - fa)
     *
     * @param f 函数f(x)
     * @param a 区间起点
     * @param b 区间终点
     * @param precision 求解精度
     * @param errorcallback  错误回调函数
     *
     * @returns 不存在解时返回 undefined ，存在时返回 解
     */
    EquationSolving.prototype.line = function (f, a, b, precision, errorcallback) {
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
            // 
            var x = a - fa * (b - a) / (fb - fa);
            var fr = f(x);
            if (fa * fr < 0) {
                b = x;
                fb = fr;
            }
            else {
                a = x;
                fa = fr;
            }
        } while (!this.equalNumber(fr, 0, precision));
        return x;
    };
    /**
     * 切线法 求解 f(x) == 0
     *
     * 用曲线弧一端的切线来代替曲线弧，从而求出方程实根的近似解。
     *
     * 迭代公式： Xn+1 = Xn - f(Xn) / f'(Xn)
     *
     * #### 额外需求
     * 1. f(x)在[a, b]上具有一阶导数 f'(x)
     * 1. f'(x)在[a, b]上保持定号；意味着f(x)在[a, b]上单调
     * 1. f''(x)在[a, b]上保持定号；意味着f'(x)在[a, b]上单调
     *
     * 切记，当无法满足这些额外要求时，该函数将找不到[a, b]上的解！！！！！！！！！！！
     *
     * @param f 函数f(x)
     * @param f1 一阶导函数 f'(x)
     * @param f2 二阶导函数 f''(x)
     * @param a 区间起点
     * @param b 区间终点
     * @param precision 求解精度
     * @param errorcallback  错误回调函数
     *
     * @returns 不存在解与无法使用该函数求解时返回 undefined ，否则返回 解
     */
    EquationSolving.prototype.tangent = function (f, f1, f2, a, b, precision, errorcallback) {
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
        var f1Sign = fb - fa; // f'(x)在[a, b]上保持的定号
        var f1a = f1(a);
        var f1b = f1(b);
        // f'(x)在[a, b]上保持定号
        if (f1a * f1Sign <= 0) {
            errorcallback && errorcallback(new Error("[" + a + ", " + b + "] \u4E0A\u5B58\u5728\u89E3\uFF0C\u7531\u4E8Ef'(" + a + ") = " + f1a + " \u5728[a, b]\u4E0A\u6CA1\u6709\u4FDD\u6301\u5B9A\u53F7 " + this.getSign(f1Sign) + " \uFF0C\u65E0\u6CD5\u4F7F\u7528\u5207\u7EBF\u6CD5\u6C42\u89E3"));
            return undefined;
        }
        if (f1b * f1Sign <= 0) {
            errorcallback && errorcallback(new Error("[" + a + ", " + b + "] \u4E0A\u5B58\u5728\u89E3\uFF0C\u7531\u4E8Ef'(" + b + ") = " + f1b + " \u5728[a, b]\u4E0A\u6CA1\u6709\u4FDD\u6301\u5B9A\u53F7 " + this.getSign(f1Sign) + " \uFF0C\u65E0\u6CD5\u4F7F\u7528\u5207\u7EBF\u6CD5\u6C42\u89E3"));
            return undefined;
        }
        var f2Sign = fb - fa; // f''(x)在[a, b]上保持的定号
        var f2a = f2(a);
        var f2b = f2(b);
        // f''(x)在[a, b]上保持定号
        if (f2a * f2Sign <= 0) {
            errorcallback && errorcallback(new Error("[" + a + ", " + b + "] \u4E0A\u5B58\u5728\u89E3\uFF0C\u7531\u4E8Ef''(" + a + ") = " + f2a + " \u5728[a, b]\u4E0A\u6CA1\u6709\u4FDD\u6301\u5B9A\u53F7 " + this.getSign(f2Sign) + " \uFF0C\u65E0\u6CD5\u4F7F\u7528\u5207\u7EBF\u6CD5\u6C42\u89E3"));
            return undefined;
        }
        if (f2b * f2Sign <= 0) {
            errorcallback && errorcallback(new Error("[" + a + ", " + b + "] \u4E0A\u5B58\u5728\u89E3\uFF0C\u7531\u4E8Ef''(" + b + ") = " + f2b + " \u5728[a, b]\u4E0A\u6CA1\u6709\u4FDD\u6301\u5B9A\u53F7 " + this.getSign(f2Sign) + " \uFF0C\u65E0\u6CD5\u4F7F\u7528\u5207\u7EBF\u6CD5\u6C42\u89E3"));
            return undefined;
        }
        var x;
        if (f1Sign > 0) {
            if (f2Sign > 0)
                x = b;
            else
                x = a;
        }
        else {
            if (f2Sign > 0)
                x = a;
            else
                x = b;
        }
        do {
            var fx = f(x);
            var f1x = f1(x);
            var f2x = f2(x);
            // f'(x)在[a, b]上保持定号
            if (f1x * f1Sign <= 0) {
                errorcallback && errorcallback(new Error("[" + a + ", " + b + "] \u4E0A\u5B58\u5728\u89E3\uFF0C\u7531\u4E8Ef'(" + x + ") = " + f1x + " \u5728[a, b]\u4E0A\u6CA1\u6709\u4FDD\u6301\u5B9A\u53F7 " + this.getSign(f1Sign) + " \uFF0C\u65E0\u6CD5\u4F7F\u7528\u5207\u7EBF\u6CD5\u6C42\u89E3"));
                return undefined;
            }
            // f''(x)在[a, b]上保持定号
            if (f2x * f2Sign <= 0) {
                errorcallback && errorcallback(new Error("[" + a + ", " + b + "] \u4E0A\u5B58\u5728\u89E3\uFF0C\u7531\u4E8Ef''(" + x + ") = " + f2x + " \u5728[a, b]\u4E0A\u6CA1\u6709\u4FDD\u6301\u5B9A\u53F7 " + this.getSign(f2Sign) + " \uFF0C\u65E0\u6CD5\u4F7F\u7528\u5207\u7EBF\u6CD5\u6C42\u89E3"));
                return undefined;
            }
            // 迭代 Xn+1 = Xn - f(Xn) / f'(Xn)
            x = x - fx / f1x;
        } while (!this.equalNumber(fx, 0, precision));
        return x;
    };
    /**
     * 割线法（弦截法） 求解 f(x) == 0
     *
     * 使用 (f(Xn) - f(Xn-1)) / (Xn - Xn-1) 代替切线法迭代公式 Xn+1 = Xn - f(Xn) / f'(Xn) 中的 f'(x)
     *
     * 迭代公式：Xn+1 = Xn - f(Xn) * (Xn - Xn-1) / (f(Xn) - f(Xn-1));
     *
     * 用过点(Xn-1,f(Xn-1))和点(Xn,f(Xn))的割线来近似代替(Xn,f(Xn))处的切线，将这条割线与X轴交点的横坐标作为新的近似解。
     *
     * #### 额外需求
     * 1. f(x)在[a, b]上具有一阶导数 f'(x)
     * 1. f'(x)在[a, b]上保持定号；意味着f(x)在[a, b]上单调
     * 1. f''(x)在[a, b]上保持定号；意味着f'(x)在[a, b]上单调
     *
     * 切记，当无法满足这些额外要求时，该函数将找不到[a, b]上的解！！！！！！！！！！！
     *
     * @param f 函数f(x)
     * @param a 区间起点
     * @param b 区间终点
     * @param precision 求解精度
     * @param errorcallback  错误回调函数
     *
     * @returns 不存在解与无法使用该函数求解时返回 undefined ，否则返回 解
     */
    EquationSolving.prototype.secant = function (f, a, b, precision, errorcallback) {
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
        // 此处创建近似导函数以及二次导函数，其实割线法使用在计算f'(x)困难时的，但是 getDerivative 方法解决了这个困难。。。。
        var f1 = this.getDerivative(f, precision);
        var f2 = this.getDerivative(f1, precision);
        var f1Sign = fb - fa; // f'(x)在[a, b]上保持的定号
        // 
        var f1a = f1(a);
        var f1b = f1(b);
        // f'(x)在[a, b]上保持定号
        if (f1a * f1Sign <= 0) {
            errorcallback && errorcallback(new Error("[" + a + ", " + b + "] \u4E0A\u5B58\u5728\u89E3\uFF0C\u7531\u4E8Ef'(" + a + ") = " + f1a + " \u5728[a, b]\u4E0A\u6CA1\u6709\u4FDD\u6301\u5B9A\u53F7 " + this.getSign(f1Sign) + " \uFF0C\u65E0\u6CD5\u4F7F\u7528\u5207\u7EBF\u6CD5\u6C42\u89E3"));
            return undefined;
        }
        if (f1b * f1Sign <= 0) {
            errorcallback && errorcallback(new Error("[" + a + ", " + b + "] \u4E0A\u5B58\u5728\u89E3\uFF0C\u7531\u4E8Ef'(" + b + ") = " + f1b + " \u5728[a, b]\u4E0A\u6CA1\u6709\u4FDD\u6301\u5B9A\u53F7 " + this.getSign(f1Sign) + " \uFF0C\u65E0\u6CD5\u4F7F\u7528\u5207\u7EBF\u6CD5\u6C42\u89E3"));
            return undefined;
        }
        var f2Sign = fb - fa; // f''(x)在[a, b]上保持的定号
        var f2a = f2(a);
        var f2b = f2(b);
        // f''(x)在[a, b]上保持定号
        if (f2a * f2Sign <= 0) {
            errorcallback && errorcallback(new Error("[" + a + ", " + b + "] \u4E0A\u5B58\u5728\u89E3\uFF0C\u7531\u4E8Ef''(" + a + ") = " + f2a + " \u5728[a, b]\u4E0A\u6CA1\u6709\u4FDD\u6301\u5B9A\u53F7 " + this.getSign(f2Sign) + " \uFF0C\u65E0\u6CD5\u4F7F\u7528\u5207\u7EBF\u6CD5\u6C42\u89E3"));
            return undefined;
        }
        if (f2b * f2Sign <= 0) {
            errorcallback && errorcallback(new Error("[" + a + ", " + b + "] \u4E0A\u5B58\u5728\u89E3\uFF0C\u7531\u4E8Ef''(" + b + ") = " + f2b + " \u5728[a, b]\u4E0A\u6CA1\u6709\u4FDD\u6301\u5B9A\u53F7 " + this.getSign(f2Sign) + " \uFF0C\u65E0\u6CD5\u4F7F\u7528\u5207\u7EBF\u6CD5\u6C42\u89E3"));
            return undefined;
        }
        var x;
        if (f1Sign > 0) {
            if (f2Sign > 0)
                x = b;
            else
                x = a;
        }
        else {
            if (f2Sign > 0)
                x = a;
            else
                x = b;
        }
        // Xn-1
        var xn_1 = x;
        var fxn_1 = f(xn_1);
        // Xn
        var xn = xn_1 - precision * f2Sign / Math.abs(f2Sign);
        var fxn = f(xn);
        // 
        if (fxn * fxn_1 < 0) {
            return xn;
        }
        // Xn+1
        var xn$1;
        do {
            var f1xn = f1(xn);
            // f'(x)在[a, b]上保持定号
            if (f1xn * f1Sign <= 0) {
                errorcallback && errorcallback(new Error("[" + a + ", " + b + "] \u4E0A\u5B58\u5728\u89E3\uFF0C\u7531\u4E8Ef'(" + xn + ") = " + f1xn + " \u5728[a, b]\u4E0A\u6CA1\u6709\u4FDD\u6301\u5B9A\u53F7 " + this.getSign(f1Sign) + " \uFF0C\u65E0\u6CD5\u4F7F\u7528\u5207\u7EBF\u6CD5\u6C42\u89E3"));
                return undefined;
            }
            var f2xn = f2(xn);
            // f''(x)在[a, b]上保持定号
            if (f2xn * f2Sign <= 0) {
                errorcallback && errorcallback(new Error("[" + a + ", " + b + "] \u4E0A\u5B58\u5728\u89E3\uFF0C\u7531\u4E8Ef''(" + xn + ") = " + f2xn + " \u5728[a, b]\u4E0A\u6CA1\u6709\u4FDD\u6301\u5B9A\u53F7 " + this.getSign(f2Sign) + " \uFF0C\u65E0\u6CD5\u4F7F\u7528\u5207\u7EBF\u6CD5\u6C42\u89E3"));
                return undefined;
            }
            // 迭代 Xn+1 = Xn - f(Xn) * (Xn - Xn-1) / (f(Xn) - f(Xn-1));
            xn$1 = xn - fxn * (xn - xn_1) / (fxn - fxn_1);
            //
            xn_1 = xn;
            fxn_1 = fxn;
            xn = xn$1;
            fxn = f(xn);
        } while (!this.equalNumber(fxn, 0, precision));
        return xn;
    };
    return EquationSolving;
}());
equationSolving = new EquationSolving();
/**
 * 高次函数
 *
 * 处理N次函数定义，求值，方程求解问题
 *
 * n次函数定义
 * f(x) = a0 * pow(x, n) + a1 * pow(x, n - 1) +.....+ an_1 * pow(x, 1) + an
 *
 * 0次 f(x) = a0;
 * 1次 f(x) = a0 * x + a1;
 * 2次 f(x) = a0 * x * x + a1 * x + a2;
 * ......
 *
 * @author feng / http://feng3d.com 05/06/2018
 */
var HighFunction = /** @class */ (function () {
    /**
     * 构建函数
     * @param as 函数系数 a0-an 数组
     */
    function HighFunction(as) {
        this.as = as;
    }
    /**
     * 获取函数 f(x) 的值
     * @param x x坐标
     */
    HighFunction.prototype.getValue = function (x) {
        var v = 0;
        var as = this.as;
        for (var i = 0, n = as.length; i < n; i++) {
            v = v * x + as[i];
        }
        return v;
    };
    return HighFunction;
}());
//# sourceMappingURL=bezier.js.map