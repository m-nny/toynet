type Mapper = (value: number, i: number, j: number) => number;
type Zipper = (a: number, b: number, i: number, j: number) => number;

class Matrix {
  rows: number;
  cols: number;
  data: number[][] = [];
  constructor(a: number, b: number, data?: number[][]) {
    this.rows = a;
    this.cols = b;
    if (data) {
      this.data = data;
    } else {
      for (let i = 0; i < this.rows; i++) {
        this.data[i] = [];
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] = 0;
        }
      }
    }
  }
  map(func: Mapper): Matrix {
    this.data = this.data
      .map((row, i) =>
        row.map((value, j) =>
          func(value, i, j)));
    return this;
  }
  zip(other: Matrix, func: Zipper): Matrix {
    if (other.rows !== this.rows || other.cols !== this.cols) {
      throw new Error("Dimentions of matrixies should match");
    }
    this.data = this.data
      .map((row, i) =>
        row.map((value, j) =>
          func(value, other.data[i][j], i, j)));
    return this;
  }
  copy() {
    let data_copy = this.data.map(row => row.map(val => val));
    return new Matrix(this.rows, this.cols, data_copy);
  }
  static map(m: Matrix, func: Mapper): Matrix {
    return m.copy().map(func);
  }
  static zip(a: Matrix, b: Matrix, func: Zipper): Matrix {
    return a.copy().zip(b, func);
  }
  randomize() {
    this.map(_ => Math.floor(Math.random() * 10 - 5));
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
        for (let j = 0; j < result.cols; j++)
          result.data[i][j] += a.data[i][k] * b.data[k][j];
    return result;
  }
  static transpose(a: Matrix): Matrix {
    let transposed = new Matrix(a.cols, a.rows);
    transposed.map((_, i, j) => a.data[j][i]);
    return transposed;
  }
  static fromArray(arr: number[]): Matrix {
    return new Matrix(arr.length, 1).map((_, i) => arr[i]);
  }
  static toArray(m: Matrix): number[] {
    let result: number[] = [];
    Matrix.map(m, val => result.push(val));
    return result;
  }
}

export default Matrix;
