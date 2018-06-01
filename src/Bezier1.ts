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

function curve<T>(t: number, numbers: number[]): number
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