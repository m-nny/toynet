import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default [{
    input: "./src/index.ts",
    output: [{
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {})
    ],
    plugins: [typescript()]
  },
  {
    input: "./src/index.ts",
    output: {
      name: 'ToyNet',
      file: pkg.browser,
      format: 'umd'
    },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {})
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
    ]
  }
];
