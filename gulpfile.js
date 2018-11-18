const gulp = require('gulp');
const sass = require('gulp-sass');
const gutil = require('gulp-util');
const plumber = require('gulp-plumber');
const chalk = require('chalk');
const runSequence = require('run-sequence');
const del = require('del');

const sourceFolder = 'src';
const distFolder = 'dist';

const PATH = {
  SRC: {
    APP: sourceFolder,
    HTML: sourceFolder + '/*.html',
	ASSETS: sourceFolder + '/assets/*',
    STYLE: sourceFolder + '/style/*.scss'
  },

  DIST: {
    APP: distFolder,
    HTML: distFolder + '/',
	ASSETS: distFolder + '/assets/',
    STYLE: distFolder + '/style/'
  }
};

gulp.task('clean', function () {
  return del([PATH.DIST.APP]);
});

gulp.task('html', function () {
  return gulp.src(PATH.SRC.HTML)
    .pipe(gulp.dest(PATH.DIST.HTML));
});

gulp.task('assets', function () {
  return gulp.src(PATH.SRC.ASSETS)
    .pipe(gulp.dest(PATH.DIST.ASSETS));
});

gulp.task('sass', function () {
  return gulp.src(PATH.SRC.STYLE)
    .pipe(plumber({
      errorHandler: reportError
    }))
    .pipe(sass())
    .pipe(gulp.dest(PATH.DIST.STYLE));
});

var reportError = function (error) {
  gutil.beep();

  var report = '',
    chalk = gutil.colors.white.bgRed;

  report += chalk('TASK:') + ' [' + error.plugin + ']\n';
  report += chalk('PROB:') + ' ' + error.message + '\n';

  if (error.lineNumber) {
    report += chalk('LINE:') + ' ' + error.lineNumber + '\n';
  }

  if (error.fileName) {
    report += chalk('FILE:') + ' ' + error.fileName + '\n';
  }

  console.error(report);

  this.emit('end');
};

gulp.task('watch', function () {
  gulp.watch(PATH.SRC.HTML, ['html']);
  gulp.watch(PATH.SRC.ASSETS, ['assets']);
  gulp.watch(PATH.SRC.STYLE, ['sass']);
});

gulp.task('default', function () {
  runSequence(
    'clean',
    'html',
	'assets',
    'sass'
  );
});