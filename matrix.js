class Matrix {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols;
    this.data = [];

    for (let i = 0; i < rows; i++) {
      this.data[i] = [];
      for (let j = 0; j < cols; j++) {
        this.data[i][j] = 0;
      }
    }
  }
  copy() {
    let m = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        m.data[i][j] = this.data[i][j];
      }
    }
    return m;
  }
  static fromArray(array) {
    let m = new Matrix(array.length, 1);
    for (let i = 0; i < array.length; i++) {
      m.data[i][0] = array[i];
    }
    return m;
  }
  static substract(a, b) {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      console.log('Dimention of A must match dimention of B');
      return undefined;
    }
    let result = new Matrix(a.rows, a.cols);

    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {
        result.data[i][j] = a.data[i][j] - b.data[i][j];
      }
    }
    return result;
  }
  toArray() {
    let result = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.push(this.data[i][j]);
      }
    }
    return result;
  }
  randomize() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = Math.random() * 2 - 1;
      }
    }
  }
  static transpose(matrix) {
    let result = new Matrix(matrix.cols, matrix.rows);
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        result.data[j][i] = matrix.data[i][j];
      }
    }
    return result;
  }
  static multiply(a, b) {
    if (a.cols !== b.rows) {
      console.log('Conlumns of A must match rows of B');
      return undefined;
    }
    let result = new Matrix(a.rows, b.cols);
    for (let k = 0; k < a.cols; k++) {
      for (let i = 0; i < result.rows; i++) {
        for (let j = 0; j < result.cols; j++) {
          result.data[i][j] += a.data[i][k] * b.data[k][j];
        }
      }
    }
    return result;
  }
  multiply(other) {
    if (other instanceof Matrix) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] *= other.data[i][j];
        }
      }
    } else {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] *= other;
        }
      }
    }
  }
  map(func) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val);
      }
    }
  }
  static map(matrix, func) {
    let result = new Matrix(matrix.rows, matrix.cols);
    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {
        let val = matrix.data[i][j];
        result.data[i][j] = func(val);
      }
    }
    return result;
  }
  add(n) {
    if (n instanceof Matrix) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] += n.data[i][j];
        }
      }
    } else {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] += n;
        }
      }
    }
  }
  print() {
    console.table(this.data);
  }
}

module.exports = Matrix;
