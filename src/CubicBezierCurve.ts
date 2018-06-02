/**
 * 立方Bézier曲线
 * 
 * 为了提升性能以及简化单独从BezierCurve提取出来。
 */
class CubicBezierCurve
{
    /**
     * 细分精度
     */
    private SUBDIVISION_PRECISION = 0.0000001;

    /**
     * 起始点
     */
    private p0: number;
    /**
     * 控制点1
     */
    private p1: number;
    /**
     * 控制点2
     */
    private p2: number;
    /**
     * 终止点
     */
    private p3: number;

    /**
     * 最大迭代次数
     */
    private maxIterations = 4;

    // cache
    /**
     * 极值插值度列表
     */
    private extremumTs: number[] = [];
    /**
     * 极值列表
     */
    private extremumVs: number[] = [];

    /**
     * 单调区间插值点列表
     */
    private monotoneIntervalTs: number[] = [];
    /**
     * 单调区间值列表
     */
    private monotoneIntervalVs: number[] = [];

    /**
     * 创建立方Bézier曲线
     * @param p0 起始点
     * @param p1 控制点1
     * @param p2 控制点2
     * @param p3 终止点
     */
    constructor(p0: number, p1: number, p2: number, p3: number)
    {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;

        // 区间内的单调区间
        this.monotoneIntervalTs = [0, 1];
        this.monotoneIntervalVs = [p0, p3];
        // 预先计算好极值
        var results: number[] = this.getTAtExtremums();
        this.extremumTs = results;
        this.extremumVs = [];
        for (let i = 0; i < results.length; i++)
        {
            this.extremumVs[i] = this.getValue(results[i]);
            // 增加单调区间
            this.monotoneIntervalTs.splice(i, 0, results[i]);
            this.monotoneIntervalVs.splice(i, 0, this.extremumVs[i]);
        }

    }

    /**
     * 
     * @param t 插值度
     */
    getValue(t: number)
    {
        return (1 - t) * (1 - t) * (1 - t) * this.p0 + 3 * (1 - t) * (1 - t) * t * this.p1 + 3 * (1 - t) * t * t * this.p2 + t * t * t * this.p3;
    }

    /**
     * 三次Bézier曲线关于t的导数
     * @param t 插值度
     */
    getDerivative(t: number)
    {
        return 3 * (1 - t) * (1 - t) * (this.p1 - this.p0) + 6 * (1 - t) * t * (this.p2 - this.p1) + 3 * t * t * (this.p3 - this.p2);
    }

    /**
     * 三次Bézier曲线关于t的二阶导数
     * @param t 插值度
     */
    getSecondDerivative(t: number)
    {
        return 6 * (1 - t) * (this.p2 - 2 * this.p1 + this.p0) + 6 * t * (this.p3 - 2 * this.p2 + this.p1);
    }

    /**
     * 查找区间内极值所在插值度列表
     * @param ps 点列表
     * @param numSamples 采样次数，用于分段查找极值
     * @returns 插值度列表
     */
    getTAtExtremums(numSamples = 10)
    {
        // 预先计算分段斜率值
        var sampleDerivatives = [];
        for (let i = 0; i <= numSamples; i++)
        {
            sampleDerivatives[i] = this.getDerivative(i / numSamples);
        }
        // 查找存在解的分段
        var resultRanges: number[] = [];
        for (let i = 0, n = numSamples; i < n; i++)
        {
            if (sampleDerivatives[i] * sampleDerivatives[i + 1] < 0)
            {
                resultRanges.push(i / numSamples);
            }
        }
        //
        var results: number[] = [];
        for (let i = 0, n = resultRanges.length; i < n; i++)
        {
            var guessT = resultRanges[i];
            var derivative = this.getDerivative(guessT);
            var j = 0;
            while (Math.abs(derivative) > this.SUBDIVISION_PRECISION && j++ < this.maxIterations)
            {
                // 使用斜率进行预估目标位置
                var slope = this.getSecondDerivative(guessT);
                if (slope == 0)
                    break;
                guessT += - derivative / slope;
                derivative = this.getDerivative(guessT);
            }
            results.push(guessT);
        }
        return results;
    }

    /**
     * 获取目标值所在的插值度T
     * 
     * @param targetV 目标值
     * @returns 返回解数组
     */
    getTFromValue(targetV: number)
    {
        var monotoneIntervalTs = this.monotoneIntervalTs;
        var monotoneIntervalVs = this.monotoneIntervalVs;
        // 目标估计值列表
        var guessTs: number[] = [];
        // 遍历单调区间
        for (let i = 0, n = monotoneIntervalVs.length - 1; i < n; i++)
        {
            if ((monotoneIntervalVs[i] - targetV) * (monotoneIntervalVs[i + 1] - targetV) < 0)
            {
                guessTs.push((monotoneIntervalTs[i] + monotoneIntervalTs[i + 1]) / 2);
            }
        }

        var results: number[] = [];
        for (let i = 0, n = guessTs.length; i < n; i++)
        {
            var result = this.getTFromValueAtRange(targetV, guessTs[i]);
            results.push(result);
        }
        return results;
    }

    /**
     * 从存在解的区域进行插值值
     * 
     * 该函数只能从单调区间内查找值，并且 targetV 处于该区间内
     * 
     * @param targetV 目标值
     * @param ps 点列表
     * @param guessT 预估目标T值，单调区间内的一个预估值
     * @param maxIterations 最大迭代次数
     */
    getTFromValueAtRange(targetV: number, guessT: number = 0, maxIterations = 4)
    {
        var middleV = this.getValue(guessT);

        var i = 0;
        while (Math.abs(middleV - targetV) > this.SUBDIVISION_PRECISION && i++ < maxIterations)
        {
            // 使用斜率进行预估目标位置
            var slope = this.getDerivative(guessT);
            if (slope == 0)
                break;
            guessT += (targetV - middleV) / slope;
            middleV = this.getValue(guessT);
        }
        return guessT;
    }

    /**
     * 获取曲线样本数据
     * 
     * 这些点可用于连线来拟合曲线。
     * 
     * @param num 采样次数 ，采样点分别为[0,1/num,2/num,....,(num-1)/num,1]
     */
    getSamples(num = 100)
    {
        var results: number[] = [];
        for (let i = 0; i <= num; i++)
        {
            var p = this.getValue(i / num)
            results.push(p);
        }
        return results;
    }
}