QUnit.module("CubicBezier", () =>
{
    // 允许误差
    var deviation = 0.0000001;

    QUnit.test("getExtremums ，查找区间内极值列表 ", (assert) =>
    {
        for (let j = 0; j < 10; j++)
        {
            var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
            var bezier = new CubicBezier(ps[0], ps[1], ps[2], ps[3]);

            // 查找区间内极值所在插值度列表
            var extremums = bezier.getExtremums(20, deviation);
            var ts = extremums.ts;
            var vs = extremums.vs;
            if (ts.length > 0)
            {
                for (let i = 0, n = ts.length; i < n; i++)
                {
                    assert.ok(0 <= ts[i] && ts[i] <= 1, `极值位置 ${ts[i]} 必须在区域 [0,1] 内`);
                    // 极值
                    var extremum = vs[i];
                    // 极值前面的数据
                    var prex = ts[i] - 0.001;
                    if (0 < i) prex = ts[i - 1] + 0.999 * (ts[i - 1] - ts[i]);
                    var prev = bezier.getValue(prex);
                    // 极值后面面的数据
                    var nextx = ts[i] + 0.001;
                    if (i < n - 1) nextx = ts[i] + 0.001 * (ts[i] - ts[i + 1]);
                    var nextv = bezier.getValue(nextx);
                    // 斜率
                    var derivative = bezier.getDerivative(ts[i]);
                    assert.ok(Math.abs(derivative) < deviation, `${ps.length - 1}次Bézier曲线 第${i}个解 极值位置：${ts[i]} 斜率： ${derivative} \n 前面值： ${prev} \n 极值： ${extremum} \n 后面的值 ${nextv}`);
                }
            } else
            {
                assert.ok(true, "没有找到极值")
            }
        }
    });

    QUnit.test("getTFromValue ，获取目标值所在的插值度T，返回区间内所有解", (assert) =>
    {
        for (let j = 0; j < 10; j++)
        {
            var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
            var bezier = new CubicBezier(ps[0], ps[1], ps[2], ps[3]);

            // 为了确保有解，去平均值
            var targetV = ps.reduce((pre, item) => pre + item, 0) / ps.length;

            var ts = bezier.getTFromValue(targetV, 10, deviation);
            if (ts.length > 0)
            {
                for (let i = 0; i < ts.length; i++)
                {
                    var tv = bezier.getValue(ts[i]);
                    assert.ok(Math.abs(tv - targetV) < deviation, `${ps.length - 1}次Bézier曲线 第${i}个解 目标值：${targetV} 查找到的值：${tv} 查找到的位置：${ts[i]}`);
                    assert.ok(0 <= ts[i] && ts[i] <= 1, `${ts[i]} 解必须在 [0,1] 区间内 `);
                }
            } else
            {
                assert.ok(false, `没有找到目标值`)
            }
        }
    });
});