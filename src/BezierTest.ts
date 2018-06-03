// 创建画布
var canvas = createCanvas(100, 100, 400, 300);

// 随机生成4个点坐标
var xs = [Math.random(), Math.random(), Math.random(), Math.random()].map(i => i * canvas.width);
var ys = [Math.random(), Math.random(), Math.random(), Math.random()].map(i => (1 - i) * canvas.height);

clearCanvas(canvas);

// 使用 canvas提供的 bezierCurveTo,CanvasRenderingContext2D.bezierCurveTo,CanvasPathMethods.bezierCurveTo 进行绘制曲线
drawBezierCurve(canvas, xs, ys, "red", 15);

// 使用 bezierCurve 进行采样曲线点
var xBezier = new CubicBezierCurve(xs[0], xs[1], xs[2], xs[3]);
var yBezier = new CubicBezierCurve(ys[0], ys[1], ys[2], ys[3]);
var xSamples = xBezier.getSamples();
var ySamples = yBezier.getSamples();
drawPointsCurve(canvas, xSamples, ySamples, "blue", 10);

// 使用 bezierCurve 进行采样曲线点
var xSamples = bezier.getSamples(xs);
var ySamples = bezier.getSamples(ys);
drawPointsCurve(canvas, xSamples, ySamples, "green", 5);
