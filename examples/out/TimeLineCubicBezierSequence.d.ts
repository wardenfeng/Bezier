interface TimeLineCubicBezierKey {
    /**
     * 时间轴的位置 [0,1]
     */
    t: number;
    /**
     * 值 [0,1]
     */
    y: number;
    /**
     * 斜率
     */
    tan: number;
}
/**
 * 基于时间轴的连续三阶Bézier曲线
 *
 * @author feng / http://feng3d.com 10/06/2018
 */
declare class TimeLineCubicBezierSequence {
    /**
     * 最大tan值，超出该值后将会变成分段
     */
    maxtan: number;
    keys: TimeLineCubicBezierKey[];
    findPoint(x: number, y: number, precision: number): TimeLineCubicBezierKey;
    /**
     * 点击曲线添加关键点
     * @param x x坐标
     * @param y y坐标
     */
    addPoint(x: number, y: number, precision: number): {
        t: number;
        y: number;
        tan: number;
    };
    deletePoint(key: TimeLineCubicBezierKey): void;
}
