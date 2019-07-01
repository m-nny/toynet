declare type Mapper = (value: number, i: number, j: number) => number;
declare type Zipper = (a: number, b: number, i: number, j: number) => number;
declare class Matrix {
    rows: number;
    cols: number;
    data: number[][];
    constructor(a: number, b: number, data?: number[][]);
    map(func: Mapper): Matrix;
    zip(other: Matrix, func: Zipper): Matrix;
    copy(): Matrix;
    static map(m: Matrix, func: Mapper): Matrix;
    static zip(a: Matrix, b: Matrix, func: Zipper): Matrix;
    randomize(): void;
    add(other: Matrix | number): Matrix;
    sub(other: Matrix): Matrix;
    print(): void;
    mult(other: Matrix | number): Matrix;
    static mult(a: Matrix, b: Matrix): Matrix;
    static transpose(a: Matrix): Matrix;
    static fromArray(arr: number[]): Matrix;
    static toArray(m: Matrix): number[];
}
export default Matrix;
