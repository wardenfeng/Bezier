declare function createCanvas(x?: number, y?: number, width?: number, height?: number): HTMLCanvasElement;
/**
 * 清理画布
 * @param canvas 画布
 */
declare function clearCanvas(canvas: HTMLCanvasElement, fillStyle?: string): void;
/**
 * 绘制曲线
 * @param canvas 画布
 * @param points 曲线上的点
 * @param strokeStyle 曲线颜色
 */
declare function drawPointsCurve(canvas: HTMLCanvasElement, xpoints: number[], ypoints: number[], strokeStyle?: string, lineWidth?: number): void;
declare function drawBezierCurve(canvas: HTMLCanvasElement, xpoints: number[], ypoints: number[], strokeStyle?: string, lineWidth?: number): void;
