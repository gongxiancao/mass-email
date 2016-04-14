'use strict';

var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins(),
  merge = require('merge-stream'),
  paths = require('./paths.json'),
  runSequence = require('run-sequence'),
  del = require('del');

gulp.task('clean:dist', function() {
  return del([paths.dist.root]);
});

gulp.task('copy:dist', function() {
  return merge(
    gulp.src([paths.server.root + '/**/*'], {
      base: '.'
    })
    .pipe(gulp.dest(paths.dist.root)),
    gulp.src(['package.json'], {
      base: '.'
    })
    .pipe(gulp.dest(paths.dist.server)),
    gulp.src(paths.tmp.distAssets, {
      base: paths.tmp.root
    })
    .pipe(gulp.dest(paths.dist.client))
  );
});

gulp.task('minify:client', function() {
  return gulp.src(paths.tmp.mainView)
    .pipe(plugins.useref())
    .pipe(plugins.if('*.js', plugins.ngAnnotate({
      add: true
    })))
    .pipe(plugins.if('*.js', plugins.uglify({
      mangle: true
    })))
    .pipe(plugins.if('*.css', plugins.cleanCss({
      compatibility: 'ie8'
    })))
    .pipe(plugins.if('*.js', plugins.rev()))
    .pipe(plugins.if('*.css', plugins.rev()))
    .pipe(plugins.revReplace())
    .pipe(gulp.dest(paths.tmp.root));
});

gulp.task('build:dist', function(cb) {
  runSequence(
    'build:dev', 'minify:client',
    'clean:dist', 'copy:dist',
    cb);
});

gulp.task('staging', function(cb) {
  runSequence(
    'build:dist', ['start:server', 'start:client', 'watch'],
    cb);
});
