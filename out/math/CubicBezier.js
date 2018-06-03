/**
 * 立方Bézier曲线
 *
 * 为了提升性能以及简化单独从BezierCurve提取出来。
 *
 * @author feng / http://feng3d.com 03/06/2018
 */
var CubicBezierCurve = /** @class */ (function () {
    /**
     * 创建立方Bézier曲线
     * @param p0 起始点
     * @param p1 控制点1
     * @param p2 控制点2
     * @param p3 终止点
     */
    function CubicBezierCurve(p0, p1, p2, p3) {
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
    CubicBezierCurve.prototype.getValue = function (t) {
        return (1 - t) * (1 - t) * (1 - t) * this.p0 + 3 * (1 - t) * (1 - t) * t * this.p1 + 3 * (1 - t) * t * t * this.p2 + t * t * t * this.p3;
    };
    /**
     * 三次Bézier曲线关于t的导数
     * @param t 插值度
     */
    CubicBezierCurve.prototype.getDerivative = function (t) {
        return 3 * (1 - t) * (1 - t) * (this.p1 - this.p0) + 6 * (1 - t) * t * (this.p2 - this.p1) + 3 * t * t * (this.p3 - this.p2);
    };
    /**
     * 三次Bézier曲线关于t的二阶导数
     * @param t 插值度
     */
    CubicBezierCurve.prototype.getSecondDerivative = function (t) {
        return 6 * (1 - t) * (this.p2 - 2 * this.p1 + this.p0) + 6 * t * (this.p3 - 2 * this.p2 + this.p1);
    };
    /**
     * 查找区间内极值所在插值度列表
     *
     * @param numSamples 采样次数，用于分段查找极值
     * @param precision  查找精度
     *
     * @returns 极值所在插值度列表
     */
    CubicBezierCurve.prototype.getTAtExtremums = function (numSamples, precision) {
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        // 预先计算分段斜率值
        var sampleDerivatives = [];
        for (var i = 0; i <= numSamples; i++) {
            sampleDerivatives[i] = this.getDerivative(i / numSamples);
        }
        // 查找存在解的分段
        var resultRanges = [];
        for (var i = 0, n = numSamples; i < n; i++) {
            if (sampleDerivatives[i] * sampleDerivatives[i + 1] < 0) {
                resultRanges.push(i / numSamples);
            }
        }
        //
        var results = [];
        for (var i = 0, n = resultRanges.length; i < n; i++) {
            var guessT = resultRanges[i];
            var derivative = this.getDerivative(guessT);
            while (Math.abs(derivative) > precision) {
                // 使用斜率进行预估目标位置
                var slope = this.getSecondDerivative(guessT);
                if (slope == 0)
                    break;
                guessT += -derivative / slope;
                derivative = this.getDerivative(guessT);
            }
            results.push(guessT);
        }
        return results;
    };
    /**
     * 获取单调区间列表
     * @returns {} {ts: 区间节点插值度列表,vs: 区间节点值列表}
     */
    CubicBezierCurve.prototype.getMonotoneIntervals = function (numSamples, precision) {
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        // 区间内的单调区间
        var monotoneIntervalTs = [0, 1];
        var monotoneIntervalVs = [this.p0, this.p3];
        // 预先计算好极值
        var extremumTs = this.getTAtExtremums(numSamples, precision);
        var extremumVs = [];
        for (var i = 0; i < extremumTs.length; i++) {
            extremumVs[i] = this.getValue(extremumTs[i]);
            // 增加单调区间
            monotoneIntervalTs.splice(i + 1, 0, extremumTs[i]);
            monotoneIntervalVs.splice(i + 2, 0, extremumVs[i]);
        }
        return { ts: monotoneIntervalTs, vs: monotoneIntervalVs };
    };
    /**
     * 获取目标值所在的插值度T
     *
     * @param targetV 目标值
     * @param precision  查找精度
     *
     * @returns 返回解数组
     */
    CubicBezierCurve.prototype.getTFromValue = function (targetV, precision) {
        if (precision === void 0) { precision = 0.0000001; }
        var monotoneIntervalTs = this.monotoneIntervalTs;
        var monotoneIntervalVs = this.monotoneIntervalVs;
        // 目标估计值列表
        var guessTs = [];
        // 遍历单调区间
        for (var i = 0, n = monotoneIntervalVs.length - 1; i < n; i++) {
            if ((monotoneIntervalVs[i] - targetV) * (monotoneIntervalVs[i + 1] - targetV) < 0) {
                guessTs.push((monotoneIntervalTs[i] + monotoneIntervalTs[i + 1]) / 2);
            }
        }
        var results = [];
        for (var i = 0, n = guessTs.length; i < n; i++) {
            var result = this.getTFromValueAtRange(targetV, guessTs[i], precision);
            results.push(result);
        }
        return results;
    };
    /**
     * 从存在解的区域进行查找目标值的插值度
     *
     * 该函数只能从单调区间内查找值，并且 targetV 处于该区间内
     *
     * @param targetV 目标值
     * @param guessT 预估目标T值，单调区间内的一个预估值
     * @param precision  查找精度
     *
     * @returns 目标值所在插值度
     */
    CubicBezierCurve.prototype.getTFromValueAtRange = function (targetV, guessT, precision) {
        if (guessT === void 0) { guessT = 0; }
        if (precision === void 0) { precision = 0.0000001; }
        var middleV = this.getValue(guessT);
        while (Math.abs(middleV - targetV) > precision) {
            // 使用斜率进行预估目标位置
            var slope = this.getDerivative(guessT);
            if (slope == 0)
                break;
            guessT += (targetV - middleV) / slope;
            middleV = this.getValue(guessT);
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
    CubicBezierCurve.prototype.getSamples = function (num) {
        if (num === void 0) { num = 100; }
        var results = [];
        for (var i = 0; i <= num; i++) {
            var p = this.getValue(i / num);
            results.push(p);
        }
        return results;
    };
    return CubicBezierCurve;
}());
//# sourceMappingURL=CubicBezier.js.map