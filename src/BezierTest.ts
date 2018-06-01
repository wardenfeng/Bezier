var canvas = <HTMLCanvasElement>document.getElementById("viewport"), ctx = canvas.getContext("2d");

setInterval(function ()
{
    var bezier = new Bezier(0.25, 0.1, 0.0, 1.0);
    animate(moveRectangle, 2000, bezier.getValue.bind(bezier));
}, 2000);

function moveRectangle(p)
{ // p move from 0 to 1
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "hsl(" + Math.round(255 * p) + ",80%,50%)";
    var w = 50;
    var h = 50 + p * (canvas.height - 50);
    ctx.fillRect((canvas.width - w) * p, (canvas.height - h) * 0.5, w, h);
}

function animate(render, duration, easing)
{
    var start = Date.now();
    (function loop()
    {
        var p = (Date.now() - start) / duration;
        if (p > 1)
        {
            render(1);
        }
        else
        {
            requestAnimationFrame(loop);
            render(easing(p));
        }
    }());
}