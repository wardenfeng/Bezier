(function () {
    // 创建画布
    var canvas = createCanvas(100, 100, 400, 300);
    clearCanvas(canvas);
    // 随机生成4个点坐标
    var xs = [Math.random(), Math.random(), Math.random(), Math.random()].map(function (i) { return i * canvas.width; });
    var ys = [Math.random(), Math.random(), Math.random(), Math.random()].map(function (i) { return (1 - i) * canvas.height; });
    var animations = [];
    var results = [];
    var num = 100;
    for (var i = 0; i <= num; i++) {
        var processsx = [];
        var processsy = [];
        var x = bezier.bn(i / num, xs, processsx);
        var y = bezier.bn(i / num, ys, processsy);
        animations[i] = { x: x, y: y, processsx: processsx, processsy: processsy };
    }
    // 使用 bezierCurve 进行采样曲线点
    var xSamples = bezier.getSamples(xs);
    var ySamples = bezier.getSamples(ys);
    drawPointsCurve(canvas, xSamples, ySamples, "green", 5);
})();
//# sourceMappingURL=BezierCurveAnimation.js.map