type Mapper = (value: number, i: number, j: number) => number;
type Zipper = (a: number, b: number, i: number, j: number) => number;

class Matrix {
  rows: number;
  cols: number;
  data: Float32Array;

  constructor(rows: number, cols: number)
  constructor(rows: number, cols: number, data: Float32Array)
  constructor(rows: number, cols: number, data: number[])
  constructor(rows: number, cols: number, data: number[][])
  constructor(rows: number, cols: number, data?: Float32Array | number[][] | number[]) {
    this.rows = rows;
    this.cols = cols;
    if (!data) {
      this.data = new Float32Array(rows * cols);
    } else if (data instanceof Float32Array) {
      this.data = new Float32Array(data);
    } else {
      this.data = new Float32Array(([] as number[]).concat.apply([], data));
    }
  }
  map(func: Mapper): Matrix {
    let i = 0, j = 0;
    this.data = this.data
      .map(value => {
        if (j == this.cols) {
          j = 0;
          i++;
        }
        return func(value, i, j++);
      });
    return this;
  }
  zip(other: Matrix, func: Zipper): Matrix {
    if (other.rows !== this.rows || other.cols !== this.cols) {
      throw new Error("Dimentions of matrixies should match");
    }
    let i = 0, j = 0;
    this.data = this.data
      .map((value, idx) => {
        j++;
        if (j == this.cols) {
          j = 0;
          i++;
        }
        return func(value, other.data[idx], i, j);
      });
    return this;
  }
  copy() {
    return new Matrix(this.rows, this.cols, this.data);
  }
  static map(m: Matrix, func: Mapper): Matrix {
    return m.copy().map(func);
  }
  static zip(a: Matrix, b: Matrix, func: Zipper): Matrix {
    return a.copy().zip(b, func);
  }
  randomize() {
    this.map(_ => Math.floor(Math.random() * 2 - 1));
  }
  add(other: Matrix | number): Matrix {
    if (other instanceof Matrix) {
      if (other.rows !== this.rows || other.cols !== this.cols) {
        throw new Error("Dimentions of matrixies should match");
      }
      this.zip(other, (a, b) => a + b);
    } else {
      this.map(val => val + other);
    }
    return this;
  }
  sub(other: Matrix): Matrix {
    if (other.rows !== this.rows || other.cols !== this.cols) {
      throw new Error("Dimentions of matrixies should match");
    }
    this.zip(other, (a, b) => a - b);
    return this;
  }
  print() {
    console.table(this.data);
    // console.log(this);
  }
  mult(other: Matrix | number): Matrix {
    if (other instanceof Matrix) {
      if (other.rows !== this.rows || other.cols !== this.cols) {
        throw new Error("Dimentions of matrixies should match");
      }
      this.zip(other, (a, b) => a * b);
    } else {
      this.map(val => val * other);
    }
    return this;
  }
  static mult(a: Matrix, b: Matrix) {
    if (a.cols != b.rows) {
      throw new Error("Dimentions of matrixies should match");
    }
    let result = new Matrix(a.rows, b.cols);
    for (let k = 0; k < a.cols; k++)
      for (let i = 0; i < result.rows; i++)
        for (let j = 0; j < result.cols; j++) {
          const ij = i * result.cols + j;
          const ik = i * a.cols + k;
          const kj = k * result.cols + j;
          result.data[ij] += a.data[ik] * b.data[kj];
        }
    return result;
  }
  static transpose(a: Matrix): Matrix {
    let transposed = new Matrix(a.cols, a.rows);
    transposed.map((_, i, j) => {
      const ji = j * a.cols + i;
      return a.data[ji];
    });
    return transposed;
  }
  static fromArray(arr: number[]): Matrix {
    return new Matrix(arr.length, 1, [arr]);
  }
  static toArray(m: Matrix): number[] {
    return Array.from(m.data);
  }
}

export default Matrix;
