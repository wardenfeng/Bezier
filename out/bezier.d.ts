declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
}
interface Point {
    /**
     * 克隆
     */
    clone(): this;
    /**
     * 插值到指定向量
     * @param v 目标向量
     * @param alpha 插值系数
     * @return 返回自身
     */
    lerpNumber(v: Point, alpha: number): this;
}
declare function curve<T>(t: number, points: Point[]): Point;
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
declare function getBezierSamples(bezier: Bezier, num?: number): Point[];
declare function getCurveSamples(points: Point[], num?: number): Point[];
declare function getCurveAtX(points: Point[], targetX: number): Point;
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
declare function drawCurve(canvas: HTMLCanvasElement, points: Point[], strokeStyle?: string, lineWidth?: number): void;
declare var canvas: HTMLCanvasElement;
declare var point0: number[];
declare var point1: number[];
declare var bezier: Bezier;
declare var points: Point[];
declare var points1: Point[];
declare var x: number;
