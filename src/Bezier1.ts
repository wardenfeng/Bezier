class Curve
{
    private numbers: number[];
    // private map = {};
    n0;
    n1;
    n2;
    n3;

    constructor(numbers: number[])
    {
        this.numbers = numbers;
        this.n0 = numbers[0];
        this.n1 = numbers[1];
        this.n2 = numbers[2];
        this.n3 = numbers[3];
        // this.map[0] = numbers[0];
        // this.map[1] = numbers[numbers.length - 1];
    }

    getValue(t: number)
    {
        // if (this.map[t] != undefined)
        //     return this.map[t];
        // var v = this.curve(t, this.numbers);
        // var v = curve1(t, this.n0, this.n1, this.n2, this.n3);
        // var v = curve2(t, this.numbers);
        var v = this.curve2(t, this.numbers);
        // var v = this.curve2(t);
        // this.map[t] = v;
        return v;
    }

    // curve(t: number, numbers: number[]): number
    // {
    //     numbers = numbers.concat();

    //     for (let i = numbers.length - 1; i > 1; i--)
    //     {
    //         for (let j = 0; j < j; j++)
    //         {
    //             numbers[j] = (1 - t) * numbers[j] + t * numbers[j + 1];
    //         }
    //     }
    //     return numbers[0];
    // }

    curve(t: number, numbers: number[]): number
    {
        if (numbers.length == 2)
        {
            return (1 - t) * numbers[0] + t * numbers[1];
        }
        var newpoints: number[] = [];
        for (let i = 0, end = numbers.length - 1; i < end; i++)
        {
            newpoints.push(this.curve(t, [numbers[i], numbers[i + 1]]));
        }
        return this.curve(t, newpoints);
    }

    curve2(t: number, ps: number[]): number
    {
        var t1 = 1 - t;
        return t1 * t1 * t1 * ps[0] + 3 * t1 * t1 * t * ps[1] + 3 * t1 * t * t * ps[2] + t * t * t * ps[3];
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

        var mt = mt = t0 + (t1 - t0) * (targetX - x0) / (x1 - x0);
        var mv = this.getValue(mt);
        // console.assert((x0 - targetX) * (x1 - targetX) < 0, `targetX 必须在 起点终点之间！`);

        var i = 0;
        while (Math.abs(mv - targetX) > SUBDIVISION_PRECISION && i++ < SUBDIVISION_MAX_ITERATIONS)
        {
            // 进行线性插值预估目标位置
            mt = t0 + (t1 - t0) * (targetX - x0) / (x1 - x0);
            mv = this.getValue(mt);
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
        return mt;
    }
}