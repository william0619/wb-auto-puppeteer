/**
 author: william   email:362661044@qq.com
 create_at:2024/7/17
 **/
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "./src/main.mjs",
  output: {
    format: "es",
    dir: "dist",
  },
  plugins: [
    nodeResolve(),
    // nodeResolve({
    //   browser: true,
    //   resolveOnly: ["puppeteer-core", "dayjs", "node-xlsx", "nanoid"],
    // }),
    commonjs(),
    terser(),
  ],
  external: ["puppeteer"],
};
