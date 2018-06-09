(function () {
    // 基于时间的连续三阶Bézier曲线编辑，意味着一个x对应唯一的y
    // 创建画布
    var canvas = createCanvas(0, 60, window.innerWidth, window.innerHeight - 60);
    // window.addEventListener("click", onMouseClick)
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("dblclick", ondblclick);
    /**
     * 点绘制尺寸
     */
    var pointSize = 16;
    /**
     * 控制柄长度
     */
    var controllerLength = 100;
    /**
     * 最大tan值，超出该值后将会变成分段
     */
    var maxtan = 1000;
    // 第一条曲线  [0,3] 
    // 第二条曲线  [3,6] 
    var keys = [];
    keys.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, tan: 0 });
    var editKey;
    var controlkey;
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
        editKey = findPoint(x, y);
        if (editKey == null) {
            controlkey = findControlPoint(x, y);
        }
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }
    function onMouseMove(ev) {
        if (editKey == null && controlkey == null)
            return;
        editing = true;
        var rect = canvas.getBoundingClientRect();
        if (!(rect.left < ev.clientX && ev.clientX < rect.right && rect.top < ev.clientY && ev.clientY < rect.bottom))
            return;
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;
        if (editKey) {
            editKey.x = x;
            editKey.y = y;
        }
        else if (controlkey) {
            var index = keys.indexOf(controlkey);
            if (index == 0 && x < controlkey.x)
                return;
            if (index == keys.length - 1 && x > controlkey.x)
                return;
            controlkey.tan = (y - controlkey.y) / (x - controlkey.x);
        }
    }
    function onMouseUp(ev) {
        editing = false;
        editKey = null;
        controlkey = null;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    }
    function ondblclick(ev) {
        editing = false;
        editKey = null;
        controlkey = null;
        var rect = canvas.getBoundingClientRect();
        if (!(rect.left < ev.clientX && ev.clientX < rect.right && rect.top < ev.clientY && ev.clientY < rect.bottom))
            return;
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;
        var selectedKey = findPoint(x, y);
        if (selectedKey != null) {
            deletePoint(selectedKey);
        }
        else {
            // 没有选中关键与控制点时，检查是否点击到曲线
            var result = addPoint(x, y);
        }
    }
    function findPoint(x, y) {
        for (var i = 0; i < keys.length; i++) {
            if (Math.abs(keys[i].x - x) < pointSize / 2 && Math.abs(keys[i].y - y) < pointSize / 2) {
                return keys[i];
            }
        }
        return null;
    }
    function findControlPoint(x, y) {
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var lcp = { x: key.x - controllerLength * Math.cos(Math.atan(key.tan)), y: key.y - controllerLength * Math.sin(Math.atan(key.tan)) };
            if (Math.abs(lcp.x - x) < pointSize / 2 && Math.abs(lcp.y - y) < pointSize / 2) {
                return key;
            }
            var rcp = { x: key.x + controllerLength * Math.cos(Math.atan(key.tan)), y: key.y + controllerLength * Math.sin(Math.atan(key.tan)) };
            if (Math.abs(rcp.x - x) < pointSize / 2 && Math.abs(rcp.y - y) < pointSize / 2) {
                return key;
            }
        }
        return null;
    }
    /**
     * 点击曲线添加关键点
     * @param x x坐标
     * @param y y坐标
     */
    function addPoint(x, y) {
        for (var i = 0, n = keys.length; i < n; i++) {
            // 使用 bezierCurve 进行采样曲线点
            var key = keys[i];
            var prekey = keys[i - 1];
            if (i > 0 && prekey.x < x && x < key.x) {
                var xstart = prekey.x;
                var ystart = prekey.y;
                var tanstart = prekey.tan;
                var xend = key.x;
                var yend = key.y;
                var tanend = key.tan;
                if (maxtan > Math.abs(tanstart) && maxtan > Math.abs(tanend)) {
                    var t = (x - prekey.x) / (key.x - prekey.x);
                    var sys = [ystart, ystart + tanstart * (xend - xstart) / 3, yend - tanend * (xend - xstart) / 3, yend];
                    var fy = bezier.getValue(t, sys);
                    if (Math.abs(fy - y) < pointSize / 2) {
                        var result = { x: x, y: fy, tan: bezier.getDerivative(t, sys) / (xend - xstart) };
                        keys.push(result);
                        return result;
                    }
                }
                else {
                    // 
                    if (Math.abs(y - prekey.y) < pointSize / 2) {
                        var result = { x: x, y: prekey.y, tan: 0 };
                        keys.push(result);
                        return result;
                    }
                }
            }
            if (i == 0 && x < key.x && Math.abs(y - key.y) < pointSize / 2) {
                var result = { x: x, y: key.y, tan: 0 };
                keys.push(result);
                return result;
            }
            if (i == n - 1 && x > key.x && Math.abs(y - key.y) < pointSize / 2) {
                var result = { x: x, y: key.y, tan: 0 };
                keys.push(result);
                return result;
            }
        }
        return null;
    }
    function deletePoint(key) {
        var index = keys.indexOf(key);
        keys.splice(index, 1);
    }
    requestAnimationFrame(draw);
    function draw() {
        clearCanvas(canvas);
        keys.sort(function (a, b) { return a.x - b.x; });
        for (var i = 0, n = keys.length; i < n; i++) {
            var key = keys[i];
            // 使用 bezierCurve 进行采样曲线点
            if (i > 0) {
                var prekey = keys[i - 1];
                var xstart = prekey.x;
                var ystart = prekey.y;
                var tanstart = prekey.tan;
                var xend = key.x;
                var yend = key.y;
                var tanend = key.tan;
                if (maxtan > Math.abs(tanstart) && maxtan > Math.abs(tanend)) {
                    var sys = [ystart, ystart + tanstart * (xend - xstart) / 3, yend - tanend * (xend - xstart) / 3, yend];
                    var numSamples = 100;
                    var ySamples = bezier.getSamples(sys, numSamples);
                    var xSamples = ySamples.map(function (v, i) { return xstart + (xend - xstart) * i / numSamples; });
                    // 绘制曲线
                    drawPointsCurve(canvas, xSamples, ySamples, 'white', 3);
                }
                else {
                    // 绘制直线
                    drawPointsCurve(canvas, [xstart, xend, xend], [ystart, ystart, yend], 'white', 3);
                }
            }
            // 绘制曲线端点
            drawPoints(canvas, [key.x], [key.y], "red", pointSize);
            if (i == 0) {
                drawPointsCurve(canvas, [0, key.x], [key.y, key.y], 'white', 3);
            }
            if (i == n - 1) {
                drawPointsCurve(canvas, [key.x, canvas.width], [key.y, key.y], 'white', 3);
            }
            // 绘制控制点
            if (i > 0) {
                // 左边控制点
                var lcp = { x: key.x - controllerLength * Math.cos(Math.atan(key.tan)), y: key.y - controllerLength * Math.sin(Math.atan(key.tan)) };
                drawPoints(canvas, [lcp.x], [lcp.y], "blue", pointSize);
                drawPointsCurve(canvas, [key.x, lcp.x], [key.y, lcp.y], "yellow", 1);
            }
            if (i < n - 1) {
                var rcp = { x: key.x + controllerLength * Math.cos(Math.atan(key.tan)), y: key.y + controllerLength * Math.sin(Math.atan(key.tan)) };
                drawPoints(canvas, [rcp.x], [rcp.y], "blue", pointSize);
                drawPointsCurve(canvas, [key.x, rcp.x], [key.y, rcp.y], "yellow", 1);
            }
        }
        //
        requestAnimationFrame(draw);
    }
})();
//# sourceMappingURL=TimeNumberCubicBezierSequenceEditor.js.map