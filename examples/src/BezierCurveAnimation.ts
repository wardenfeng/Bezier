(() =>
{
    var input = <HTMLInputElement>document.getElementById("input");
    var button = document.getElementById("button");
    var stopBtn = <HTMLInputElement>document.getElementById("stopBtn");
    // 创建画布
    var canvas = createCanvas(0, 60, window.innerWidth, window.innerHeight - 60);
    input.value = "" + 64;
    var requestid;
    var isStop = false;

    draw();

    button.onclick = function ()
    {
        if (requestid)
            cancelAnimationFrame(requestid);
        draw()
    }

    stopBtn.onclick = function ()
    {
        isStop = !isStop;
        if (isStop)
        {
            stopBtn.value = "播放";
        } else
        {
            stopBtn.value = "停止";
        }
    }

    function draw()
    {
        var numPoints = Number(input.value) + 1;
        if (isNaN(numPoints))
            numPoints = 2;
        numPoints = Math.max(1, Math.min(500, numPoints));

        var xs: number[] = [];
        var ys: number[] = [];
        for (let i = 0; i < numPoints; i++)
        {
            xs[i] = Math.random();
            ys[i] = Math.random();
        }

        // 映射到画布坐标
        xs = xs.map(i => i * canvas.width);
        ys = ys.map(i => (1 - i) * canvas.height);

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

        // 收集动画数据
        var num = 100;
        for (let i = 0; i <= num; i++)
        {
            var processsx: number[][] = [];
            var processsy: number[][] = [];
            var x = bezier.bn(i / num, xs, processsx);
            var y = bezier.bn(i / num, ys, processsy);

            animations[i] = { x: x, y: y, processsx: processsx, processsy: processsy };
        }

        var t = 0;
        var dir = 1;
        requestid = requestAnimationFrame(animation);
        requestAnimationFrame

        var usecolors = getColors(xs.length);

        function animation()
        {
            //
            if (!isStop)
                t += dir;
            if (t > 100)
            {
                t = 100;
                dir = -1;
            } else if (t < 0)
            {
                t = 0;
                dir = 1;
            }
            clearCanvas(canvas);
            // 绘制插值过程
            var processsx = animations[t].processsx;
            var processsy = animations[t].processsy;
            for (let i = 0; i < processsx.length; i++)
            {
                drawPointsCurve(canvas, processsx[i], processsy[i], usecolors[i], 1);
            }
            requestid = requestAnimationFrame(animation);
            // 绘制整条曲线
            var xSamples = animations.map(i => i.x);
            var ySamples = animations.map(i => i.y);
            drawPointsCurve(canvas, xSamples, ySamples, "green", 5);
            // 绘制曲线动画
            var txs = animations.map(i => i.x).splice(0, t);
            var tys = animations.map(i => i.y).splice(0, t);
            drawPointsCurve(canvas, txs, tys, "red", 3);
        }
    }

})();