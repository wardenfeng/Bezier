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
    for (let i = 0, step = 1 / num; i <= 1; i += step)
    {
        points.push(new Point(i, bezier.getValue(i)));
    }
    return points;
}

function getCurveSamples(points: Point[], num = 100)
{
    var xs = points.map((i) => i.x);
    var ys = points.map((i) => i.y);

    var results: Point[] = [];
    for (let i = 0, step = 1 / num; i <= 1; i += step)
    {
        var p = new Point(curve(i, xs), curve(i, ys));
        results.push(p);
    }
    return results;
}

function getCurveSamples1(cx: Curve, cy: Curve, num = 100)
{
    var results: Point[] = [];
    for (let i = 0; i <= num; i++)
    {
        var p = new Point(cx.getValue(i / num), cy.getValue(i / num));
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

var canvas = createCanvas(100, 100, 400, 300);
// var point0 = [Math.random(), Math.random()];
// var point1 = [Math.random(), Math.random()];
var point0 = [0.25, Math.random()];
var point1 = [0.75, Math.random()];

clearCanvas(canvas);
//
var bezier = new Bezier(point0[0], point0[1], point1[0], point1[1]);
var points = getBezierSamples(bezier, 100);
points = points.map(item => { return new Point(item.x * canvas.width, (1 - item.y) * canvas.height);; })
drawCurve(canvas, points, 'white', 9)

//
var points1 = getCurveSamples([new Point(0, 0), new Point(point0[0], point0[1]), new Point(point1[0], point1[1]), new Point(1, 1)]);
points1 = points1.map(item => { return new Point(item.x * canvas.width, (1 - item.y) * canvas.height); })
drawCurve(canvas, points1, "red", 6);

//
var cx = new Curve([0, point0[0], point1[0], 1]);
var cy = new Curve([0, point0[1], point1[1], 1]);

var points2 = getCurveSamples1(cx, cy);
points2 = points2.map(item => { return new Point(item.x * canvas.width, (1 - item.y) * canvas.height); })
drawCurve(canvas, points2, "green", 3);

var x = Math.random();

var num = 100000;

var xs = points.map((i) => i.x);
var ys = points.map((i) => i.y);

console.time("feng")
for (let i = 0; i < num; i++)
{
    var t0 = findTatValue(x, xs);
    var v2 = curve2(t0, ys);
}
console.timeEnd("feng")

console.time("feng1")
for (let i = 0; i < num; i++)
{
    var t = cx.findTatValue(x);
    var v3 = cy.getValue(t);
}
console.timeEnd("feng1")

console.time("bezier")
for (let i = 0; i < num; i++)
{
    var v1 = bezier.getValue(x);
}
console.timeEnd("bezier")

console.log(x, v2);
console.log(x, v1);
console.log(x, v3);

// new BezierTest();

// var points = [new Point(0, 0), new Point(Math.random(), Math.random()), new Point(Math.random(), Math.random()), new Point(1, 1)];
// var bezier = new Bezier(points[1].x, points[1].y, points[2].x, points[2].y);

// var t = 0.5;
// var v1 = bezier.getValue(t);

// var v2 = curve(t, points);

// v1;
// v2;