(() =>
{
    // 创建画布
    var canvas = createCanvas(100, 100, 400, 300);
    clearCanvas(canvas);

    // 随机生成4个点坐标
    var xs = [Math.random(), Math.random(), Math.random(), Math.random()].map(i => i * canvas.width);
    var ys = [Math.random(), Math.random(), Math.random(), Math.random()].map(i => (1 - i) * canvas.height);


    var animations: {
        /**
         * x 坐标
         */
        x: number,
        /**
         * y 坐标
         */
        y: number,
        /**
         * x 过程数据
         */
        processsx: number[][],
        /**
         * y 过程数据
         */
        processsy: number[][]
    }[] = [];

    var results: number[] = [];
    var num = 100;
    for (let i = 0; i <= num; i++)
    {
        var processsx: number[][] = [];
        var processsy: number[][] = [];
        var x = bezier.bn(i / num, xs, processsx);
        var y = bezier.bn(i / num, ys, processsy);

        animations[i] = { x: x, y: y, processsx: processsx, processsy: processsy };
    }



    // 使用 bezierCurve 进行采样曲线点
    var xSamples = bezier.getSamples(xs);
    var ySamples = bezier.getSamples(ys);
    drawPointsCurve(canvas, xSamples, ySamples, "green", 5);
})();