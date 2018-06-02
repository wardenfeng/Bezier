QUnit.module("BezierCurve", () =>
{
    QUnit.test("bn", (assert) =>
    {

        var t = Math.random();
        var ps = [Math.random(), Math.random()];

        var v0 = bezierCurve.linear(t, ps[0], ps[1]);
        var v1 = bezierCurve.bn(t, ps);

        assert.equal(v0, v1);

    });
});