(() =>
{
    // 创建画布
    var canvas = createCanvas(0, 60, window.innerWidth, window.innerHeight - 60);

    // window.addEventListener("click", onMouseClick)
    window.addEventListener("mousedown", onMouseDown);

    // 第一条曲线  [0,3] 
    // 第二条曲线  [3,6] 
    var xs: number[] = [
        Math.random() * canvas.width,
        Math.random() * canvas.width,
        Math.random() * canvas.width,
        Math.random() * canvas.width,
    ];
    var ys: number[] = [
        Math.random() * canvas.height,
        Math.random() * canvas.height,
        Math.random() * canvas.height,
        Math.random() * canvas.height,
    ];
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

        xs[editIndex] = x;
        ys[editIndex] = y;
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
        if (index != -1)
        {
            deletePoint(index);
        } else
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
            if (Math.abs(xs[i] - x) < 5 && Math.abs(ys[i] - y) < 20)
            {
                return i;
            }
        }
        return -1;
    }

    function deletePoint(index: number)
    {
        xs.splice(index, 1);
        ys.splice(index, 1);
    }

    function addPoint(x: number, y: number)
    {
        xs.push(x);
        ys.push(y);
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