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
    keys: {
        x: number;
        y: number;
        tan: number;
    }[];
    findPoint(x: number, y: number, precision: number): {
        x: number;
        y: number;
        tan: number;
    };
    /**
     * 点击曲线添加关键点
     * @param x x坐标
     * @param y y坐标
     */
    addPoint(x: number, y: number, precision: number): {
        x: number;
        y: number;
        tan: number;
    };
    deletePoint(key: {
        x: number;
        y: number;
        tan: number;
    }): void;
}
