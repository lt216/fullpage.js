import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import serve from "rollup-plugin-serve"
import livereload from "rollup-plugin-livereload"
import terser from "@rollup/plugin-terser"

export default {
  input: "src/index.js",
  output: {
    file: "dist/full-page-scroll.js",
    format: "umd",
    name: "FullPage"
  },
  plugins: [
    resolve(),
    commonjs(),
    terser(),
    serve({
      open: false,
      contentBase: "dist",
      port: 1234
    }),
    livereload("dist")
  ]
}
