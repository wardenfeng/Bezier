class Point
{
    x: number;
    y: number;

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    clone()
    {
        return new Point(this.x, this.y);
    }

    lerpNumber(v: Point, alpha: number)
    {
        this.x = (1 - alpha) * this.x + alpha * v.x;
        this.y = (1 - alpha) * this.y + alpha * v.y;
        return this;
    }
}
interface Point
{
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

function curve<T>(t: number, points: Point[]): Point
{
    if (points.length == 2)
    {
        return points[0].clone().lerpNumber(points[1], t);
    }
    var newpoints = [];
    for (let i = 0, end = points.length - 1; i < end; i++)
    {
        newpoints.push(curve(t, [points[i], points[i + 1]]));
    }
    return curve(t, newpoints);
}