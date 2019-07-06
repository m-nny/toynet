import math, { Matrix } from "mathjs";

let previous = false, y2 = 0;

export function randomGaussian(mean?: number, std?: number): number {
  var y1, x1, x2, w;
  if (previous) {
    y1 = y2;
    previous = false;
  } else {
    while (true) {
      x1 = 2 * Math.random() - 1;
      x2 = 2 * Math.random() - 1;
      w = x1 * x1 + x2 * x2;
      if (w < 1) {
        break;
      }
    }
    w = Math.sqrt(-2 * Math.log(w) / w);
    y1 = x1 * w;
    y2 = x2 * w;
    previous = true;
  }

  var m = mean || 0;
  var s = std || 1;
  return y1 * s + m;
};

export function randomMatrix(rows: number, cols: number): Matrix {
  const result = (math.zeros(rows, cols) as Matrix)
    .map(_ => math.random());
  return result;
}
