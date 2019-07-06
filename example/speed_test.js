const n_input = 900,
  n_hidden = 10000,
  n_output = 1000;

function generate_input(n_input) {
  const result = [];
  for (let i = 0; i < n_input; i++) {
    result[i] = Math.random();
  }
  return result;
}

function test_feedforward(NN) {
  const nn = new NN(n_input, n_hidden, n_output);
  const input = generate_input(n_input);
  const target = generate_input(n_output);

  let total_elapsed = 0;
  const repeats = 10;
  for (let i = 0; i < repeats; i++) {
    let start = process.hrtime();
    const output = nn.feedforward(input);
    let end = process.hrtime(start);
    let elapsed = end[0] * 1000 + end[1] / 1000000;
    total_elapsed += elapsed;
    // console.log(output);
    // console.log(elapsed.toFixed(3), 'ms');
  }
  total_elapsed /= repeats;
  console.log('feedforward mean: ', total_elapsed.toFixed(3), 'ms');

  total_elapsed = 0;
  for (let i = 0; i < repeats; i++) {
    let start = process.hrtime();
    nn.train(input, target);
    let end = process.hrtime(start);
    let elapsed = end[0] * 1000 + end[1] / 1000000;
    total_elapsed += elapsed;
    // console.log(elapsed.toFixed(3), 'ms');
  }
  total_elapsed /= repeats;
  console.log('train mean: ', total_elapsed.toFixed(3), 'ms');
}

test_feedforward(require('../dist.purearray').NeuralNetwork);
test_feedforward(require('../dist.float32').NeuralNetwork);
test_feedforward(require('../dist.mathjs').NeuralNetwork);
