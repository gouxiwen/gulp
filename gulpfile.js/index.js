const { src, dest, series } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const gulpif = require('gulp-if'); //条件插件
const sass = require('gulp-sass')(require('sass'));;
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');


function isJavaScript(file) {
  // 判断文件的扩展名是否是 '.js'
  return file.extname === '.js';
}

// 使用插件
const _bundle = function() {
  return src(['src/*.js'])
    .pipe(babel())
    .pipe(src('other/*.js')) // 中间加入不需要Babel的文件
    .pipe(dest('output/'))
    // 只对 JavaScript 文件应用 gulp-uglify 插件
    .pipe(gulpif(isJavaScript, uglify()))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('output/'));
}

function css() {
  return src('./src/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(src('./src/*.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['ie > 9', 'last 2 versions'],
      cascade: false
    }))
    .pipe(dest('output/'))
    .pipe(cssmin())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest('output/'));
}

// 使用库
// 并非 gulp 中的一切都需要用插件来完成。虽然它们是一种快速上手的方法，但许多操作都应当通过使用独立的功能模块或库来实现。
const { rollup } = require('rollup');
const clear = require('rollup-plugin-clear');
const babelRoullup = require('@rollup/plugin-babel');

// Rollup 提供了基于 promise 的 API，在 `async` 任务（task）中工作的很好
// 执行命令:gulp rollup
exports.rollup = async function() {
  const bundle = await rollup({
    input: 'src/index.js',
    plugins: [
      babelRoullup({ babelHelpers: 'bundled' }),
      clear({
        targets: ['dist']
      }),
    ]
  });

  return bundle.write({
    // file: 'dist/bundle.js',
    dir: 'dist',
    format: 'iife', //cjs|es|iife|amd|umd|system
    entryFileNames: '[name]-[hash].js',
    name: 'Bundle'
  });
}

// 插件应当总是用来转换文件的。其他操作都应该使用（非插件的） Node 模块或库来实现。
const del = require('delete');
// 执行命令:gulp _delete
function _delete(cb) {
  // 直接使用 `delete` 模块，避免使用 gulp-rimraf 插件
  del(['output/*.js', 'output/*.css'], cb);
}


// 执行命令:gulp
exports.default = series(_delete, _bundle, css)



const { watch } = require('gulp');
// 执行命令:gulp watch
exports.watch = function () {
  // 所有事件都将被监控
  watch('src/*.js', { events: 'all' }, series(_delete, _bundle));
}
