/**
 author: william   email:362661044@qq.com
 create_at:2024/7/17
 **/
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import nodeExternals from "rollup-plugin-node-externals";
import filesize from "rollup-plugin-filesize";

export default {
  input: "./src/main.mjs",
  output: {
    format: "cjs",
    dir: "dist",
  },
  plugins: [
    babel({
      sourceMap: true,
      babelHelpers: "bundled",
      // skipPreflightCheck: true,
      exclude: "node_modules/**",
    }),
    // json(),
    nodeExternals({ exclude: ["node-fetch"] }),
    nodeResolve(),
    // nodeResolve({
    //   resolveOnly: ["dayjs", "node-fetch"],
    // }),
    commonjs(),
    filesize(),
  ],
  external: ["puppeteer"],
};
