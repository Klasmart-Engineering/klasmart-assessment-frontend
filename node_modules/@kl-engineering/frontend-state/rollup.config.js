import pkg from './package.json';
import babel from "@rollup/plugin-babel";
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { visualizer } from "rollup-plugin-visualizer";

export default [
    {
        input: `src/index.ts`,
        // output file names are loaded from the `package.json` main entry
        output: [
            {
                file: pkg.main,
                format: `cjs`,
                sourcemap: true,
            },
        ],
        plugins: [
            del({
                targets: `dist/*`,
            }),
            peerDepsExternal(),
            nodePolyfills({
                include: [ `src/**/*.ts`, `src/**/*.tsx` ],
            }),
            nodeResolve(),
            babel({
                babelHelpers: `runtime`,
                exclude: `node_modules/**`,
            }),
            typescript({
                tsconfig: `./tsconfig.rollup.json`,
            }),
            commonjs(),
            visualizer(),
        ],
    },
];
