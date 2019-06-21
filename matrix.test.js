const Matrix = require('./matrix');
test('Adding scalar to matrix', () => {
  let m = new Matrix(3, 2);
  m.data[0] = [1, -2];
  m.data[1] = [-3, 4];
  m.data[2] = [5, -6];
  m.add(1);

  expect(m).toEqual({
    rows: 3,
    cols: 2,
    data: [
      [2, -1],
      [-2, 5],
      [6, -5],
    ]
  })
});
