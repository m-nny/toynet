import math, { Matrix } from 'mathjs';
import { randomGaussian, randomMatrix } from './helper';

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
  private learning_rate = 0.001;

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

    this.weights_ih = (weights_ih && weights_ih.clone()) || randomMatrix(this.hidden_nodes, this.input_nodes)
    this.weights_ho = (weights_ho && weights_ho.clone()) || randomMatrix(this.output_nodes, this.hidden_nodes);

    this.bias_h = (bias_h && bias_h.clone()) || randomMatrix(this.hidden_nodes, 1);
    this.bias_o = (bias_o && bias_o.clone()) || randomMatrix(this.output_nodes, 1);
  }

  feedforward(input_array: number[]): number[] {
    if (input_array.length !== this.input_nodes) {
      throw new Error("input_array shape must match input shape");
    }
    let inputs = math.matrix(input_array).resize([this.input_nodes, 1]);

    let hidden: any = math.multiply(this.weights_ih, inputs);
    hidden = math.add(hidden, this.bias_h);
    hidden = math.map(hidden, this.activation_function.func);

    let output: any = math.multiply(this.weights_ho, hidden);
    output = math.add(output, this.bias_o);
    output = math.map(output, this.activation_function.func);

    return output.toArray();
  }

  train(input_array: number[], target_array: number[]): void {
    if (input_array.length !== this.input_nodes) {
      throw new Error("input_array shape must match input shape");
    }
    if (target_array.length !== this.output_nodes) {
      throw new Error("target_array shape must match output shape");
    }
    let inputs = math.matrix(input_array).resize([this.input_nodes, 1]);
    let targets = math.matrix(target_array).resize([this.output_nodes, 1])
    let hidden: any = math.multiply(this.weights_ih, inputs);
    hidden = math.add(hidden, this.bias_h);
    hidden = math.map(hidden, this.activation_function.func);

    let outputs: any = math.multiply(this.weights_ho, hidden);
    outputs = math.add(outputs, this.bias_o);
    outputs = math.map(outputs, this.activation_function.func);

    let output_errors = math.subtract(targets, outputs);
    // Calculate gradient
    let gradients: any = math.map(outputs, this.activation_function.dfunc);
    gradients = math.dotMultiply(gradients, output_errors);
    gradients = math.dotMultiply(gradients, this.learning_rate);

    // Calculate deltas
    let hidden_t = math.transpose(hidden);
    let weights_ho_deltas = math.multiply(gradients, hidden_t);

    this.weights_ho = math.add(this.weights_ho, weights_ho_deltas) as Matrix;
    this.bias_o = math.add(this.bias_o, gradients) as Matrix;

    let who_t = math.transpose(this.weights_ho);
    let hidden_errors = math.multiply(who_t, output_errors);

    // Calculate hidden gradient
    let hidden_gradient: any = math.map(hidden, this.activation_function.dfunc);
    hidden_gradient = math.dotMultiply(hidden_gradient, hidden_errors);
    hidden_gradient = math.dotMultiply(hidden_gradient, this.learning_rate);

    // Calculate input->hidden deltas
    let inputs_t = math.transpose(inputs);
    let weights_ih_deltas = math.multiply(hidden_gradient, inputs_t);

    this.weights_ih = math.add(this.weights_ih, weights_ih_deltas) as Matrix;
    this.bias_h = math.add(this.bias_h, hidden_gradient) as Matrix;
  }

  copy(): NeuralNetwork {
    return new NeuralNetwork(
      this.input_nodes, this.hidden_nodes, this.output_nodes,
      this.weights_ih, this.weights_ho,
      this.bias_h, this.bias_o
    );
  }

  mutate(rate: number): NeuralNetwork {
    let mutate = (val: number) => {
      if (Math.random() < rate) {
        return val + randomGaussian();
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
