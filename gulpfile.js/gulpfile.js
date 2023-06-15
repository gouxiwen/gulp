// 配置文件较小时使用gulpfile.js文件，配置文件较大时使用gulpfile.js目录且包含index.js文件作为入口
const { series } = require('gulp');
const { parallel } = require('gulp');

function javascript(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

function transpile(cb) {
  // body omitted
  cb();
}

function bundle(cb) {
  // body omitted
  cb();
}

exports.buildSeries = series(transpile, bundle); // 顺序执行
exports.buildParallel = parallel(javascript, css); // 并行

