const clearConsole = require('react-dev-utils/clearConsole');
const del = require('del');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const paths = require('../config/paths');

clearConsole();

const clean = () => (
  del(paths.buildDir)
);

const buildJs = () => (
  gulp.src([paths.jsPattern, '!**/*.test.js']).pipe(plumber()).pipe(babel()).pipe(gulp.dest(paths.buildDir))
);

const watch = () => {
  gulp.watch(paths.jsPattern, buildJs);
};

gulp.task('build', gulp.series(clean, gulp.parallel(buildJs)));

gulp.task('watch', gulp.series('build', watch));

