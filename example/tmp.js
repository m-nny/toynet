const math = require('mathjs');

function randomMatrix(rows, cols) {
  const result = (math.zeros(rows, cols))
    .map(_ => Math.random());
  return result;
}

function print (value) {
  const precision = 3;
  console.log(value._size, math.format(value, precision));
}


const input_nodes = 4;
const hidden_nodes = 3;
const output_nodes = 1;

const A = randomMatrix(hidden_nodes, input_nodes);
print(A)

const B = randomMatrix(hidden_nodes, input_nodes);
print(B)

print(math.dotMultiply(A, B));
