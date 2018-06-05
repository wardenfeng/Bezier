/**
 * 高次函数
 *
 * 处理N次函数定义，求值，方程求解问题
 *
 * n次函数定义
 * f(x) = a0 * pow(x, n) + a1 * pow(x, n - 1) +.....+ an_1 * pow(x, 1) + an
 *
 * 0次 f(x) = a0;
 * 1次 f(x) = a0 * x + a1;
 * 2次 f(x) = a0 * x * x + a1 * x + a2;
 * ......
 *
 * @author feng / http://feng3d.com 05/06/2018
 */
var HighFunction = /** @class */ (function () {
    /**
     * 构建函数
     * @param as 函数系数 a0-an 数组
     */
    function HighFunction(as) {
        this.as = as;
    }
    /**
     * 获取函数 f(x) 的值
     * @param x x坐标
     */
    HighFunction.prototype.getValue = function (x) {
        var v = 0;
        var as = this.as;
        for (var i = 0, n = as.length; i < n; i++) {
            v = v * x + as[i];
        }
        return v;
    };
    return HighFunction;
}());
//# sourceMappingURL=HighFunction.js.map