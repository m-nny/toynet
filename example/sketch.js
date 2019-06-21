let training_data = [{
    inputs: [0, 1],
    targets: [1],
  },
  {
    inputs: [1, 0],
    targets: [1],
  },
  {
    inputs: [0, 0],
    targets: [0],
  },
  {
    inputs: [1, 1],
    targets: [0],
  }
];

function setup() {
  let nn = new NeuralNetwork(2, 2, 1);
  for (let i = 0; i < 50000; i++) {
    let data = random(training_data);
    nn.train(data.inputs, data.targets);
  }
  let outputs = training_data.map(data => nn.feedforward(data.inputs));
  console.table(outputs);
}