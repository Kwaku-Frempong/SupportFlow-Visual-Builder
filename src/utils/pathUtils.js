/**
 * Builds a cubic bezier SVG path string between two points.
 * Used for drawing node connection lines on the canvas.
 */
export function buildBezierPath(x1, y1, x2, y2) {
  const dy = Math.abs(y2 - y1);
  const cy1 = y1 + dy * 0.5;
  const cy2 = y2 - dy * 0.5;
  return `M ${x1} ${y1} C ${x1} ${cy1}, ${x2} ${cy2}, ${x2} ${y2}`;
}

/**
 * Gets the midpoint of a cubic bezier at t=0.5 (approximate label position).
 */
export function bezierMidpoint(x1, y1, x2, y2) {
  const dy = Math.abs(y2 - y1);
  const cy1 = y1 + dy * 0.5;
  const cy2 = y2 - dy * 0.5;
  const t = 0.5;
  const mt = 1 - t;
  const mx = mt * mt * mt * x1 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x2;
  const my = mt * mt * mt * y1 + 3 * mt * mt * t * cy1 + 3 * mt * t * t * cy2 + t * t * t * y2;
  return { x: mx, y: my };
}
