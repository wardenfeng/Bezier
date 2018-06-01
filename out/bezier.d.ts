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
declare class BezierTest {
    constructor();
}
