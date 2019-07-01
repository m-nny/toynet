import Matrix from './matrix';
declare class NeuralNetwork {
    private input_nodes;
    private hidden_nodes;
    private output_nodes;
    private weights_ih;
    private weights_ho;
    private bias_h;
    private bias_o;
    private activation_function;
    private learning_rate;
    constructor(a: number, b: number, c: number);
    constructor(a: number, b: number, c: number, weights_ih: Matrix, weights_ho: Matrix, bias_h: Matrix, bias_o: Matrix);
    feedforward(input_array: number[]): number[];
    train(input_array: number[], target_array: number[]): void;
    copy(): NeuralNetwork;
    mutate(rate: number): NeuralNetwork;
}
export default NeuralNetwork;
