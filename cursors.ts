
const color = {dark: "#000", light: "#FFF"}

export function drawCursor(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.strokeStyle = color.light
    ctx.fillStyle = color.dark
    ctx.lineWidth = 5

    const size = 30
    const diag = size / Math.sqrt(2)

    ctx.beginPath()

    ctx.moveTo(x, y)
    ctx.lineTo(x, y + size)
    ctx.lineTo(x + size * 0.35, y + size * 0.75)
    ctx.lineTo(x + diag, y + diag)
    ctx.lineTo(x, y)

    ctx.fill()
    ctx.stroke()
}