QUnit.module("BezierCurve", () =>
{
    // 允许误差
    var deviation = 0.0000001;

    QUnit.test("bn linear", (assert) =>
    {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        var v0 = bezierCurve.linear(t, ps[0], ps[1]);
        var v1 = bezierCurve.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);
    });

    QUnit.test("bn quadratic", (assert) =>
    {
        // 二次Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        var v0 = bezierCurve.quadratic(t, ps[0], ps[1], ps[2]);
        var v1 = bezierCurve.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);
    });

    QUnit.test("bn cubic", (assert) =>
    {
        // 立方Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        var v0 = bezierCurve.cubic(t, ps[0], ps[1], ps[2], ps[3]);
        var v1 = bezierCurve.bn(t, ps);

        assert.ok(Math.abs(v0 - v1) < deviation);

        var v2 = bezierCurve.getValue(t, ps);
        assert.ok(Math.abs(v0 - v2) < deviation);
    });

    QUnit.test("bnD linearDerivative", (assert) =>
    {

        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random()];

        // 导数
        var d0 = bezierCurve.linearDerivative(t, ps[0], ps[1]);
        var d1 = bezierCurve.bnDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });

    QUnit.test("bnD quadraticDerivative", (assert) =>
    {

        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];

        // 导数
        var d0 = bezierCurve.quadraticDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezierCurve.bnDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });

    QUnit.test("bnD cubicDerivative", (assert) =>
    {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];

        // 导数
        var d0 = bezierCurve.cubicDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezierCurve.bnDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });

    QUnit.test("bnSD linearSecondDerivative", (assert) =>
    {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random()];

        // 导数
        var d0 = bezierCurve.linearSecondDerivative(t, ps[0], ps[1]);
        var d1 = bezierCurve.bnSecondDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });

    QUnit.test("bnSD quadraticSecondDerivative", (assert) =>
    {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];

        // 导数
        var d0 = bezierCurve.quadraticSecondDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezierCurve.bnSecondDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });

    QUnit.test("bnSD cubicSecondDerivative", (assert) =>
    {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];

        // 导数
        var d0 = bezierCurve.cubicSecondDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezierCurve.bnSecondDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });

    QUnit.test("bnND linearDerivative", (assert) =>
    {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random()];

        // 导数
        var d0 = bezierCurve.linearDerivative(t, ps[0], ps[1]);
        var d1 = bezierCurve.bnND(t, 1, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });

    QUnit.test("bnND quadraticDerivative", (assert) =>
    {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];

        // 导数
        var d0 = bezierCurve.quadraticDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezierCurve.bnND(t, 1, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });

    QUnit.test("bnND cubicDerivative", (assert) =>
    {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];

        // 导数
        var d0 = bezierCurve.cubicDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezierCurve.bnND(t, 1, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });

    QUnit.test("bnND linearSecondDerivative", (assert) =>
    {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random()];

        // 导数
        var d0 = bezierCurve.linearSecondDerivative(t, ps[0], ps[1]);
        var d1 = bezierCurve.bnND(t, 2, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });

    QUnit.test("bnND quadraticSecondDerivative", (assert) =>
    {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];

        // 导数
        var d0 = bezierCurve.quadraticSecondDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezierCurve.bnND(t, 2, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });

    QUnit.test("bnND cubicSecondDerivative", (assert) =>
    {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];

        // 导数
        var d0 = bezierCurve.cubicSecondDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezierCurve.bnND(t, 2, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });

    QUnit.test("getTAtExtremums", (assert) =>
    {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];

        // 查找区间内极值所在插值度列表
        var extremumXs = bezierCurve.getTAtExtremums(ps);
        for (let i = 0, n = extremumXs.length; i < n; i++)
        {
            // 极值
            var extremum = bezierCurve.getValue(extremumXs[i], ps);
            // 极值前面的数据
            var prex = extremumXs[i] - 0.001;
            if (0 < i) prex = bezierCurve.linear(0.999, extremumXs[i - 1], extremumXs[i]);
            var prev = bezierCurve.getValue(prex, ps);
            // 极值后面面的数据
            var nextx = extremumXs[i] + 0.001;
            if (i < n - 1) nextx = bezierCurve.linear(0.001, extremumXs[i], extremumXs[i + 1]);
            var nextv = bezierCurve.getValue(nextx, ps);
            // 斜率
            var derivative = bezierCurve.getDerivative(extremumXs[i], ps);
            assert.ok(Math.abs(derivative) < deviation, `斜率： ${derivative} \n 前面值： ${prev} \n 极值： ${extremum} \n 后面的值 ${nextv}`);
        }
        if (extremumXs.length == 0)
        {
            assert.ok(true, "该区间内没有极值")
        }
    });

    QUnit.test("getTFromValue", (assert) =>
    {
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        var targetV = Math.random();

        var ts = bezierCurve.getTFromValue(targetV, ps);
        if (ts.length > 0)
        {
            for (let i = 0; i < ts.length; i++)
            {
                var tv = bezierCurve.getValue(ts[i], ps);
                assert.ok(Math.abs(tv - targetV) < deviation, `目标值：${targetV} 查找到的值：${tv} 查找到的位置：${ts[i]}`);
            }
        } else
        {
            assert.ok(true, `该区间内没有找到目标值！`)
        }
    });
});