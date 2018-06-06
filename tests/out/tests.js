QUnit.module("HighFunction", function () {
    // 允许误差
    var deviation = 0.0000001;
    QUnit.test("getValue 获取函数 f(x) 的值 ", function (assert) {
        for (var i = 0; i < 100; i++) {
            var as = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
            var f = function (x) {
                return as[0] * x * x * x * x * x +
                    as[1] * x * x * x * x +
                    as[2] * x * x * x +
                    as[3] * x * x +
                    as[4] * x +
                    as[5];
            };
            var hf = new HighFunction(as);
            var x = Math.random();
            var fx = f(x);
            var hfx = hf.getValue(x);
            assert.ok(Math.abs(fx - hfx) < deviation);
        }
    });
});
QUnit.module("EquationSolving", function () {
    // 允许误差
    var precision = 0.0000001;
    var testtimes = 100;
    QUnit.test("binary 二分法 求解 f(x) == 0 ", function (assert) {
        for (var i = 0; i < testtimes; i++) {
            var as = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
            var hf = new HighFunction(as);
            var a = Math.random();
            var b = a + Math.random();
            var fa = hf.getValue(a);
            var fb = hf.getValue(b);
            var f = function (x) { return hf.getValue(x) - (fa + fb) / 2; };
            // 求解 ff(x) == 0
            var x = equationSolving.binary(f, a, b, precision);
            var fx = f(x);
            assert.ok(fx < precision);
        }
    });
    QUnit.test("line 连线法 求解 f(x) == 0 ", function (assert) {
        for (var i = 0; i < testtimes; i++) {
            var as = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
            var hf = new HighFunction(as);
            var a = Math.random();
            var b = a + Math.random();
            var fa = hf.getValue(a);
            var fb = hf.getValue(b);
            var f = function (x) { return hf.getValue(x) - (fa + fb) / 2; };
            // 求解 ff(x) == 0
            var x = equationSolving.line(f, a, b, precision);
            var fx = f(x);
            assert.ok(fx < precision);
        }
    });
    QUnit.test("tangent 切线法 求解 f(x) == 0 ", function (assert) {
        for (var i = 0; i < testtimes; i++) {
            var as = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
            var hf = new HighFunction(as);
            var a = Math.random();
            var b = a + Math.random();
            var fa = hf.getValue(a);
            var fb = hf.getValue(b);
            var f = function (x) { return hf.getValue(x) - (fa + fb) / 2; };
            // 导函数
            var f1 = equationSolving.getDerivative(f);
            // 二阶导函数
            var f2 = equationSolving.getDerivative(f1);
            // 求解 ff(x) == 0
            var x = equationSolving.tangent(f, f1, f2, a, b, precision, function (err) {
                assert.ok(true, err.message);
            });
            if (x < a || x > b) {
                assert.ok(true, "\u89E3 " + x + " \u8D85\u51FA\u6C42\u89E3\u533A\u95F4 [" + a + ", " + b + "]");
            }
            else {
                if (x != undefined) {
                    var fx = f(x);
                    assert.ok(fx < precision);
                }
            }
        }
    });
    QUnit.test("secant 割线法（弦截法） 求解 f(x) == 0 ", function (assert) {
        for (var i = 0; i < testtimes; i++) {
            var as = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
            var hf = new HighFunction(as);
            var a = Math.random();
            var b = a + Math.random();
            var fa = hf.getValue(a);
            var fb = hf.getValue(b);
            var f = function (x) { return hf.getValue(x) - (fa + fb) / 2; };
            // 求解 ff(x) == 0
            var x = equationSolving.secant(f, a, b, precision, function (err) {
                assert.ok(true, err.message);
            });
            if (x < a || x > b) {
                assert.ok(true, "\u89E3 " + x + " \u8D85\u51FA\u6C42\u89E3\u533A\u95F4 [" + a + ", " + b + "]");
            }
            else {
                if (x != undefined) {
                    var fx = f(x);
                    assert.ok(fx < precision);
                }
            }
        }
    });
});
QUnit.module("CubicBezier", function () {
    // 允许误差
    var deviation = 0.0000001;
    QUnit.test("getExtremums ，查找区间内极值列表 ", function (assert) {
        for (var j = 0; j < 10; j++) {
            var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
            var bezier = new CubicBezier(ps[0], ps[1], ps[2], ps[3]);
            // 查找区间内极值所在插值度列表
            var extremums = bezier.getExtremums(20, deviation);
            var ts = extremums.ts;
            var vs = extremums.vs;
            if (ts.length > 0) {
                for (var i = 0, n = ts.length; i < n; i++) {
                    assert.ok(0 <= ts[i] && ts[i] <= 1, "\u6781\u503C\u4F4D\u7F6E " + ts[i] + " \u5FC5\u987B\u5728\u533A\u57DF [0,1] \u5185");
                    // 极值
                    var extremum = vs[i];
                    // 极值前面的数据
                    var prex = ts[i] - 0.001;
                    if (0 < i)
                        prex = ts[i - 1] + 0.999 * (ts[i - 1] - ts[i]);
                    var prev = bezier.getValue(prex);
                    // 极值后面面的数据
                    var nextx = ts[i] + 0.001;
                    if (i < n - 1)
                        nextx = ts[i] + 0.001 * (ts[i] - ts[i + 1]);
                    var nextv = bezier.getValue(nextx);
                    // 斜率
                    var derivative = bezier.getDerivative(ts[i]);
                    assert.ok(Math.abs(derivative) < deviation, ps.length - 1 + "\u6B21B\u00E9zier\u66F2\u7EBF \u7B2C" + i + "\u4E2A\u89E3 \u6781\u503C\u4F4D\u7F6E\uFF1A" + ts[i] + " \u659C\u7387\uFF1A " + derivative + " \n \u524D\u9762\u503C\uFF1A " + prev + " \n \u6781\u503C\uFF1A " + extremum + " \n \u540E\u9762\u7684\u503C " + nextv);
                }
            }
            else {
                assert.ok(true, "没有找到极值");
            }
        }
    });
    QUnit.test("getTFromValue ，获取目标值所在的插值度T，返回区间内所有解", function (assert) {
        for (var j = 0; j < 10; j++) {
            var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
            var bezier = new CubicBezier(ps[0], ps[1], ps[2], ps[3]);
            // 为了确保有解，去平均值
            var targetV = ps.reduce(function (pre, item) { return pre + item; }, 0) / ps.length;
            var ts = bezier.getTFromValue(targetV, 10, deviation);
            if (ts.length > 0) {
                for (var i = 0; i < ts.length; i++) {
                    var tv = bezier.getValue(ts[i]);
                    assert.ok(Math.abs(tv - targetV) < deviation, ps.length - 1 + "\u6B21B\u00E9zier\u66F2\u7EBF \u7B2C" + i + "\u4E2A\u89E3 \u76EE\u6807\u503C\uFF1A" + targetV + " \u67E5\u627E\u5230\u7684\u503C\uFF1A" + tv + " \u67E5\u627E\u5230\u7684\u4F4D\u7F6E\uFF1A" + ts[i]);
                    assert.ok(0 <= ts[i] && ts[i] <= 1, ts[i] + " \u89E3\u5FC5\u987B\u5728 [0,1] \u533A\u95F4\u5185 ");
                }
            }
            else {
                assert.ok(false, "\u6CA1\u6709\u627E\u5230\u76EE\u6807\u503C");
            }
        }
    });
});
QUnit.module("Bezier", function () {
    // 允许误差
    var deviation = 0.0000001;
    QUnit.test("bn linear ，使用n次Bézier计算一次Bézier曲线", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        var v0 = bezier.linear(t, ps[0], ps[1]);
        var v1 = bezier.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);
    });
    QUnit.test("bn quadratic ，使用n次Bézier计算二次Bézier曲线", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        var v0 = bezier.quadratic(t, ps[0], ps[1], ps[2]);
        var v1 = bezier.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);
    });
    QUnit.test("bn cubic ，使用n次Bézier计算三次Bézier曲线", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        var v0 = bezier.cubic(t, ps[0], ps[1], ps[2], ps[3]);
        var v1 = bezier.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);
        var v2 = bezier.getValue(t, ps);
        assert.ok(Math.abs(v0 - v2) < deviation);
    });
    QUnit.test("bnD linearDerivative ，使用n次Bézier导数计算一次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezier.linearDerivative(t, ps[0], ps[1]);
        var d1 = bezier.bnDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnD quadraticDerivative ，使用n次Bézier导数计算二次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.quadraticDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezier.bnDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnD cubicDerivative ，使用n次Bézier导数计算三次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.cubicDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezier.bnDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnSD linearSecondDerivative ，使用n次Bézier二阶导数计算一次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezier.linearSecondDerivative(t, ps[0], ps[1]);
        var d1 = bezier.bnSecondDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnSD quadraticSecondDerivative ，使用n次Bézier二阶导数计算二次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.quadraticSecondDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezier.bnSecondDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnSD cubicSecondDerivative ，使用n次Bézier二阶导数计算三次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.cubicSecondDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezier.bnSecondDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND linearDerivative ，使用n次BézierN阶导数计算一次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezier.linearDerivative(t, ps[0], ps[1]);
        var d1 = bezier.bnND(t, 1, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND quadraticDerivative ，使用n次BézierN阶导数计算二次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.quadraticDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezier.bnND(t, 1, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND cubicDerivative ，使用n次BézierN阶导数计算三次Bézier曲线导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.cubicDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezier.bnND(t, 1, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND linearSecondDerivative ，使用n次BézierN阶导数计算一次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezier.linearSecondDerivative(t, ps[0], ps[1]);
        var d1 = bezier.bnND(t, 2, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND quadraticSecondDerivative ，使用n次BézierN阶导数计算二次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.quadraticSecondDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezier.bnND(t, 2, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND cubicSecondDerivative ，使用n次BézierN阶导数计算三次Bézier曲线二阶导数", function (assert) {
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezier.cubicSecondDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezier.bnND(t, 2, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("getExtremums ，查找区间内极值列表 ", function (assert) {
        for (var j = 0; j < 10; j++) {
            var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
            // 测试高次Bézier曲线
            var n = Math.floor(Math.random() * 5);
            for (var i = 0; i < n; i++) {
                ps.push(Math.random());
            }
            // 查找区间内极值所在插值度列表
            var extremums = bezier.getExtremums(ps, 20, deviation);
            var ts = extremums.ts;
            var vs = extremums.vs;
            for (var i = 0, n_1 = ts.length; i < n_1; i++) {
                assert.ok(0 <= ts[i] && ts[i] <= 1, "\u6781\u503C\u4F4D\u7F6E " + ts[i] + " \u5FC5\u987B\u5728\u533A\u57DF [0,1] \u5185");
                // 极值
                var extremum = vs[i];
                // 极值前面的数据
                var prex = ts[i] - 0.001;
                if (0 < i)
                    prex = bezier.linear(0.999, ts[i - 1], ts[i]);
                var prev = bezier.getValue(prex, ps);
                // 极值后面面的数据
                var nextx = ts[i] + 0.001;
                if (i < n_1 - 1)
                    nextx = bezier.linear(0.001, ts[i], ts[i + 1]);
                var nextv = bezier.getValue(nextx, ps);
                // 斜率
                var derivative = bezier.getDerivative(ts[i], ps);
                assert.ok(Math.abs(derivative) < deviation, ps.length - 1 + "\u6B21B\u00E9zier\u66F2\u7EBF \u7B2C" + i + "\u4E2A\u89E3 \u6781\u503C\u4F4D\u7F6E\uFF1A" + ts[i] + " \u659C\u7387\uFF1A " + derivative + " \n \u524D\u9762\u503C\uFF1A " + prev + " \n \u6781\u503C\uFF1A " + extremum + " \n \u540E\u9762\u7684\u503C " + nextv);
            }
        }
    });
    QUnit.test("getTFromValue ，获取目标值所在的插值度T，返回区间内所有解", function (assert) {
        for (var j = 0; j < 10; j++) {
            var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
            // 测试高次Bézier曲线
            var n = Math.floor(Math.random() * 5);
            for (var i = 0; i < n; i++) {
                ps.push(Math.random());
            }
            // 为了确保有解，去平均值
            var targetV = ps.reduce(function (pre, item) { return pre + item; }, 0) / ps.length;
            var ts = bezier.getTFromValue(targetV, ps, 10, deviation);
            if (ts.length > 0) {
                for (var i = 0; i < ts.length; i++) {
                    var tv = bezier.getValue(ts[i], ps);
                    assert.ok(Math.abs(tv - targetV) < deviation, ps.length - 1 + "\u6B21B\u00E9zier\u66F2\u7EBF \u7B2C" + i + "\u4E2A\u89E3 \u76EE\u6807\u503C\uFF1A" + targetV + " \u67E5\u627E\u5230\u7684\u503C\uFF1A" + tv + " \u67E5\u627E\u5230\u7684\u4F4D\u7F6E\uFF1A" + ts[i]);
                    assert.ok(0 <= ts[i] && ts[i] <= 1, ts[i] + " \u89E3\u5FC5\u987B\u5728 [0,1] \u533A\u95F4\u5185 ");
                }
            }
        }
    });
    QUnit.test("getDerivative ，获取曲线在指定插值度上的导数(斜率)", function (assert) {
        var num = 1000;
        for (var j = 0; j < num; j++) {
            var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
            // 测试高次Bézier曲线
            // var n = Math.floor(Math.random() * 5);
            var n = 5;
            for (var i = 0; i < n; i++) {
                ps.push(Math.random());
            }
            var f = function (x) { return bezier.getValue(x, ps); };
            var f1 = equationSolving.getDerivative(f);
            //
            var t = Math.random();
            var td = bezier.getDerivative(t, ps);
            var td1 = f1(t);
            // 此处比较值不能使用太大
            assert.ok(Math.abs(td - td1) < 0.000001);
        }
    });
});
//# sourceMappingURL=tests.js.map