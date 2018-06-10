(function () {
    // 基于时间的连续三阶Bézier曲线编辑，意味着一个x对应唯一的y
    // 创建画布
    var canvas = createCanvas(0, 60, window.innerWidth, window.innerHeight - 60);
    var canvaswidth = canvas.width;
    var canvasheight = canvas.height;
    // window.addEventListener("click", onMouseClick)
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("dblclick", ondblclick);
    var timeline = new TimeLineCubicBezierSequence();
    /**
     * 点绘制尺寸
     */
    var pointSize = 16;
    /**
     * 控制柄长度
     */
    var controllerLength = 100;
    //
    timeline.keys.push({ t: Math.random(), y: Math.random(), tan: 0 });
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
        editKey = timeline.findPoint(x / canvaswidth, y / canvasheight, pointSize / canvasheight / 2);
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
            editKey.t = x / canvaswidth;
            editKey.y = y / canvasheight;
        }
        else if (controlkey) {
            var index = timeline.keys.indexOf(controlkey);
            if (index == 0 && x / canvaswidth < controlkey.t) {
                controlkey.tan = y / canvasheight > controlkey.y ? Infinity : -Infinity;
                return;
            }
            if (index == timeline.keys.length - 1 && x / canvaswidth > controlkey.t) {
                controlkey.tan = y / canvasheight > controlkey.y ? -Infinity : Infinity;
                return;
            }
            controlkey.tan = (y / canvasheight - controlkey.y) / (x / canvaswidth - controlkey.t);
        }
    }
    function onMouseUp(ev) {
        editing = false;
        editKey = null;
        controlkey = null;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    }
    function findControlPoint(x, y) {
        var keys = timeline.keys;
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var currentx = key.t * canvaswidth;
            var currenty = key.y * canvasheight;
            var currenttan = key.tan * canvasheight / canvaswidth;
            var lcp = { x: currentx - controllerLength * Math.cos(Math.atan(currenttan)), y: currenty - controllerLength * Math.sin(Math.atan(currenttan)) };
            if (Math.abs(lcp.x - x) < pointSize / 2 && Math.abs(lcp.y - y) < pointSize / 2) {
                return key;
            }
            var rcp = { x: currentx + controllerLength * Math.cos(Math.atan(currenttan)), y: currenty + controllerLength * Math.sin(Math.atan(currenttan)) };
            if (Math.abs(rcp.x - x) < pointSize / 2 && Math.abs(rcp.y - y) < pointSize / 2) {
                return key;
            }
        }
        return null;
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
        var selectedKey = timeline.findPoint(x / canvaswidth, y / canvasheight, pointSize / canvasheight / 2);
        if (selectedKey != null) {
            timeline.deletePoint(selectedKey);
        }
        else {
            // 没有选中关键与控制点时，检查是否点击到曲线
            var result = timeline.addPoint(x / canvaswidth, y / canvasheight, pointSize / 2);
        }
    }
    requestAnimationFrame(draw);
    function draw() {
        clearCanvas(canvas);
        var keys = timeline.keys;
        keys.sort(function (a, b) { return a.t - b.t; });
        for (var i = 0, n = keys.length; i < n; i++) {
            var key = keys[i];
            var currentx = key.t * canvaswidth;
            var currenty = key.y * canvasheight;
            var currenttan = key.tan * canvasheight / canvaswidth;
            // 使用 bezierCurve 进行采样曲线点
            if (i > 0) {
                var prekey = keys[i - 1];
                var prex = prekey.t * canvaswidth;
                var prey = prekey.y * canvasheight;
                var pretan = prekey.tan * canvasheight / canvaswidth;
                if (timeline.maxtan > Math.abs(pretan) && timeline.maxtan > Math.abs(currenttan)) {
                    var sys = [prey, prey + pretan * (currentx - prex) / 3, currenty - currenttan * (currentx - prex) / 3, currenty];
                    var numSamples = 100;
                    var ySamples = bezier.getSamples(sys, numSamples);
                    var xSamples = ySamples.map(function (v, i) { return prex + (currentx - prex) * i / numSamples; });
                    // 绘制曲线
                    drawPointsCurve(canvas, xSamples, ySamples, 'white', 3);
                }
                else {
                    // 绘制直线
                    drawPointsCurve(canvas, [prex, currentx, currentx], [prey, prey, currenty], 'white', 3);
                }
            }
            // 绘制曲线端点
            drawPoints(canvas, [currentx], [currenty], "red", pointSize);
            if (i == 0) {
                drawPointsCurve(canvas, [0, currentx], [currenty, currenty], 'white', 3);
            }
            if (i == n - 1) {
                drawPointsCurve(canvas, [currentx, canvaswidth], [currenty, currenty], 'white', 3);
            }
            // 绘制控制点
            if (i > 0) {
                // 左边控制点
                var lcp = { x: currentx - controllerLength * Math.cos(Math.atan(currenttan)), y: currenty - controllerLength * Math.sin(Math.atan(currenttan)) };
                drawPoints(canvas, [lcp.x], [lcp.y], "blue", pointSize);
            }
            if (i < n - 1) {
                var rcp = { x: currentx + controllerLength * Math.cos(Math.atan(currenttan)), y: currenty + controllerLength * Math.sin(Math.atan(currenttan)) };
                drawPoints(canvas, [rcp.x], [rcp.y], "blue", pointSize);
            }
            // 绘制控制点
            if (i > 0) {
                // 左边控制点
                var lcp = { x: currentx - controllerLength * Math.cos(Math.atan(currenttan)), y: currenty - controllerLength * Math.sin(Math.atan(currenttan)) };
                drawPointsCurve(canvas, [currentx, lcp.x], [currenty, lcp.y], "yellow", 1);
            }
            if (i < n - 1) {
                var rcp = { x: currentx + controllerLength * Math.cos(Math.atan(currenttan)), y: currenty + controllerLength * Math.sin(Math.atan(currenttan)) };
                drawPointsCurve(canvas, [currentx, rcp.x], [currenty, rcp.y], "yellow", 1);
            }
        }
        //
        requestAnimationFrame(draw);
    }
})();
//# sourceMappingURL=TimeLineCubicBezierSequenceEditor.js.map