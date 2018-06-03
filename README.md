### Bézier曲线
https://wardenfeng.github.io/bezier

#### 核心文件
1. [Bezier.ts](src/math/Bezier.ts) 
1. [Bezier.d.ts](out/math/Bezier.d.ts) 

#### 立方Bézier曲线 [CubicBezier.ts](src/math/CubicBezier.ts)
CubicBezier是最常用到的Bézier曲线，为了提升性能以及简化接口单独从Bezier.ts提取出来。

#### Bezier.ts 解决的问题
1. 1次Bézier曲线 
    * 求值 ``` bezier.linear ```
    * 导数 ``` bezier.linearDerivative ```
    * 二阶导数 ``` bezier.linearSecondDerivative ```
1. 2次Bézier曲线 
    * 求值 ``` bezier.quadratic ```
    * 导数 ``` bezier.quadraticDerivative ```
    * 二阶导数 ``` bezier.quadraticSecondDerivative ```
1. 3次Bézier曲线 
    * 求值 ``` bezier.cubic ```
    * 导数 ``` bezier.cubicDerivative ```
    * 二阶导数 ``` bezier.cubicSecondDerivative ```
1. n次Bézier曲线的值  n > 0
    * 求值 ``` bezier.getValue ```
    * 导数 ``` bezier.getDerivative ```
    * 二阶导数 ``` bezier.getSecondDerivative ```
    * N阶导数 ``` bezier.bnND ```
1. n次Bézier曲线的极值列表 ``` bezier.getExtremums ```
1. n次Bézier曲线的区间列表 ``` bezier.getMonotoneIntervals ```

#### [单元测试](tests/index.html)

#### [示例]
1. [使用BezierCurve进行模拟canvas提供的 bezierCurveTo方法](BezierTest.html)
```
// 创建画布
var canvas = createCanvas(100, 100, 400, 300);

// 随机生成4个点坐标
var xs = [Math.random(), Math.random(), Math.random(), Math.random()].map(i => i * canvas.width);
var ys = [Math.random(), Math.random(), Math.random(), Math.random()].map(i => (1 - i) * canvas.height);

clearCanvas(canvas);

// 使用 canvas提供的 bezierCurveTo,CanvasRenderingContext2D.bezierCurveTo,CanvasPathMethods.bezierCurveTo 进行绘制曲线
drawBezierCurve(canvas, xs, ys, "red", 15);

// 使用 bezierCurve 进行采样曲线点
var xBezier = new CubicBezierCurve(xs[0], xs[1], xs[2], xs[3]);
var yBezier = new CubicBezierCurve(ys[0], ys[1], ys[2], ys[3]);
var xSamples = xBezier.getSamples();
var ySamples = yBezier.getSamples();
drawPointsCurve(canvas, xSamples, ySamples, "blue", 10);

// 使用 bezierCurve 进行采样曲线点
var xSamples = bezier.getSamples(xs);
var ySamples = bezier.getSamples(ys);
drawPointsCurve(canvas, xSamples, ySamples, "green", 5);
```