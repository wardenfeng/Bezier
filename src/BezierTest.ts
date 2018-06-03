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
function drawPointsCurve(canvas: HTMLCanvasElement, points: number[][], strokeStyle = 'white', lineWidth = 3)
{
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++)
    {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.stroke();
}

function drawBezierCurve(canvas: HTMLCanvasElement, points: number[][], strokeStyle = 'white', lineWidth = 3)
{
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(points[0][0], points[0][1]);
    ctx.bezierCurveTo(points[1][0], points[1][1], points[2][0], points[2][1], points[3][0], points[3][1]);
    ctx.stroke();
}

var canvas = createCanvas(100, 100, 400, 300);
// var point0 = [Math.random(), Math.random()];
// var point1 = [Math.random(), Math.random()];
var point0 = [0.25, Math.random()];
var point1 = [0.75, Math.random()];
var xs = [0, point0[0], point1[0], 1];
var ys = [0, point0[1], point1[1], 1];

clearCanvas(canvas);

//
var bezierPoints = [[0, 0], point0, point1, [1, 1]];
bezierPoints = bezierPoints.map(item => { return [item[0] * canvas.width, (1 - item[1]) * canvas.height]; })
drawBezierCurve(canvas, bezierPoints, "red", 9);

//
var xSamples = bezierCurve.getSamples(xs);
var ySamples = bezierCurve.getSamples(ys);

var points2 = [];
for (let i = 0; i < xSamples.length; i++)
{
    points2[i] = [xSamples[i] * canvas.width, (1 - ySamples[i]) * canvas.height];
}
drawPointsCurve(canvas, points2, "green", 3);