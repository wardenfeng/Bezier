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
        var guessV = this.getDerivative(guessT);
        while (Math.abs(guessV) > precision) {
            if (guessV * dir > 0) {
                endT = guessT;
                endV = guessV;
            }
            else {
                startT = guessT;
                startV = guessV;
            }
            guessT = startT + (0 - startV) / (endV - startV) * (endT - startT);
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
        var guessT = startT + (targetV - startV) / (endV - startV) * (endT - startT);
        var guessV = this.getValue(guessT);
        while (Math.abs(guessV - targetV) > precision) {
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
//# sourceMappingURL=CubicBezier.js.map