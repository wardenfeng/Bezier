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
    var points: Point[] = [];
    for (let i = 0; i <= 1; i += 1 / num)
    {
        points.push(new Point(i, bezier.getValue(i)));
    }
    return points;
}

function getCurveSamples(points: Point[], num = 100)
{
    var results: Point[] = [];
    for (let i = 0; i <= 1; i += 1 / num)
    {
        var p = curve(i, points);
        results.push(p);
    }
    return results;
}

/**
 * 清理画布
 * @param canvas 画布
 */
function clearCanvas(canvas: HTMLCanvasElement)
{
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制背景
    ctx.fillStyle = 'brack';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * 绘制曲线
 * @param canvas 画布 
 * @param points 曲线上的点
 * @param strokeStyle 曲线颜色
 */
function drawCurve(canvas: HTMLCanvasElement, points: Point[], strokeStyle = 'white', lineWidth = 3)
{
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++)
    {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
}

// class BezierTest
// {
//     point0 = [0.5, 0.5];
//     point1 = [0.5, 0.5];

//     canvas: HTMLCanvasElement;
//     bezier: Bezier

//     constructor()
//     {
//         this.canvas = createCanvas(100, 100, 400, 300);
//         this.point0 = [Math.random(), Math.random()];
//         this.point1 = [Math.random(), Math.random()];
//         this.bezier = new Bezier(this.point0[0], this.point0[1], this.point1[0], this.point1[1]);
//         this.drawBezier();
//     }

//     drawBezier()
//     {
//         var canvas = this.canvas;
//         var ctx = canvas.getContext("2d");

//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         // 绘制背景
//         ctx.fillStyle = 'brack';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);

//         // 绘制曲线
//         var points = getBezierSamples(this.bezier, 100);
//         points = points.map(item => { return [item[0] * canvas.width, (1 - item[1]) * canvas.height]; })
//         // First path
//         ctx.beginPath();
//         ctx.lineWidth = 3;
//         ctx.strokeStyle = 'white';
//         ctx.moveTo(points[0][0], points[0][1]);
//         for (let i = 1; i < points.length; i++)
//         {
//             ctx.lineTo(points[i][0], points[i][1]);
//         }
//         ctx.stroke();

//         // 使用 CanvasRenderingContext2D.bezierCurveTo
//         ctx.beginPath();
//         ctx.lineWidth = 2;
//         ctx.strokeStyle = 'red';
//         ctx.moveTo(0, canvas.height);
//         ctx.bezierCurveTo(this.point0[0] * canvas.width, (1 - this.point0[1]) * canvas.height, this.point1[0] * canvas.width, (1 - this.point1[1]) * canvas.height, canvas.width, 0);
//         ctx.stroke();
//         // 与 CanvasRenderingContext2D.bezierCurveTo 完全重叠

//         var points1 = [];
//         var num = 100;
//         for (let i = 0; i < num; i++)
//         {
//             var tp = curve(i / num, [new Point(0, 0), new Point(this.point0[0], this.point0[1]), new Point(this.point1[0], this.point1[1]), new Point(1, 1)]);
//             // points1.push([tp.x, tp.y])
//             points1.push([i / num, tp.y])
//         }
//         points1 = points1.map(item => { return [item[0] * canvas.width, (1 - item[1]) * canvas.height]; })
//         ctx.beginPath();
//         ctx.lineWidth = 1;
//         ctx.strokeStyle = 'green';
//         ctx.moveTo(points1[0][0], points1[0][1]);
//         for (let i = 1; i < points1.length; i++)
//         {
//             ctx.lineTo(points1[i][0], points1[i][1]);
//         }
//         ctx.stroke();
//     }
// }

var canvas = createCanvas(100, 100, 400, 300);
var point0 = [Math.random(), Math.random()];
var point1 = [Math.random(), Math.random()];
var bezier = new Bezier(this.point0[0], this.point0[1], this.point1[0], this.point1[1]);
var points = getBezierSamples(this.bezier, 100);
points = points.map(item => { return new Point(item.x * canvas.width, (1 - item.y) * canvas.height);; })
clearCanvas(canvas);
drawCurve(canvas, points)

var points1 = getCurveSamples([new Point(0, 0), new Point(this.point0[0], this.point0[1]), new Point(this.point1[0], this.point1[1]), new Point(1, 1)]);
points1 = points1.map(item => { return new Point(item.x * canvas.width, (1 - item.y) * canvas.height);; })
drawCurve(canvas, points1, "red", 1);

// new BezierTest();

// var points = [new Point(0, 0), new Point(Math.random(), Math.random()), new Point(Math.random(), Math.random()), new Point(1, 1)];
// var bezier = new Bezier(points[1].x, points[1].y, points[2].x, points[2].y);

// var t = 0.5;
// var v1 = bezier.getValue(t);

// var v2 = curve(t, points);

// v1;
// v2;