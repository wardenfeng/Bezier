function createCanvas(x = 0, y = 0, width = 100, height = 100)
{
    var canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.left = `${x}px`;
    canvas.style.top = `${y}px`;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    return canvas;
}

function getBezierSamples(bezier: Bezier, num = 100)
{
    var points: number[][] = [];
    for (let i = 0; i <= 1; i += 1 / num)
    {
        points.push([i, bezier.getValue(i)]);
    }
    return points;
}

class BezierTest
{
    point0 = [0.5, 0.5];
    point1 = [0.5, 0.5];

    canvas: HTMLCanvasElement;
    bezier: Bezier

    constructor()
    {
        this.canvas = createCanvas(100, 100, 400, 300);
        this.point0 = [Math.random(), Math.random()];
        this.point1 = [Math.random(), Math.random()];
        this.bezier = new Bezier(this.point0[0], this.point0[1], this.point1[0], this.point1[1]);
        this.drawBezier();
    }

    drawBezier()
    {
        var canvas = this.canvas;
        var ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 绘制背景
        ctx.fillStyle = 'brack';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制曲线
        var points = getBezierSamples(this.bezier, 100);
        points = points.map(item => { return [item[0] * canvas.width, (1 - item[1]) * canvas.height]; })
        // First path
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++)
        {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.stroke();

        // 使用 CanvasRenderingContext2D.bezierCurveTo
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.moveTo(0, canvas.height);
        ctx.bezierCurveTo(this.point0[0] * canvas.width, (1 - this.point0[1]) * canvas.height, this.point1[0] * canvas.width, (1 - this.point1[1]) * canvas.height, canvas.width, 0);
        ctx.stroke();
        // 与 CanvasRenderingContext2D.bezierCurveTo 完全重叠

        ctx.beginPath();
        ctx.moveTo(50, 20);
        ctx.bezierCurveTo(230, 30, 150, 60, 50, 100);
        ctx.stroke();


        // 绘制控制点
        // ctx.bezierCurveTo(this.point0[0],this.point0[1],this.point1[0],this.point1[1],)

    }
}

new BezierTest();