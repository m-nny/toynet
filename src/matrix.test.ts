import Matrix from './matrix';

function deepcopy(arr: number[][]): number[][] {
  return arr.map(row => row.slice());
}

test('Mapping with instance map', () => {
  const data = [
    [1, -2],
    [-3, 4],
    [5, -6],
  ];
  const mapped_data = [
    [-1, 2],
    [3, -4],
    [-5, 6],
  ];
  let m = new Matrix(3, 2, deepcopy(data));
  m.map(val => -val);

  expect(m).toEqual({
    rows: 3,
    cols: 2,
    data: mapped_data,
  })
});

test('Zipping with instance map', () => {
  const data_a = [
    [1, -2],
    [-3, 4],
    [5, -6],
  ];
  const data_b = [
    [10, -20],
    [-30, 40],
    [50, -60],
  ];
  const zipped_data = [
    [11, -22],
    [-33, 44],
    [55, -66],
  ];
  let a = new Matrix(3, 2, deepcopy(data_a));
  let b = new Matrix(3, 2, deepcopy(data_b));
  a.zip(b, (x, y) => x + y);

  expect(a).toEqual({
    rows: 3,
    cols: 2,
    data: zipped_data,
  })
  expect(b).toEqual({
    rows: 3,
    cols: 2,
    data: data_b,
  })
});

test('Making copy of matrix', () => {
  const data = [
    [1, -2],
    [-3, 4],
    [5, -6],
  ];
  const mapped_data = [
    [1, 0],
    [-3, 4],
    [5, -6],
  ];
  let m = new Matrix(3, 2, deepcopy(data));
  let m_copy = m.copy();
  m_copy.data[0][1] = 0;
  expect(m).toEqual({
    rows: 3,
    cols: 2,
    data: data,
  });
  expect(m_copy).toEqual({
    rows: 3,
    cols: 2,
    data: mapped_data,
  })
});

test('Mapping with static method', () => {
  let data = [
    [1, -2],
    [-3, 4],
    [5, -6],
  ];
  let mapped_data = [
    [-1, 2],
    [3, -4],
    [-5, 6],
  ];
  let m = new Matrix(3, 2, deepcopy(data));
  let other = Matrix.map(m, (val => -val));

  expect(m).toEqual({
    rows: 3,
    cols: 2,
    data: data,
  })
  expect(other).toEqual({
    rows: 3,
    cols: 2,
    data: mapped_data,
  })
});

test('Zipping with static method', () => {
  const data_a = [
    [1, -2],
    [-3, 4],
    [5, -6],
  ];
  const data_b = [
    [10, -20],
    [-30, 40],
    [50, -60],
  ];
  const zipped_data = [
    [11, -22],
    [-33, 44],
    [55, -66],
  ];
  let a = new Matrix(3, 2, deepcopy(data_a));
  let b = new Matrix(3, 2, deepcopy(data_b));
  let c = Matrix.zip(a, b, (x, y) => x + y);

  expect(a).toEqual({
    rows: 3,
    cols: 2,
    data: data_a,
  })
  expect(b).toEqual({
    rows: 3,
    cols: 2,
    data: data_b,
  })
  expect(c).toEqual({
    rows: 3,
    cols: 2,
    data: zipped_data,
  })
});

test('Randmize matrix', () => {
  const data = [
    [1, -2],
    [-3, 4],
    [5, -6],
  ];
  let a = new Matrix(3, 2, deepcopy(data));
  a.randomize();

  expect(a).toMatchObject({
    rows: 3,
    cols: 2,
  });
  expect(a.data).not.toEqual(data);
});

test('Add scalar to matrix', () => {
  const data = [
    [1, -2],
    [-3, 4],
    [5, -6],
  ];
  const mapped_data = [
    [2, -1],
    [-2, 5],
    [6, -5],
  ];
  let a = new Matrix(3, 2, deepcopy(data));
  a.add(1);

  expect(a).toEqual({
    rows: 3,
    cols: 2,
    data: mapped_data,
  });
  expect(a.data).not.toEqual(data);
});

test('Add matrix to matrix', () => {
  const data_a = [
    [1, -2],
    [-3, 4],
    [5, -6],
  ];
  const data_b = [
    [10, -20],
    [-30, 40],
    [50, -60],
  ];
  const zipped_data = [
    [11, -22],
    [-33, 44],
    [55, -66],
  ];
  let a = new Matrix(3, 2, deepcopy(data_a));
  let b = new Matrix(3, 2, deepcopy(data_b));
  a.add(b);

  expect(a).toEqual({
    rows: 3,
    cols: 2,
    data: zipped_data,
  })
  expect(b).toEqual({
    rows: 3,
    cols: 2,
    data: data_b,
  })
});

test('Substract matrix from matrix', () => {
  const data_a = [
    [1, -2],
    [-3, 4],
    [5, -6],
  ];
  const data_b = [
    [1, -2],
    [-3, 4],
    [5, -6],
  ];
  const zipped_data = [
    [0, 0],
    [0, 0],
    [0, 0],
  ];
  let a = new Matrix(3, 2, deepcopy(data_a));
  let b = new Matrix(3, 2, deepcopy(data_b));
  a.sub(b);

  expect(a).toEqual({
    rows: 3,
    cols: 2,
    data: zipped_data,
  })
  expect(b).toEqual({
    rows: 3,
    cols: 2,
    data: data_b,
  })
});

test('Printing', () => {
  //Replace console.table with a jest mock so we can see if it has been called
  const old_table = console.table;
  console.table = jest.fn();

  let m = new Matrix(2, 3);
  m.randomize();
  m.print();

  //Check if the mock console.table has been called
  expect(console.table).toHaveBeenCalledWith(m.data)
  console.table = old_table;
});

test('Scalar product', () => {
  const data_a = [
    [1, -2],
    [-3, 4],
    [5, -6],
  ];
  const mapped_data = [
    [10, -20],
    [-30, 40],
    [50, -60],
  ];
  let a = new Matrix(3, 2, deepcopy(data_a));
  a.mult(10);

  expect(a).toEqual({
    rows: 3,
    cols: 2,
    data: mapped_data,
  })
});

test('Hadamard product', () => {
  const data_a = [
    [1, 2],
    [3, 4],
    [5, 6],
  ];
  const data_b = [
    [7, 8],
    [9, 10],
    [11, 12],
  ];
  const mapped_data = [
    [7, 16],
    [27, 40],
    [55, 72]
  ];
  let a = new Matrix(3, 2, deepcopy(data_a));
  let b = new Matrix(3, 2, deepcopy(data_b));
  a.mult(b);

  expect(a).toEqual({
    rows: 3,
    cols: 2,
    data: mapped_data,
  })
  expect(b).toEqual({
    rows: 3,
    cols: 2,
    data: data_b
  })
});

test('Matrix product', () => {
  const data_a = [
    [1, 2, 3],
    [4, 5, 6],
  ];
  const data_b = [
    [7, 8],
    [9, 10],
    [11, 12],
  ];
  const data_c = [
    [58, 64],
    [139, 154],
  ];
  const data_d = [
    [39, 54, 69],
    [49, 68, 87],
    [59, 82, 105]
  ];
  let a = new Matrix(2, 3, deepcopy(data_a));
  let b = new Matrix(3, 2, deepcopy(data_b));
  let c = Matrix.mult(a, b);
  let d = Matrix.mult(b, a);

  expect(a).toEqual({
    rows: 2,
    cols: 3,
    data: data_a,
  })
  expect(b).toEqual({
    rows: 3,
    cols: 2,
    data: data_b,
  })
  expect(c).toEqual({
    rows: 2,
    cols: 2,
    data: data_c,
  })
  expect(d).toEqual({
    rows: 3,
    cols: 3,
    data: data_d
  })
});

test('Transpose matrix', () => {
  const data = [
    [1, -2],
    [-3, 4],
    [5, -6],
  ];
  const mapped_data = [
    [1, -3, 5],
    [-2, 4, -6],
  ];
  let a = new Matrix(3, 2, deepcopy(data));
  let b = Matrix.transpose(a);

  expect(a).toEqual({
    rows: 3,
    cols: 2,
    data: data,
  })
  expect(b).toEqual({
    rows: 2,
    cols: 3,
    data: mapped_data,
  })
});

test('Matrix from Array', () => {
  const data = [1, -2, -3];
  const mapped_data = [[1], [-2], [-3]];
  let m = Matrix.fromArray(data);
  expect(m).toEqual({
    rows: data.length,
    cols: 1,
    data: mapped_data,
  })
});

test('Matrix to array', () => {
  const data = [
    [1, -2],
    [-3, 4],
    [5, -6],
  ];
  const mapped_data = [1, -2, -3, 4, 5, -6,];
  let a = new Matrix(3, 2, deepcopy(data));
  let b = Matrix.toArray(a);

  expect(a).toEqual({
    rows: 3,
    cols: 2,
    data: data,
  })
  a.add(10);
  expect(b).toEqual(mapped_data);
});

test('Chaining matrix methods', () => {
  let data = [
    [1, 2],
    [4, 5],
    [7, 8],
  ];
  let mapped_data = [
    [6, 16],
    [36, 46],
    [66, 76],
  ];
  let m = new Matrix(3, 2, data);

  m = m.map(val => val - 1).mult(10).add(6);

  expect(m).toEqual({
    rows: 3,
    cols: 2,
    data: mapped_data,
  });
});

test('Instance map with row and column params', () => {
  const data = [
    [1, 2],
    [4, 5],
    [7, 8],
  ];
  const mapped_data = [
    [100, 201],
    [410, 511],
    [720, 821],
  ];
  let m = new Matrix(3, 2, deepcopy(data));

  m.map((val, row, col) => val * 100 + row * 10 + col);

  expect(m).toEqual({
    rows: 3,
    cols: 2,
    data: mapped_data,
  });
});

test('Static map with row and column params', () => {
  const data = [
    [1, 2],
    [4, 5],
    [7, 8],
  ];
  const mapped_data = [
    [100, 201],
    [410, 511],
    [720, 821],
  ];
  let m = new Matrix(3, 2, deepcopy(data));

  let mapped = Matrix.map(m, (val, row, col) => val * 100 + row * 10 + col);

  expect(m).toEqual({
    rows: 3,
    cols: 2,
    data: data,
  });
  expect(mapped).toEqual({
    rows: 3,
    cols: 2,
    data: mapped_data,
  });
});

test('error handling of addition when dimenstions of A and B does not match.', () => {
  let m1 = new Matrix(1, 2);
  let m2 = new Matrix(3, 4);
  expect(() => {
    m1.add(m2);
  }).toThrow("Dimentions of matrixies should match");
});

test('error handling of substraction when dimenstions of A and B does not match.', () => {
  let m1 = new Matrix(1, 2);
  let m2 = new Matrix(3, 4);
  expect(() => {
    m1.sub(m2);
  }).toThrow("Dimentions of matrixies should match");
});

test('error handling of Hadamard product when dimenstions of A and B does not match.', () => {
  let m1 = new Matrix(1, 2);
  let m2 = new Matrix(3, 4);
  expect(() => {
    m1.mult(m2);
  }).toThrow("Dimentions of matrixies should match");
});

test('error handling of matrix product when dimenstions of A and B does not match.', () => {
  let m1 = new Matrix(1, 2);
  let m2 = new Matrix(3, 4);
  expect(() => {
    Matrix.mult(m1, m2);
  }).toThrow("Dimentions of matrixies should match");
});
