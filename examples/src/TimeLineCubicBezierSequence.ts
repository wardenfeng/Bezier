interface TimeLineCubicBezierKey
{
    /**
     * 时间轴的位置 [0,1]
     */
    t: number
    /**
     * 值 [0,1]
     */
    y: number
    /**
     * 斜率
     */
    tan: number
}

/**
 * 基于时间轴的连续三阶Bézier曲线
 * 
 * @author feng / http://feng3d.com 10/06/2018
 */
class TimeLineCubicBezierSequence
{
    /**
     * 最大tan值，超出该值后将会变成分段
     */
    maxtan = 1000;

    keys: TimeLineCubicBezierKey[] = [];

    findPoint(x: number, y: number, precision: number)
    {
        var keys = this.keys;
        for (let i = 0; i < keys.length; i++)
        {
            if (Math.abs(keys[i].t - x) < precision && Math.abs(keys[i].y - y) < precision)
            {
                return keys[i];
            }
        }
        return null;
    }

    /**
     * 点击曲线添加关键点
     * @param x x坐标
     * @param y y坐标
     */
    addPoint(x: number, y: number, precision: number)
    {
        var keys = this.keys;
        var maxtan = this.maxtan;
        for (let i = 0, n = keys.length; i < n; i++)
        {
            // 使用 bezierCurve 进行采样曲线点
            var key = keys[i];
            var prekey = keys[i - 1];
            if (i > 0 && prekey.t < x && x < key.t)
            {
                var xstart = prekey.t;
                var ystart = prekey.y;
                var tanstart = prekey.tan;
                var xend = key.t;
                var yend = key.y;
                var tanend = key.tan;
                if (maxtan > Math.abs(tanstart) && maxtan > Math.abs(tanend))
                {
                    var t = (x - prekey.t) / (key.t - prekey.t);
                    var sys = [ystart, ystart + tanstart * (xend - xstart) / 3, yend - tanend * (xend - xstart) / 3, yend];
                    var fy = bezier.getValue(t, sys);
                    if (Math.abs(fy - y) < precision)
                    {
                        var result = { t: x, y: fy, tan: bezier.getDerivative(t, sys) / (xend - xstart) };
                        keys.push(result);
                        return result;
                    }
                } else
                {
                    // 
                    if (Math.abs(y - prekey.y) < precision)
                    {
                        var result = { t: x, y: prekey.y, tan: 0 };
                        keys.push(result);
                        return result;
                    }
                }
            }
            if (i == 0 && x < key.t && Math.abs(y - key.y) < precision)
            {
                var result = { t: x, y: key.y, tan: 0 };
                keys.push(result);
                return result;
            }
            if (i == n - 1 && x > key.t && Math.abs(y - key.y) < precision)
            {
                var result = { t: x, y: key.y, tan: 0 };
                keys.push(result);
                return result;
            }
        }
        return null;
    }

    deletePoint(key: TimeLineCubicBezierKey)
    {
        var keys = this.keys;
        var index = keys.indexOf(key);
        keys.splice(index, 1);
    }
}