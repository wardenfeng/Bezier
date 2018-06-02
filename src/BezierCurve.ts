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
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     */
    linear(t: number, p0: number, p1: number)
    {
        return p0 + t * (p1 - p0);
        // return (1 - t) * p0 + t * p1;
    }

    /**
     * 线性Bézier曲线关于t的导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     */
    linearDerivative(t: number, p0: number, p1: number)
    {
        return p1 - p0;
    }

    /**
     * 线性Bézier曲线关于t的二阶导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     */
    linearSecondDerivative(t: number, p0: number, p1: number, p2: number)
    {
        return 0;
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
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     */
    quadratic(t: number, p0: number, p1: number, p2: number)
    {
        // return this.linear(t, this.linear(t, p0, p1), this.linear(t, p1, p2));
        // return (1 - t) * ((1 - t) * p0 + t * p1) + t * ((1 - t) * p1 + t * p2);
        return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    }

    /**
     * 二次Bézier曲线关于t的导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     */
    quadraticDerivative(t: number, p0: number, p1: number, p2: number)
    {
        // return 2 * this.linear(t, this.linearDerivative(t, p0, p1), this.linearDerivative(t, p1, p2));
        return 2 * (1 - t) * (p1 - p0) + 2 * t * (p2 - p1);
    }

    /**
     * 二次Bézier曲线关于t的二阶导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     */
    quadraticSecondDerivative(t: number, p0: number, p1: number, p2: number)
    {
        // return 1 * 2 * this.linearDerivative(t, p1 - p0, p2 - p1)
        // return 1 * 2 * ((p2 - p1) - (p1 - p0));
        return 2 * (p2 - 2 * p1 + p0);
    }

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
    cubic(t: number, p0: number, p1: number, p2: number, p3: number)
    {
        // return this.linear(t, this.quadratic(t, p0, p1, p2), this.quadratic(t, p1, p2, p3));
        return (1 - t) * (1 - t) * (1 - t) * p0 + 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t * p3;
    }

    /**
     * 三次Bézier曲线关于t的导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     * @param p3 点3
     */
    cubicDerivative(t: number, p0: number, p1: number, p2: number, p3: number)
    {
        // return 3 * this.linear(t, this.quadraticDerivative(t, p0, p1, p2), this.quadraticDerivative(t, p1, p2, p3));
        return 3 * (1 - t) * (1 - t) * (p1 - p0) + 6 * (1 - t) * t * (p2 - p1) + 3 * t * t * (p3 - p2);
    }

    /**
     * 三次Bézier曲线关于t的二阶导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     */
    cubicSecondDerivative(t: number, p0: number, p1: number, p2: number, p3: number)
    {
        // return 3 * this.linear(t, this.quadraticSecondDerivative(t, p0, p1, p2), this.quadraticSecondDerivative(t, p1, p2, p3));
        return 6 * (1 - t) * (p2 - 2 * p1 + p0) + 6 * t * (p3 - 2 * p2 + p1);
    }

    /**
     * n阶Bézier曲线
     * 
     * 一般定义
     * 
     * 贝塞尔曲线可以定义为任意度n。
     * 
     * @param t 插值度
     * @param ps 点列表 ps.length == n+1
     */
    bn(t: number, ps: number[])
    {
        ps = ps.concat();
        // n阶Bézier递推
        for (let i = ps.length - 1; i > 0; i--)
        {
            for (let j = 0; j < i; j++)
            {
                ps[j] = (1 - t) * ps[j] + t * ps[j + 1];
            }
        }
        return ps[0];
    }

    /**
     * n阶Bézier曲线关于t的二阶导数
     * 
     * 一般定义
     * 
     * 贝塞尔曲线可以定义为任意度n。
     * 
     * @param t 插值度
     * @param ps 点列表 ps.length == n+1
     */
    bnD(t: number, ps: number[])
    {
        ps = ps.concat();
        //
        for (let i = 0, n = ps.length - 1; i < n; i++)
        {
            ps[i] = ps[i + 1] - ps[i];
        }
        ps.length = ps.length - 1;
        var v = ps.length * this.bn(t, ps);
        return v;
    }

    /**
     * n阶Bézier曲线关于t的导数
     * 
     * 一般定义
     * 
     * 贝塞尔曲线可以定义为任意度n。
     * 
     * @param t 插值度
     * @param ps 点列表 ps.length == n+1
     */
    bnSD(t: number, ps: number[])
    {
        ps = ps.concat();
        // n阶Bézier递推
        for (let i = ps.length - 1; i > 2; i--)
        {
            for (let j = 0; j < i; j++)
            {
                ps[j] = (1 - t) * ps[j] + t * ps[j + 1];
            }
        }
        return 2 * (1 - t) * (ps[1] - ps[0]) + 2 * t * (ps[2] - ps[1]);
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
        return this.cubic(t, ps[0], ps[1], ps[2], ps[3]);
        // var t1 = 1 - t;
        // return t1 * t1 * t1 * ps[0] + 3 * t1 * t1 * t * ps[1] + 3 * t1 * t * t * ps[2] + t * t * t * ps[3];
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