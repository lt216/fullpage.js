// rollup.config.mjs
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import serve from "rollup-plugin-serve"
import livereload from "rollup-plugin-livereload"

export default {
  input: "src/index.js", // 入口文件
  output: {
    file: "dist/fullscreen-scroll.js",
    format: "umd",
    name: "FullscreenScroll"
  },
  plugins: [
    resolve(),
    commonjs(),
    serve({
      open: true,
      contentBase: "dist", // 服务目录
      port: 1234
    }),
    livereload("dist") // 实时重载
  ]
}
