/**
 * 细分精度
 */
declare var SUBDIVISION_PRECISION: number;
/**
 * 细分最大迭代次数
 */
declare var SUBDIVISION_MAX_ITERATIONS: number;
declare var bezierCurve: BezierCurve;
/**
 * 贝塞尔曲线
 * @see https://en.wikipedia.org/wiki/B%C3%A9zier_curve
 */
declare class BezierCurve {
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
    linear(t: number, p0: number, p1: number): number;
    /**
     * 线性Bézier曲线关于t的导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     */
    linearDerivative(t: number, p0: number, p1: number): number;
    /**
     * 线性Bézier曲线关于t的二阶导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     */
    linearSecondDerivative(t: number, p0: number, p1: number): number;
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
    quadratic(t: number, p0: number, p1: number, p2: number): number;
    /**
     * 二次Bézier曲线关于t的导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     */
    quadraticDerivative(t: number, p0: number, p1: number, p2: number): number;
    /**
     * 二次Bézier曲线关于t的二阶导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     */
    quadraticSecondDerivative(t: number, p0: number, p1: number, p2: number): number;
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
    cubic(t: number, p0: number, p1: number, p2: number, p3: number): number;
    /**
     * 三次Bézier曲线关于t的导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     * @param p3 点3
     */
    cubicDerivative(t: number, p0: number, p1: number, p2: number, p3: number): number;
    /**
     * 三次Bézier曲线关于t的二阶导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     */
    cubicSecondDerivative(t: number, p0: number, p1: number, p2: number, p3: number): number;
    /**
     * n次Bézier曲线
     *
     * 一般定义
     *
     * 贝塞尔曲线可以定义为任意度n。
     *
     * @param t 插值度
     * @param ps 点列表 ps.length == n+1
     */
    bn(t: number, ps: number[]): number;
    /**
     * n次Bézier曲线关于t的导数
     *
     * 一般定义
     *
     * 贝塞尔曲线可以定义为任意度n。
     *
     * @param t 插值度
     * @param ps 点列表 ps.length == n+1
     */
    bnDerivative(t: number, ps: number[]): number;
    /**
     * n次Bézier曲线关于t的二阶导数
     *
     * 一般定义
     *
     * 贝塞尔曲线可以定义为任意度n。
     *
     * @param t 插值度
     * @param ps 点列表 ps.length == n+1
     */
    bnSecondDerivative(t: number, ps: number[]): number;
    /**
     * n次Bézier曲线关于t的dn阶导数
     *
     * 贝塞尔曲线可以定义为任意度n。
     *
     * @param t 插值度
     * @param dn 求导次数
     * @param ps 点列表     ps.length == n+1
     */
    bnND(t: number, dn: number, ps: number[]): number;
    /**
     * 获取曲线在指定插值度上的值
     * @param t 插值度
     * @param ps 点列表
     */
    getValue(t: number, ps: number[]): number;
    /**
     * 获取曲线在指定插值度上的斜率
     * @param t 插值度
     * @param ps 点列表
     */
    getDerivative(t: number, ps: number[]): number;
    /**
     * 获取目标值所在的插值度T，该方法只适用于在连续递增
     *
     * @param targetV 目标值
     * @param ps 点列表
     * @param startT 起始插值点
     * @param endT 终止插值点
     * @param numSamples 分段数量，用于分段查找，用于解决寻找多个解、是否无解等问题；过少的分段可能会造成找不到存在的解决，过多的分段将会造成性能很差。
     * @returns 返回解数组
     */
    getTFromValue(targetV: number, ps: number[], numSamples?: number): number[];
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
    getTFromValueAtRange(targetV: number, ps: number[], guessT?: number, maxIterations?: number): number;
    /**
     * 获取曲线样本数据
     *
     * 这些点可用于连线来拟合曲线。
     *
     * @param ps 点列表
     * @param num 采样次数 ，采样点分别为[0,1/num,2/num,....,(num-1)/num,1]
     */
    getSamples(ps: number[], num?: number): number[];
}
/**
 * 贝塞尔曲线
 *
 * 参考：https://github.com/gre/bezier-easing
 * @see https://github.com/gre/bezier-easing
 */
declare class Bezier {
    private mX1;
    private mY1;
    private mX2;
    private mY2;
    private sampleValues;
    /**
     * 贝塞尔
     * @param mX1
     * @param mY1
     * @param mX2
     * @param mY2
     */
    constructor(mX1: any, mY1: any, mX2: any, mY2: any);
    private getTForX(aX);
    getValue(x: any): any;
}
/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */
/**
 * 牛顿迭代次数
 */
declare var NEWTON_ITERATIONS: number;
/**
 * 牛顿最小斜率
 */
declare var NEWTON_MIN_SLOPE: number;
/**
 * 细分精度
 */
declare var SUBDIVISION_PRECISION: number;
/**
 * 细分最大迭代次数
 */
declare var SUBDIVISION_MAX_ITERATIONS: number;
/**
 * 表格尺寸
 */
declare var kSplineTableSize: number;
/**
 * 表格格子步长
 */
declare var kSampleStepSize: number;
declare function A(aA1: any, aA2: any): number;
declare function B(aA1: any, aA2: any): number;
declare function C(aA1: any): number;
/**
 * 计算贝塞尔值
 */
declare function calcBezier(aT: any, aA1: any, aA2: any): number;
/**
 * 获取斜率
 */
declare function getSlope(aT: any, aA1: any, aA2: any): number;
/**
 * 二分细分
 * @param aX
 * @param aA
 * @param aB
 * @param mX1
 * @param mX2
 */
declare function binarySubdivide(aX: any, aA: any, aB: any, mX1: any, mX2: any): any;
/**
 * 牛顿迭代
 * @param aX
 * @param aGuessT
 * @param mX1
 * @param mX2
 */
declare function newtonRaphsonIterate(aX: any, aGuessT: any, mX1: any, mX2: any): any;
declare function createCanvas(x?: number, y?: number, width?: number, height?: number): HTMLCanvasElement;
declare function getBezierSamples(bezier: Bezier, num?: number): number[][];
/**
 * 清理画布
 * @param canvas 画布
 */
declare function clearCanvas(canvas: HTMLCanvasElement): void;
/**
 * 绘制曲线
 * @param canvas 画布
 * @param points 曲线上的点
 * @param strokeStyle 曲线颜色
 */
declare function drawCurve(canvas: HTMLCanvasElement, points: number[][], strokeStyle?: string, lineWidth?: number): void;
declare var canvas: HTMLCanvasElement;
declare var point0: number[];
declare var point1: number[];
declare var xs: number[];
declare var ys: number[];
declare var bezier: Bezier;
declare var points: number[][];
declare var xSamples: number[];
declare var ySamples: number[];
declare var points2: any[];
declare var x: number;
declare var num: number;
