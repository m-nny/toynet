var Matrix = /** @class */ (function () {
    function Matrix(a, b, data) {
        this.data = [];
        this.rows = a;
        this.cols = b;
        if (data) {
            this.data = data;
        }
        else {
            for (var i = 0; i < this.rows; i++) {
                this.data[i] = [];
                for (var j = 0; j < this.cols; j++) {
                    this.data[i][j] = 0;
                }
            }
        }
    }
    Matrix.prototype.map = function (func) {
        this.data = this.data
            .map(function (row, i) {
            return row.map(function (value, j) {
                return func(value, i, j);
            });
        });
        return this;
    };
    Matrix.prototype.zip = function (other, func) {
        if (other.rows !== this.rows || other.cols !== this.cols) {
            throw new Error("Dimentions of matrixies should match");
        }
        this.data = this.data
            .map(function (row, i) {
            return row.map(function (value, j) {
                return func(value, other.data[i][j], i, j);
            });
        });
        return this;
    };
    Matrix.prototype.copy = function () {
        var data_copy = this.data.map(function (row) { return row.map(function (val) { return val; }); });
        return new Matrix(this.rows, this.cols, data_copy);
    };
    Matrix.map = function (m, func) {
        return m.copy().map(func);
    };
    Matrix.zip = function (a, b, func) {
        return a.copy().zip(b, func);
    };
    Matrix.prototype.randomize = function () {
        this.map(function (_) { return Math.floor(Math.random() * 2 - 1); });
    };
    Matrix.prototype.add = function (other) {
        if (other instanceof Matrix) {
            if (other.rows !== this.rows || other.cols !== this.cols) {
                throw new Error("Dimentions of matrixies should match");
            }
            this.zip(other, function (a, b) { return a + b; });
        }
        else {
            this.map(function (val) { return val + other; });
        }
        return this;
    };
    Matrix.prototype.sub = function (other) {
        if (other.rows !== this.rows || other.cols !== this.cols) {
            throw new Error("Dimentions of matrixies should match");
        }
        this.zip(other, function (a, b) { return a - b; });
        return this;
    };
    Matrix.prototype.print = function () {
        console.table(this.data);
        // console.log(this);
    };
    Matrix.prototype.mult = function (other) {
        if (other instanceof Matrix) {
            if (other.rows !== this.rows || other.cols !== this.cols) {
                throw new Error("Dimentions of matrixies should match");
            }
            this.zip(other, function (a, b) { return a * b; });
        }
        else {
            this.map(function (val) { return val * other; });
        }
        return this;
    };
    Matrix.mult = function (a, b) {
        if (a.cols != b.rows) {
            throw new Error("Dimentions of matrixies should match");
        }
        var result = new Matrix(a.rows, b.cols);
        for (var k = 0; k < a.cols; k++)
            for (var i = 0; i < result.rows; i++)
                for (var j = 0; j < result.cols; j++)
                    result.data[i][j] += a.data[i][k] * b.data[k][j];
        return result;
    };
    Matrix.transpose = function (a) {
        var transposed = new Matrix(a.cols, a.rows);
        transposed.map(function (_, i, j) { return a.data[j][i]; });
        return transposed;
    };
    Matrix.fromArray = function (arr) {
        return new Matrix(arr.length, 1).map(function (_, i) { return arr[i]; });
    };
    Matrix.toArray = function (m) {
        var result = [];
        Matrix.map(m, function (val) { return result.push(val); });
        return result;
    };
    return Matrix;
}());

var previous = false, y2 = 0;
function randomGaussian(mean, std) {
    var y1, x1, x2, w;
    if (previous) {
        y1 = y2;
        previous = false;
    }
    else {
        while (true) {
            x1 = 2 * Math.random() - 1;
            x2 = 2 * Math.random() - 1;
            w = x1 * x1 + x2 * x2;
            if (w < 1) {
                break;
            }
        }
        w = Math.sqrt(-2 * Math.log(w) / w);
        y1 = x1 * w;
        y2 = x2 * w;
        previous = true;
    }
    var m = mean || 0;
    var s = std || 1;
    return y1 * s + m;
}

var ActivationFunction = /** @class */ (function () {
    function ActivationFunction(func, dfunc) {
        this.func = func;
        this.dfunc = dfunc;
    }
    return ActivationFunction;
}());
var sigmoid = new ActivationFunction(function (x) { return 1 / (1 + Math.exp(-x)); }, function (y) { return y * (1 - y); });
var NeuralNetwork = /** @class */ (function () {
    function NeuralNetwork(a, b, c, weights_ih, weights_ho, bias_h, bias_o) {
        this.activation_function = sigmoid;
        this.learning_rate = 0.001;
        this.input_nodes = a;
        this.hidden_nodes = b;
        this.output_nodes = c;
        if (!weights_ih) {
            this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
            this.weights_ih.randomize();
        }
        else {
            this.weights_ih = weights_ih;
        }
        if (!weights_ho) {
            this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
            this.weights_ho.randomize();
        }
        else {
            this.weights_ho = weights_ho;
        }
        if (!bias_h) {
            this.bias_h = new Matrix(this.hidden_nodes, 1);
            this.bias_h.randomize();
        }
        else {
            this.bias_h = bias_h;
        }
        if (!bias_o) {
            this.bias_o = new Matrix(this.output_nodes, 1);
            this.bias_o.randomize();
        }
        else {
            this.bias_o = bias_o;
        }
    }
    NeuralNetwork.prototype.feedforward = function (input_array) {
        var inputs = Matrix.fromArray(input_array);
        var hidden = Matrix.mult(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        hidden.map(this.activation_function.func);
        var output = Matrix.mult(this.weights_ho, hidden);
        output.add(this.bias_o);
        output.map(this.activation_function.func);
        return Matrix.toArray(output);
    };
    NeuralNetwork.prototype.train = function (input_array, target_array) {
        var inputs = Matrix.fromArray(input_array);
        var targets = Matrix.fromArray(target_array);
        var hidden = Matrix.mult(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        hidden.map(this.activation_function.func);
        var outputs = Matrix.mult(this.weights_ho, hidden);
        outputs.add(this.bias_o);
        outputs.map(this.activation_function.func);
        var output_errors = targets.sub(outputs);
        // Calculate gradient
        var gradients = Matrix.map(outputs, this.activation_function.dfunc);
        gradients.mult(output_errors);
        gradients.mult(this.learning_rate);
        // Calculate deltas
        var hidden_t = Matrix.transpose(hidden);
        var weights_ho_deltas = Matrix.mult(gradients, hidden_t);
        this.weights_ho.add(weights_ho_deltas);
        this.bias_o.add(gradients);
        var who_t = Matrix.transpose(this.weights_ho);
        var hidden_errors = Matrix.mult(who_t, output_errors);
        // Calculate hidden gradient
        var hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
        hidden_gradient.mult(hidden_errors);
        hidden_gradient.mult(this.learning_rate);
        // Calculate input->hidden deltas
        var inputs_t = Matrix.transpose(inputs);
        var weights_ih_deltas = Matrix.mult(hidden_gradient, inputs_t);
        this.weights_ih.add(weights_ih_deltas);
        this.bias_h.add(hidden_gradient);
    };
    NeuralNetwork.prototype.copy = function () {
        return new NeuralNetwork(this.input_nodes, this.hidden_nodes, this.output_nodes, this.weights_ih.copy(), this.weights_ho.copy(), this.bias_h.copy(), this.bias_o.copy());
    };
    NeuralNetwork.prototype.mutate = function (rate) {
        var mutate = function (val) {
            if (Math.random() < rate) {
                return val + randomGaussian();
            }
            else {
                return val;
            }
        };
        this.weights_ih.map(mutate);
        this.weights_ho.map(mutate);
        this.bias_h.map(mutate);
        this.bias_o.map(mutate);
        return this;
    };
    return NeuralNetwork;
}());

export { Matrix, NeuralNetwork };
