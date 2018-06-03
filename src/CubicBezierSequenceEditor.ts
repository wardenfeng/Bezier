(() =>
{
    // 创建画布
    var canvas = createCanvas(0, 60, window.innerWidth, window.innerHeight - 60);

    // window.addEventListener("click", onMouseClick)
    window.addEventListener("mousedown", onMouseDown);

    // 第一条曲线  [0,3] 
    // 第二条曲线  [3,6] 
    var xs: number[] = [];
    var ys: number[] = [];
    addPoint(Math.random() * canvas.width, Math.random() * canvas.height);
    addPoint(Math.random() * canvas.width, Math.random() * canvas.height);

    var editIndex = -1;
    var editing = false;
    var mousedownxy = { x: -1, y: -1 }

    function onMouseDown(ev: MouseEvent)
    {
        var rect = canvas.getBoundingClientRect();
        if (!(rect.left < ev.clientX && ev.clientX < rect.right && rect.top < ev.clientY && ev.clientY < rect.bottom))
            return;
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;

        mousedownxy.x = x;
        mousedownxy.y = y;

        editIndex = findPoint(x, y);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(ev: MouseEvent)
    {
        if (editIndex == -1)
            return;
        editing = true;

        var rect = canvas.getBoundingClientRect();
        if (!(rect.left < ev.clientX && ev.clientX < rect.right && rect.top < ev.clientY && ev.clientY < rect.bottom))
            return;
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;

        if (editIndex % 3 == 0) // 关键点
        {
            var offsetx = x - xs[editIndex];
            var offsety = y - ys[editIndex];

            xs[editIndex] = x;
            ys[editIndex] = y;
            // 同时以移动左边控制点
            if (editIndex > 0)
            {
                xs[editIndex - 1] += offsetx;
                ys[editIndex - 1] += offsety;
            }
            // 同时以移动右边控制点
            if (editIndex + 1 < xs.length)
            {
                xs[editIndex + 1] += offsetx;
                ys[editIndex + 1] += offsety;
            }
        } else if (editIndex % 3 == 1) // 右边控制点
        {
            xs[editIndex] = x;
            ys[editIndex] = y;
            // 改变左边控制点
            if (editIndex - 2 > -1)
            {
                xs[editIndex - 2] = 2 * xs[editIndex - 1] - x;
                ys[editIndex - 2] = 2 * ys[editIndex - 1] - y;
            }
        } else if (editIndex % 3 == 2) // 左边控制点
        {
            xs[editIndex] = x;
            ys[editIndex] = y;
            // 改变右边控制点
            if (editIndex + 2 < xs.length)
            {
                xs[editIndex + 2] = 2 * xs[editIndex + 1] - x;
                ys[editIndex + 2] = 2 * ys[editIndex + 1] - y;
            }
        }
    }

    function onMouseUp(ev: MouseEvent)
    {
        if (editing)
        {
            editing = false;
            editIndex = -1;
            return;
        }
        var rect = canvas.getBoundingClientRect();
        if (!(rect.left < ev.clientX && ev.clientX < rect.right && rect.top < ev.clientY && ev.clientY < rect.bottom))
            return;
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;

        if (Math.abs(mousedownxy.x - x) > 5 || Math.abs(mousedownxy.y - y) > 5)
        {
            // 有移动鼠标，无效点击
            return;
        }

        var index = findPoint(x, y);
        if (index % 3 == 0)
        {
            deletePoint(index);
        } else if (index == -1)
        {
            addPoint(x, y);
        }

        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    }

    function findPoint(x: number, y: number)
    {
        for (let i = 0; i < xs.length; i++)
        {
            if (Math.abs(xs[i] - x) < 16 && Math.abs(ys[i] - y) < 16)
            {
                return i;
            }
        }
        return -1;
    }

    function deletePoint(index: number)
    {
        if (index == 0)
        {
            xs.splice(index, 3);
            ys.splice(index, 3);
        } else if (index == xs.length - 1)
        {
            xs.splice(index - 2, 3);
            ys.splice(index - 2, 3);
        } else
        {
            xs.splice(index - 1, 3);
            ys.splice(index - 1, 3);
        }
    }

    function addPoint(x: number, y: number)
    {
        if (xs.length > 0)
        {
            var lastx = xs[xs.length - 1];
            var lasty = ys[ys.length - 1];
            // 自动新增两个控制点
            var cx0 = bezier.linear(1 / 3, lastx, x);
            var cy0 = bezier.linear(1 / 3, lasty, y);
            if (xs.length - 2 > -1)
            {
                cx0 = lastx * 2 - xs[xs.length - 2];
                cy0 = lasty * 2 - ys[ys.length - 2];
            }
            var cx1 = bezier.linear(2 / 3, lastx, x);
            var cy1 = bezier.linear(2 / 3, lasty, y);
            //
            xs.push(cx0, cx1, x);
            ys.push(cy0, cy1, y);
        } else
        {
            xs.push(x);
            ys.push(y);
        }

    }

    requestAnimationFrame(draw);

    function draw()
    {
        clearCanvas(canvas);

        for (let i = 0, n = xs.length / 3; i < n; i++)
        {
            // 使用 bezierCurve 进行采样曲线点
            if (i > 0)
            {
                var sxs = xs.slice(i * 3 - 3, i * 3 + 1)
                var sys = ys.slice(i * 3 - 3, i * 3 + 1)

                var xSamples = bezier.getSamples(sxs);
                var ySamples = bezier.getSamples(sys);
                // 绘制曲线
                drawPointsCurve(canvas, xSamples, ySamples, 'white', 3);
            }

            // 绘制曲线端点
            drawPoints(canvas, xs.slice(i * 3, i * 3 + 1), ys.slice(i * 3, i * 3 + 1), "red", 16)

            // 绘制控制点
            if (i > 0)
                drawPoints(canvas, xs.slice(i * 3 - 1, i * 3 + 0), ys.slice(i * 3 - 1, i * 3 + 0), "blue", 16)
            if (i < n - 1)
                drawPoints(canvas, xs.slice(i * 3 + 1, i * 3 + 2), ys.slice(i * 3 + 1, i * 3 + 2), "blue", 16)

            // 绘制控制点之间的连线
            if (i > 0)
                drawPointsCurve(canvas, xs.slice(i * 3 - 1, i * 3 + 1), ys.slice(i * 3 - 1, i * 3 + 1), "yellow", 1)
            if (i < n - 1)
                drawPointsCurve(canvas, xs.slice(i * 3 + 0, i * 3 + 2), ys.slice(i * 3 + 0, i * 3 + 2), "yellow", 1)
        }
        //
        requestAnimationFrame(draw);
    }

})();