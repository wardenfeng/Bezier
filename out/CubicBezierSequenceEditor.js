(function () {
    // 创建画布
    var canvas = createCanvas(0, 60, window.innerWidth, window.innerHeight - 60);
    // window.addEventListener("click", onMouseClick)
    window.addEventListener("mousedown", onMouseDown);
    /**
     * 点绘制尺寸
     */
    var pointSize = 16;
    // 第一条曲线  [0,3] 
    // 第二条曲线  [3,6] 
    var xs = [];
    var ys = [];
    addPoint(Math.random() * canvas.width, Math.random() * canvas.height);
    addPoint(Math.random() * canvas.width, Math.random() * canvas.height);
    var editIndex = -1;
    var editing = false;
    var mousedownxy = { x: -1, y: -1 };
    function onMouseDown(ev) {
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
    function onMouseMove(ev) {
        if (editIndex == -1)
            return;
        editing = true;
        var rect = canvas.getBoundingClientRect();
        if (!(rect.left < ev.clientX && ev.clientX < rect.right && rect.top < ev.clientY && ev.clientY < rect.bottom))
            return;
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;
        if (editIndex % 3 == 0) {
            var offsetx = x - xs[editIndex];
            var offsety = y - ys[editIndex];
            xs[editIndex] = x;
            ys[editIndex] = y;
            // 同时以移动左边控制点
            if (editIndex > 0) {
                xs[editIndex - 1] += offsetx;
                ys[editIndex - 1] += offsety;
            }
            // 同时以移动右边控制点
            if (editIndex + 1 < xs.length) {
                xs[editIndex + 1] += offsetx;
                ys[editIndex + 1] += offsety;
            }
        }
        else if (editIndex % 3 == 1) {
            xs[editIndex] = x;
            ys[editIndex] = y;
            // 改变左边控制点
            if (editIndex - 2 > -1) {
                xs[editIndex - 2] = 2 * xs[editIndex - 1] - x;
                ys[editIndex - 2] = 2 * ys[editIndex - 1] - y;
            }
        }
        else if (editIndex % 3 == 2) {
            xs[editIndex] = x;
            ys[editIndex] = y;
            // 改变右边控制点
            if (editIndex + 2 < xs.length) {
                xs[editIndex + 2] = 2 * xs[editIndex + 1] - x;
                ys[editIndex + 2] = 2 * ys[editIndex + 1] - y;
            }
        }
    }
    function onMouseUp(ev) {
        if (editing) {
            editing = false;
            editIndex = -1;
            return;
        }
        var rect = canvas.getBoundingClientRect();
        if (!(rect.left < ev.clientX && ev.clientX < rect.right && rect.top < ev.clientY && ev.clientY < rect.bottom))
            return;
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;
        if (Math.abs(mousedownxy.x - x) > 5 || Math.abs(mousedownxy.y - y) > 5) {
            // 有移动鼠标，无效点击
            return;
        }
        var index = findPoint(x, y);
        if (index % 3 == 0) {
            deletePoint(index);
        }
        else if (index == -1) {
            // 没有选中关键与控制点时，检查是否点击到曲线
            var curveIndex = findCurve(x, y);
            if (curveIndex != -1) {
                addPointAtCurve(curveIndex, x, y);
            }
            else {
                addPoint(x, y);
            }
        }
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    }
    function findPoint(x, y) {
        for (var i = 0; i < xs.length; i++) {
            if (Math.abs(xs[i] - x) < pointSize / 2 && Math.abs(ys[i] - y) < pointSize / 2) {
                return i;
            }
        }
        return -1;
    }
    /**
     * 查找点所在的曲线
     * @param x x坐标
     * @param y y坐标
     */
    function findCurve(x, y) {
        for (var i = 0, n = xs.length / 3; i < n; i++) {
            // 使用 bezierCurve 进行采样曲线点
            if (i > 0) {
                var sxs = xs.slice(i * 3 - 3, i * 3 + 1);
                var sys = ys.slice(i * 3 - 3, i * 3 + 1);
                // 先在曲线上找到y再比较x
                var yTs = bezier.getTFromValue(y, sys);
                for (var j = 0; j < yTs.length; j++) {
                    var xv = bezier.getValue(yTs[j], sxs);
                    if (Math.abs(xv - x) < pointSize / 2) {
                        return i;
                    }
                }
                // 先在曲线上找到x再比较y
                var xTs = bezier.getTFromValue(x, sxs);
                for (var j = 0; j < xTs.length; j++) {
                    var yv = bezier.getValue(xTs[j], sys);
                    if (Math.abs(yv - y) < pointSize / 2) {
                        return i;
                    }
                }
            }
        }
        return -1;
    }
    function deletePoint(index) {
        if (index == 0) {
            xs.splice(index, 3);
            ys.splice(index, 3);
        }
        else if (index == xs.length - 1) {
            xs.splice(index - 2, 3);
            ys.splice(index - 2, 3);
        }
        else {
            xs.splice(index - 1, 3);
            ys.splice(index - 1, 3);
        }
    }
    function addPoint(x, y) {
        if (xs.length > 0) {
            var lastx = xs[xs.length - 1];
            var lasty = ys[ys.length - 1];
            // 自动新增两个控制点
            var cx0 = bezier.linear(1 / 3, lastx, x);
            var cy0 = bezier.linear(1 / 3, lasty, y);
            if (xs.length - 2 > -1) {
                cx0 = lastx * 2 - xs[xs.length - 2];
                cy0 = lasty * 2 - ys[ys.length - 2];
            }
            var cx1 = bezier.linear(2 / 3, cx0, x);
            var cy1 = bezier.linear(2 / 3, cy0, y);
            //
            xs.push(cx0, cx1, x);
            ys.push(cy0, cy1, y);
        }
        else {
            xs.push(x);
            ys.push(y);
        }
    }
    /**
     * 在指定曲线上添加点
     * @param curveIndex 曲线编号
     * @param x x坐标
     * @param y y坐标
     */
    function addPointAtCurve(curveIndex, x, y) {
        // 左控制点
        var lx = bezier.linear(2 / 3, xs[curveIndex * 3 - 2], x);
        var ly = bezier.linear(2 / 3, ys[curveIndex * 3 - 2], y);
        // 右控制点
        var rx = bezier.linear(2 / 3, xs[curveIndex * 3 - 1], x);
        var ry = bezier.linear(2 / 3, ys[curveIndex * 3 - 1], y);
        //
        xs.splice(curveIndex * 3 - 1, 0, lx, x, rx);
        ys.splice(curveIndex * 3 - 1, 0, ly, y, ry);
    }
    requestAnimationFrame(draw);
    function draw() {
        clearCanvas(canvas);
        for (var i = 0, n = xs.length / 3; i < n; i++) {
            // 使用 bezierCurve 进行采样曲线点
            if (i > 0) {
                var sxs = xs.slice(i * 3 - 3, i * 3 + 1);
                var sys = ys.slice(i * 3 - 3, i * 3 + 1);
                var xSamples = bezier.getSamples(sxs);
                var ySamples = bezier.getSamples(sys);
                // 绘制曲线
                drawPointsCurve(canvas, xSamples, ySamples, 'white', 3);
            }
            // 绘制曲线端点
            drawPoints(canvas, xs.slice(i * 3, i * 3 + 1), ys.slice(i * 3, i * 3 + 1), "red", pointSize);
            // 绘制控制点
            if (i > 0)
                drawPoints(canvas, xs.slice(i * 3 - 1, i * 3 + 0), ys.slice(i * 3 - 1, i * 3 + 0), "blue", pointSize);
            if (i < n - 1)
                drawPoints(canvas, xs.slice(i * 3 + 1, i * 3 + 2), ys.slice(i * 3 + 1, i * 3 + 2), "blue", pointSize);
            // 绘制控制点之间的连线
            if (i > 0)
                drawPointsCurve(canvas, xs.slice(i * 3 - 1, i * 3 + 1), ys.slice(i * 3 - 1, i * 3 + 1), "yellow", 1);
            if (i < n - 1)
                drawPointsCurve(canvas, xs.slice(i * 3 + 0, i * 3 + 2), ys.slice(i * 3 + 0, i * 3 + 2), "yellow", 1);
        }
        //
        requestAnimationFrame(draw);
    }
})();
//# sourceMappingURL=CubicBezierSequenceEditor.js.map