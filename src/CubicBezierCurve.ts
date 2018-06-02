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
     * 采样次数，用于查找与加速运算
     */
    private numSamples = 10;
    /**
     * 采样步长
     */
    private sampleSetp = 0.1;
    /**
     * 最大迭代次数
     */
    private maxIterations = 4;

    constructor(p0: number, p1: number, p2: number, p3: number)
    {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;

        // 预先计算好极值
        this.getTAtExtremums()
        // 预先计算好分段

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
     * @returns 插值度列表
     */
    getTAtExtremums()
    {
        var samples: number[] = [];
        for (let i = 0; i <= this.numSamples; i++)
        {
            samples.push(this.getDerivative(i * this.sampleSetp));
        }
        // 查找存在解的分段
        var resultRanges: number[] = [];
        for (let i = 0, n = this.numSamples; i < n; i++)
        {
            if (samples[i] * samples[i + 1] < 0)
            {
                resultRanges.push(i * this.sampleSetp);
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
     * @param numSamples 分段数量，用于分段查找，用于解决寻找多个解、是否无解等问题；过少的分段可能会造成找不到存在的解决，过多的分段将会造成性能很差。
     * @returns 返回解数组
     */
    getTFromValue(targetV: number, numSamples = 10)
    {
        var samples = this.getSamples(numSamples);
        // 查找存在解的分段
        var resultRanges: number[] = [];
        for (let i = 0, n = numSamples; i < n; i++)
        {
            if ((samples[i] - targetV) * (samples[i + 1] - targetV) < 0)
            {
                resultRanges.push(i / numSamples);
            }
        }

        var results: number[] = [];
        for (let i = 0, n = resultRanges.length; i < n; i++)
        {
            var result = this.getTFromValueAtRange(targetV, resultRanges[i]);
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