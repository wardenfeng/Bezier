/**
 * 细分精度
 */
var SUBDIVISION_PRECISION = 0.0000001;
/**
 * 细分最大迭代次数
 */
var SUBDIVISION_MAX_ITERATIONS = 10;

var bezierCurve: BezierCurve;

/**
 * 贝塞尔曲线
 * @see https://en.wikipedia.org/wiki/B%C3%A9zier_curve
 */
class BezierCurve
{
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
    linear(t: number, p0: number, p1: number)
    {
        return p0 + t * (p1 - p0);
        // return (1 - t) * p0 + t * p1;
    }

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
     * @param p0 点1
     * @param p1 点2
     * @param p2 点3
     */
    quadratic(t: number, p0: number, p1: number, p2: number)
    {
        // return (1 - t) * ((1 - t) * p0 + t * p1) + t * ((1 - t) * p1 + t * p2);
        return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    }

    /**
     * 二次Bézier曲线关于t的导数
     * @param t 插值度
     * @param p0 点1
     * @param p1 点2
     * @param p2 点3
     */
    quadraticDerivative(t: number, p0: number, p1: number, p2: number)
    {
        return 2 * (1 - t) * (p1 - p0) + 2 * t * (p2 - p1);
    }

    /**
     * 二次Bézier曲线关于t的二阶导数
     * @param t 插值度
     * @param p0 点1
     * @param p1 点2
     * @param p2 点3
     */
    quadraticSecondDerivative(t: number, p0: number, p1: number, p2: number)
    {
        return 2 * (p2 - 2 * p1 + p0);
    }




    getValue(t: number, numbers: number[])
    {
        // if (this.map[t] != undefined)
        //     return this.map[t];
        // var v = this.curve(t, this.numbers);
        var v = this.curve2(t, numbers);
        // this.map[t] = v;
        return v;
    }

    curve(t: number, numbers: number[]): number
    {
        numbers = numbers.concat();
        for (let i = numbers.length - 1; i > 1; i--)
        {
            for (let j = 0; j < j; j++)
            {
                numbers[j] = (1 - t) * numbers[j] + t * numbers[j + 1];
            }
        }
        return numbers[0];
    }

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

    curve2(t: number, ps: number[]): number
    {
        var t1 = 1 - t;
        return t1 * t1 * t1 * ps[0] + 3 * t1 * t1 * t * ps[1] + 3 * t1 * t * t * ps[2] + t * t * t * ps[3];
    }

    findTatValue(targetX: number, numbers: number[])
    {
        var t0 = 0;
        var t1 = 1;
        var x0 = numbers[0];
        var x1 = numbers[numbers.length - 1];

        var mt = mt = t0 + (t1 - t0) * (targetX - x0) / (x1 - x0);
        var mv = this.getValue(mt, numbers);
        // console.assert((x0 - targetX) * (x1 - targetX) < 0, `targetX 必须在 起点终点之间！`);

        var i = 0;
        while (Math.abs(mv - targetX) > SUBDIVISION_PRECISION && i++ < SUBDIVISION_MAX_ITERATIONS)
        {
            // 进行线性插值预估目标位置
            mt = t0 + (t1 - t0) * (targetX - x0) / (x1 - x0);
            mv = this.getValue(mt, numbers);
            if ((x0 - targetX) * (mv - targetX) < 0)
            {
                t1 = mt;
                x1 = mv;
            } else
            {
                t0 = mt;
                x0 = mv;
            }
        }
        return mt;
    }

    getCurveSamples1(ps: number[], num = 100)
    {
        var results: number[] = [];
        for (let i = 0; i <= num; i++)
        {
            var p = this.curve2(i / num, ps)
            results.push(p);
        }
        return results;
    }
}

bezierCurve = new BezierCurve();