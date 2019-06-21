import Matrix from './matrix';

class ActivationFunction {
  constructor(
    public func: (x: number) => number,
    public dfunc: (y: number) => number,
  ) { }
}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
)

class NeuralNetwork {
  private input_nodes: number;
  private hidden_nodes: number;
  private output_nodes: number;

  private weights_ih: Matrix;
  private weights_ho: Matrix;

  private bias_h: Matrix;
  private bias_o: Matrix;

  private activation_function = sigmoid;
  private learning_rate = 0.1;

  constructor(a: number, b: number, c: number);
  constructor(a: number, b: number, c: number,
    weights_ih: Matrix, weights_ho: Matrix,
    bias_h: Matrix, bias_o: Matrix,
  )
  constructor(a: number, b: number, c: number,
    weights_ih?: Matrix, weights_ho?: Matrix,
    bias_h?: Matrix, bias_o?: Matrix,
  ) {
    this.input_nodes = a;
    this.hidden_nodes = b;
    this.output_nodes = c;

    if (!weights_ih) {
      this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
      this.weights_ih.randomize();
    } else {
      this.weights_ih = weights_ih;
    }
    if (!weights_ho) {
      this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
      this.weights_ho.randomize();
    } else {
      this.weights_ho = weights_ho
    }
    if (!bias_h) {
      this.bias_h = new Matrix(this.hidden_nodes, 1);
      this.bias_h.randomize();
    } else {
      this.bias_h = bias_h
    }
    if (!bias_o) {
      this.bias_o = new Matrix(this.output_nodes, 1);
      this.bias_o.randomize();
    } else {
      this.bias_o = bias_o
    }
  }

  feedforward(input_array: number[]): number[] {
    let inputs = Matrix.fromArray(input_array);

    let hidden = Matrix.mult(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    hidden.map(this.activation_function.func);

    let output = Matrix.mult(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(this.activation_function.func);

    return Matrix.toArray(output);
  }

  train(input_array: number[], target_array: number[]): void {
    let inputs = Matrix.fromArray(input_array);
    let targets = Matrix.fromArray(target_array);
    let hidden = Matrix.mult(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    hidden.map(this.activation_function.func);

    let outputs = Matrix.mult(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(this.activation_function.func);

    let output_errors = targets.sub(outputs);
    // Calculate gradient
    let gradients = Matrix.map(outputs, this.activation_function.dfunc);
    gradients.mult(output_errors);
    gradients.mult(this.learning_rate);

    // Calculate deltas
    let hidden_t = Matrix.transpose(hidden);
    let weights_ho_deltas = Matrix.mult(gradients, hidden_t);

    this.weights_ho.add(weights_ho_deltas);
    this.bias_o.add(gradients);

    let who_t = Matrix.transpose(this.weights_ho);
    let hidden_errors = Matrix.mult(who_t, output_errors);

    // Calculate hidden gradient
    let hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
    hidden_gradient.mult(hidden_errors);
    hidden_gradient.mult(this.learning_rate);

    // Calculate input->hidden deltas
    let inputs_t = Matrix.transpose(inputs);
    let weights_ih_deltas = Matrix.mult(hidden_gradient, inputs_t);

    this.weights_ih.add(weights_ih_deltas);
    this.bias_h.add(hidden_gradient);
  }
  copy(): NeuralNetwork {
    return new NeuralNetwork(
      this.input_nodes, this.hidden_nodes, this.output_nodes,
      this.weights_ih.copy(), this.weights_ho.copy(),
      this.bias_h.copy(), this.bias_o.copy()
    );
  }
  mutate(rate: number): NeuralNetwork {
    let mutate = (val: number) => {
      if (Math.random() < rate) {
        return Math.random() * 2 - 1;
      } else {
        return val;
      }
    }
    this.weights_ih.map(mutate);
    this.weights_ho.map(mutate);
    this.bias_h.map(mutate);
    this.bias_o.map(mutate);
    return this;
  }
}

export default NeuralNetwork;
