class BezierTest
{
    constructor()
    {
        var canvas = <HTMLCanvasElement>document.getElementById("viewport"), ctx = canvas.getContext("2d");

        var bezier = new Bezier(0.44, 0.32, 0.82, 0.56);
        // var bezier = new Bezier(0.25, 0.1, 0.0, 1.0);

        var points = [[20, 20], [80, 80], [60, 50]];
        points.length = 0;

        for (let i = 0; i < 1; i += 1 / 100)
        {
            points.push([i * 100, (1 - bezier.getValue(i)) * 100]);
        }

        ctx.fillStyle = 'brack';
        ctx.fillRect(0, 0, 100, 100);

        // First path
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++)
        {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.stroke();
    }
}

new BezierTest();