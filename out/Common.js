function createCanvas(x, y, width, height) {
    if (x === void 0) { x = 0; }
    if (y === void 0) { y = 0; }
    if (width === void 0) { width = 100; }
    if (height === void 0) { height = 100; }
    var canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.left = x + "px";
    canvas.style.top = y + "px";
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    return canvas;
}
/**
 * 清理画布
 * @param canvas 画布
 */
function clearCanvas(canvas, fillStyle) {
    if (fillStyle === void 0) { fillStyle = 'brack'; }
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制背景
    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
/**
 * 绘制曲线
 * @param canvas 画布
 * @param points 曲线上的点
 * @param strokeStyle 曲线颜色
 */
function drawPointsCurve(canvas, xpoints, ypoints, strokeStyle, lineWidth) {
    if (strokeStyle === void 0) { strokeStyle = 'white'; }
    if (lineWidth === void 0) { lineWidth = 3; }
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(xpoints[0], ypoints[0]);
    for (var i = 1; i < xpoints.length; i++) {
        ctx.lineTo(xpoints[i], ypoints[i]);
    }
    ctx.stroke();
}
function drawBezierCurve(canvas, xpoints, ypoints, strokeStyle, lineWidth) {
    if (strokeStyle === void 0) { strokeStyle = 'white'; }
    if (lineWidth === void 0) { lineWidth = 3; }
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(xpoints[0], ypoints[0]);
    ctx.bezierCurveTo(xpoints[1], ypoints[1], xpoints[2], ypoints[2], xpoints[3], ypoints[3]);
    ctx.stroke();
}
//# sourceMappingURL=Common.js.map