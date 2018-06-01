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
    for (let i = 0; i < 1; i += 1 / num)
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

    constructor()
    {
        this.canvas = createCanvas(100, 100, 400, 300);
        var bezier = new Bezier(Math.random(), Math.random(), Math.random(), Math.random());
        var points = getBezierSamples(bezier, 100);
        this.drawBezier(this.canvas, points);
    }

    drawBezier(canvas: HTMLCanvasElement, points: number[][])
    {
        var ctx = canvas.getContext("2d");

        points = points.map(item => { return [item[0] * canvas.width, (1 - item[1]) * canvas.height]; })

        ctx.fillStyle = 'brack';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // First path
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++)
        {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.stroke();
    }
}

new BezierTest();