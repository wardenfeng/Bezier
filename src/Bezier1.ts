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

class Curve
{
    private numbers: number[];
    private map = {};

    constructor(numbers: number[])
    {
        this.numbers = numbers;
        this.map[0] = numbers[0];
        this.map[1] = numbers[numbers.length - 1];
    }

    getValue(t: number)
    {
        if (this.map[t] != undefined)
            return this.map[t];
        var v = curve(t, this.numbers);
        this.map[t] = v;
        return v;
    }

    findTatValue(targetX: number)
    {
        /**
         * 细分精度
         */
        var SUBDIVISION_PRECISION = 0.0000001;
        /**
         * 细分最大迭代次数
         */
        var SUBDIVISION_MAX_ITERATIONS = 10;

        var t0 = 0;
        var t1 = 1;
        var x0 = this.getValue(0);
        var x1 = this.getValue(1);
        // console.assert((x0 - targetX) * (x1 - targetX) < 0, `targetX 必须在 起点终点之间！`);

        var i = 0;
        while (Math.abs(x0 - x1) > SUBDIVISION_PRECISION && i++ < SUBDIVISION_MAX_ITERATIONS)
        {
            var mt = (t0 + t1) / 2;
            var mv = this.getValue(mt);
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
        return (t0 + t1) / 2;
    }
}

function curve1(t: number, p0: number, p1: number, p2: number, p3: number): number
{
    var t1 = 1 - t;
    return t1 * t1 * t1 * p0 + 3 * t1 * t1 * t * p1 + 3 * t1 * t * t * p2 + t * t * t * p3;
}

function curve2(t: number, ps: number[]): number
{
    var t1 = 1 - t;
    return t1 * t1 * t1 * ps[0] + 3 * t1 * t1 * t * ps[1] + 3 * t1 * t * t * ps[2] + t * t * t * ps[3];
}

function curve(t: number, numbers: number[]): number
{
    if (numbers.length == 2)
    {
        return (1 - t) * numbers[0] + t * numbers[1];
    }
    var newpoints: number[] = [];
    for (let i = 0, end = numbers.length - 1; i < end; i++)
    {
        newpoints.push(curve(t, [numbers[i], numbers[i + 1]]));
    }
    return curve(t, newpoints);
}

function findTatValue(targetX: number, numbers: number[])
{
    /**
     * 细分精度
     */
    var SUBDIVISION_PRECISION = 0.0000001;
    /**
     * 细分最大迭代次数
     */
    var SUBDIVISION_MAX_ITERATIONS = 10;

    var t0 = 0;
    var t1 = 1;
    var x0 = numbers[0];
    var x1 = numbers[numbers.length - 1];
    // console.assert((x0 - targetX) * (x1 - targetX) < 0, `targetX 必须在 起点终点之间！`);

    var i = 0;
    while (Math.abs(x0 - x1) > SUBDIVISION_PRECISION && i++ < SUBDIVISION_MAX_ITERATIONS)
    {
        var mt = (t0 + t1) / 2;
        var mv = curve2(mt, numbers);
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
    return (t0 + t1) / 2;
}