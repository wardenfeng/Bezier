/**
 * 立方Bézier曲线
 *
 * 为了提升性能以及简化接口单独从Bezier.ts提取出来。
 *
 * @author feng / http://feng3d.com 03/06/2018
 */
declare class CubicBezier {
    /**
     * 起始点
     */
    private p0;
    /**
     * 控制点1
     */
    private p1;
    /**
     * 控制点2
     */
    private p2;
    /**
     * 终止点
     */
    private p3;
    /**
     * 单调区间插值点列表
     */
    private monotoneIntervalTs;
    /**
     * 单调区间值列表
     */
    private monotoneIntervalVs;
    /**
     * 创建立方Bézier曲线
     * @param p0 起始点
     * @param p1 控制点1
     * @param p2 控制点2
     * @param p3 终止点
     */
    constructor(p0: number, p1: number, p2: number, p3: number);
    /**
     *
     * @param t 插值度
     */
    getValue(t: number): number;
    /**
     * 三次Bézier曲线关于t的导数
     * @param t 插值度
     */
    getDerivative(t: number): number;
    /**
     * 三次Bézier曲线关于t的二阶导数
     * @param t 插值度
     */
    getSecondDerivative(t: number): number;
    /**
     * 查找区间内极值列表
     *
     * @param numSamples 采样次数，用于分段查找极值
     * @param precision  查找精度
     *
     * @returns 极值列表 {} {ts: 极值插值度列表,vs: 极值值列表}
     */
    getExtremums(numSamples?: number, precision?: number): {
        ts: number[];
        vs: number[];
    };
    /**
     * 获取单调区间列表
     * @returns {} {ts: 区间节点插值度列表,vs: 区间节点值列表}
     */
    getMonotoneIntervals(numSamples?: number, precision?: number): {
        ts: number[];
        vs: number[];
    };
    /**
     * 获取目标值所在的插值度T
     *
     * @param targetV 目标值
     * @param precision  查找精度
     *
     * @returns 返回解数组
     */
    getTFromValue(targetV: number, precision?: number): number[];
    /**
     * 从存在解的区域进行查找目标值的插值度
     *
     * 该函数只能从单调区间内查找值，并且 targetV 处于该区间内
     *
     * @param targetV 目标值
     * @param guessT 预估目标T值，单调区间内的一个预估值
     * @param precision  查找精度
     *
     * @returns 目标值所在插值度
     */
    getTFromValueAtRange(targetV: number, guessT?: number, precision?: number): number;
    /**
     * 获取曲线样本数据
     *
     * 这些点可用于连线来拟合曲线。
     *
     * @param num 采样次数 ，采样点分别为[0,1/num,2/num,....,(num-1)/num,1]
     */
    getSamples(num?: number): number[];
}
