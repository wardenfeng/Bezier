/**
 * 方程求解
 */
declare var equationSolving: EquationSolving;
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
declare class EquationSolving {
    /**
     * 获取数字的(正负)符号
     * @param n 数字
     */
    private getSign(n);
    /**
     * 比较 a 与 b 是否相等
     * @param a 值a
     * @param b 值b
     * @param precision 比较精度
     */
    private equalNumber(a, b, precision?);
    /**
     * 获取近似导函数
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
    getDerivative(f: (x) => number, delta?: number): (x: any) => number;
    /**
     * 函数是否连续
     * @param f 函数
     */
    isContinuous(f: (x) => number): boolean;
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
    hasSolution(f: (x) => number, a: number, b: number, errorcallback?: (err: Error) => void): boolean;
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
    binary(f: (x) => number, a: number, b: number, precision?: number, errorcallback?: (err: Error) => void): number;
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
    line(f: (x) => number, a: number, b: number, precision?: number, errorcallback?: (err: Error) => void): number;
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
    tangent(f: (x) => number, f1: (x) => number, f2: (x) => number, a: number, b: number, precision?: number, errorcallback?: (err: Error) => void): number;
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
    secant(f: (x) => number, a: number, b: number, precision?: number, errorcallback?: (err: Error) => void): number;
}
