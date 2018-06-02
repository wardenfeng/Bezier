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
});