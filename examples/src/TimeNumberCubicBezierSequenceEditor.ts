(() =>
{
    // 基于时间的连续三阶Bézier曲线编辑，意味着一个x对应唯一的y

    // 创建画布
    var canvas = createCanvas(0, 60, window.innerWidth, window.innerHeight - 60);

    // window.addEventListener("click", onMouseClick)
    window.addEventListener("mousedown", onMouseDown);

    /**
     * 点绘制尺寸
     */
    var pointSize = 16;
    /**
     * 控制柄长度
     */
    var controllerLength = 100;

    // 第一条曲线  [0,3] 
    // 第二条曲线  [3,6] 
    var keys: { x: number, y: number, tan: number }[] = [];
    addPoint(Math.random() * canvas.width, Math.random() * canvas.height);

    var editKey: { x: number, y: number, tan: number };
    var controlkey: { x: number, y: number, tan: number };
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

        editKey = findPoint(x, y);
        if (editKey == null)
        {
            controlkey = findControlPoint(x, y);
        }

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(ev: MouseEvent)
    {
        if (editKey == null && controlkey == null)
            return;
        editing = true;

        var rect = canvas.getBoundingClientRect();
        if (!(rect.left < ev.clientX && ev.clientX < rect.right && rect.top < ev.clientY && ev.clientY < rect.bottom))
            return;
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;

        if (editKey)
        {
            editKey.x = x;
            editKey.y = y;
        } else if (controlkey)
        {
            controlkey.tan = (y - controlkey.y) / (x - controlkey.x);
        }
    }

    function onMouseUp(ev: MouseEvent)
    {
        if (editing)
        {
            editing = false;
            editKey = null;
            controlkey = null;
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

        var selectedKey = findPoint(x, y);
        if (selectedKey != null)
        {
            deletePoint(selectedKey);
        } else 
        {
            // 没有选中关键与控制点时，检查是否点击到曲线
            var result = findCurve(x, y);
            if (result != null)
            {
                addPointAtCurve(result.index, result.t);
            } else
            {
                addPoint(x, y);
            }
        }

        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    }

    function findPoint(x: number, y: number)
    {
        for (let i = 0; i < keys.length; i++)
        {
            if (Math.abs(keys[i].x - x) < pointSize / 2 && Math.abs(keys[i].y - y) < pointSize / 2)
            {
                return keys[i];
            }
        }
        return null;
    }

    function findControlPoint(x: number, y: number)
    {
        for (let i = 0; i < keys.length; i++)
        {
            var key = keys[i];
            var lcp = { x: key.x - controllerLength * Math.cos(Math.atan(key.tan)), y: key.y - controllerLength * Math.sin(Math.atan(key.tan)) };
            if (Math.abs(lcp.x - x) < pointSize / 2 && Math.abs(lcp.y - y) < pointSize / 2)
            {
                return key;
            }
            var rcp = { x: key.x + controllerLength * Math.cos(Math.atan(key.tan)), y: key.y + controllerLength * Math.sin(Math.atan(key.tan)) };
            if (Math.abs(rcp.x - x) < pointSize / 2 && Math.abs(rcp.y - y) < pointSize / 2)
            {
                return key;
            }
        }
        return null;
    }

    /**
     * 查找点所在的曲线
     * @param x x坐标
     * @param y y坐标
     */
    function findCurve(x: number, y: number)
    {
        // for (let i = 0, n = xs.length / 3; i < n; i++)
        // {
        //     // 使用 bezierCurve 进行采样曲线点
        //     if (i > 0)
        //     {
        //         var sxs = xs.slice(i * 3 - 3, i * 3 + 1)
        //         var sys = ys.slice(i * 3 - 3, i * 3 + 1)
        //         // 先在曲线上找到y再比较x
        //         var yTs = bezier.getTFromValue(y, sys);
        //         for (var j = 0; j < yTs.length; j++)
        //         {
        //             var xv = bezier.getValue(yTs[j], sxs);
        //             if (Math.abs(xv - x) < pointSize / 2)
        //             {
        //                 return { index: i, t: yTs[j] };
        //             }
        //         }
        //         // 先在曲线上找到x再比较y
        //         var xTs = bezier.getTFromValue(x, sxs);
        //         for (var j = 0; j < xTs.length; j++)
        //         {
        //             var yv = bezier.getValue(xTs[j], sys);
        //             if (Math.abs(yv - y) < pointSize / 2)
        //             {
        //                 return { index: i, t: xTs[j] };
        //             }
        //         }
        //     }
        // }
        return null;
    }

    function deletePoint(key: { x: number, y: number, tan: number })
    {
        var index = keys.indexOf(key);
        keys.splice(index, 1);
    }

    function addPoint(x: number, y: number)
    {
        keys.push({ x: x, y: y, tan: 0 });
    }

    /**
     * 在指定曲线上添加点
     * @param curveIndex 曲线编号
     * @param t 曲线插值度
     */
    function addPointAtCurve(curveIndex: number, t: number)
    {
        // 获取当前曲线
        // var sxs = xs.slice(curveIndex * 3 - 3, curveIndex * 3 + 1)
        // var sys = ys.slice(curveIndex * 3 - 3, curveIndex * 3 + 1)
        // // 分割曲线
        // var xss = bezier.split(t, sxs);
        // var yss = bezier.split(t, sys);
        // //
        // var nxs = xss[0].concat();
        // nxs.pop();
        // nxs = nxs.concat(xss[1]);
        // //
        // var nys = yss[0].concat();
        // nys.pop();
        // nys = nys.concat(yss[1]);
        // //
        // xs.splice.apply(xs, [curveIndex * 3 - 3, 4].concat(nxs))
        // ys.splice.apply(ys, [curveIndex * 3 - 3, 4].concat(nys));
    }

    requestAnimationFrame(draw);

    function draw()
    {
        clearCanvas(canvas);

        keys.sort((a, b) => a.x - b.x)

        for (let i = 0, n = keys.length; i < n; i++)
        {
            var key = keys[i];
            // 使用 bezierCurve 进行采样曲线点
            if (i > 0)
            {
                var prekey = keys[i - 1];
                var xstart = prekey.x;
                var ystart = prekey.y;
                var tanstart = prekey.tan;
                var xend = key.x;
                var yend = key.y;
                var tanend = key.tan;
                var sys = [ystart, ystart + tanstart * (xend - xstart) / 3, yend - tanend * (xend - xstart) / 3, yend];

                var numSamples = 100;
                var ySamples = bezier.getSamples(sys, numSamples);
                var xSamples = ySamples.map((v, i) => { return xstart + (xend - xstart) * i / numSamples; });

                // 绘制曲线
                drawPointsCurve(canvas, xSamples, ySamples, 'white', 3);
            }

            // 绘制曲线端点
            drawPoints(canvas, [key.x], [key.y], "red", pointSize)

            if (i == 0)
            {
                drawPointsCurve(canvas, [0, key.x], [key.y, key.y], 'white', 3);
            }
            if (i == n - 1)
            {
                drawPointsCurve(canvas, [key.x, canvas.width], [key.y, key.y], 'white', 3);
            }

            // 绘制控制点
            if (i > 0)
            {
                // 左边控制点
                var lcp = { x: key.x - controllerLength * Math.cos(Math.atan(key.tan)), y: key.y - controllerLength * Math.sin(Math.atan(key.tan)) };
                drawPoints(canvas, [lcp.x], [lcp.y], "blue", pointSize)
                drawPointsCurve(canvas, [key.x, lcp.x], [key.y, lcp.y], "yellow", 1)
            }
            if (i < n - 1)
            {
                var rcp = { x: key.x + controllerLength * Math.cos(Math.atan(key.tan)), y: key.y + controllerLength * Math.sin(Math.atan(key.tan)) };
                drawPoints(canvas, [rcp.x], [rcp.y], "blue", pointSize)
                drawPointsCurve(canvas, [key.x, rcp.x], [key.y, rcp.y], "yellow", 1)
            }
        }
        //
        requestAnimationFrame(draw);
    }

})();