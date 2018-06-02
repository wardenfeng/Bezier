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
     * @param t 插值度 0<=t<=1
     * @param p0 点1
     * @param p1 点2
     */
    linear(t: number, p0: number, p1: number): number;
    /**
     * 二次Bézier曲线
     * 二次Bézier曲线是由函数B（t）跟踪的路径，给定点P0，P1和P2，
     *
     *
     * @param t 插值度
     * @param p0 点1
     * @param p1 点2
     * @param p2 点3
     */
    quadratic(t: number, p0: number, p1: number, p2: number): void;
    getValue(t: number, numbers: number[]): number;
    curve(t: number, numbers: number[]): number;
    curve2(t: number, ps: number[]): number;
    findTatValue(targetX: number, numbers: number[]): any;
    getCurveSamples1(ps: number[], num?: number): number[];
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
