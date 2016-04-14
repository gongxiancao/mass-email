'use strict';

var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  through = require('through'),
  gutil = require('gulp-util'),
  plugins = gulpLoadPlugins(),
  http = require('http'),
  _ = require('lodash'),
  merge = require('merge-stream'),
  wiredep = require('wiredep'),
  open = require('open'),
  paths = require('./paths.json'),
  config,
  path = require('path'),
  serverPath = path.join(process.cwd(), 'server'),
  runSequence = require('run-sequence'),
  del = require('del');

function count(taskName, message) {
  var fileCount = 0;

  function countFiles(/*file*/) {
    fileCount++; // jshint ignore:line
  }

  function endStream() {
    gutil.log(gutil.colors.cyan(taskName + ': ') + fileCount + ' ' + message || 'files processed.');
    this.emit('end'); // jshint ignore:line
  }
  return through(countFiles, endStream);
}

function sortModulesFirst(a, b) {
    var module = /\.module\.js$/;
    var aMod = module.test(a.path);
    var bMod = module.test(b.path);
    // inject *.module.js first
    if (aMod === bMod) {
        // either both modules or both non-modules, so just sort normally
        if (a.path < b.path) {
            return -1;
        }
        if (a.path > b.path) {
            return 1;
        }
        return 0;
    } else {
        return (aMod ? -1 : 1);
    }
}

function checkAppReady(cb) {
  var options = {
    host: 'localhost',
    port: config.port
  };
  http
    .get(options, function () {
      cb(true);
    })
    .on('error', function () {
      cb(false);
    });
}

// Call page until first success
function whenServerReady(cb) {
  var serverReady = false;
  var appReadyInterval = setInterval(function () {
    checkAppReady(function (ready) {
        if (!ready || serverReady) {
            return;
        }
        clearInterval(appReadyInterval);
        serverReady = true;
        cb();
    });
  },
  100);
}

function onServerLog(log) {
  console.log(plugins.util.colors.white('[') +
    plugins.util.colors.yellow('nodemon') +
    plugins.util.colors.white('] ') +
    log.message);
}

gulp.task('clean:tmp', function () {
  return del(['.tmp/*']);
});

gulp.task('jshint:server', function () {
  return gulp.src(paths.server.scripts)
    .pipe(plugins.jshint('.jshintrc_server'))
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    // .pipe(plugins.jshint.reporter('fail')) to avoid shutdown gulp by warnings
    .pipe(count('jshint', 'files lint free'));
});

gulp.task('jshint:client', function () {
  return gulp.src(paths.client.scripts)
    .pipe(plugins.jshint('.jshintrc_client'))
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    // .pipe(plugins.jshint.reporter('fail')) to avoid shutdown gulp by warnings
    .pipe(count('jshint', 'files lint free'));
});

gulp.task('jshint', ['jshint:server', 'jshint:client']);


gulp.task('html2js', function () {
  return gulp.src(paths.client.modules, {base: 'client'})
    .pipe(plugins.foreach(function (stream, file) {
      var filename = path.basename(file.path);
      var moduleName = filename.replace(/.module.js$/, '');
      var moduleDir = path.dirname(file.path);

      // console.log(moduleName, file.path, file, file.base, file.cwd, Object.keys(file));

      var destPath = moduleDir.replace(path.join(file.cwd, file.base), paths.tmp.scriptRoot);
      return gulp.src(path.join(moduleDir, '/**/*.tpl.html'))
        .pipe(plugins.html2js(moduleName + '.tpl.js', {
          adapter: 'angular',
          base: 'client',
          name: 'me.' + moduleName + '.tpl'
        }))
        .pipe(gulp.dest(destPath));
    }));
});


gulp.task('inject', function () {
  var target = gulp.src(paths.tmp.mainView);
  var sources = gulp.src(_.union(paths.tmp.scripts, paths.tmp.templates, paths.tmp.styles), {read: false})
    .pipe(plugins.sort(sortModulesFirst));
  var bowerSources = gulp.src(paths.tmp.bowerStyles, {read: false});

  return target.pipe(plugins.inject(sources, {ignorePath: '../../client', relative: true}))
    .pipe(plugins.inject(bowerSources, {starttag: '<!-- inject:bower:{{ext}} -->', ignorePath: '../../client', relative: true}))
    .pipe(gulp.dest(paths.tmp.root));
});


gulp.task('wiredep:client', function () {
  var target = gulp.src(paths.tmp.mainView);
  return target.pipe(plugins.wiredep({
      exclude: [
        /bootstrap.js/
      ],
      ignorePath: '../../client/',
      fileTypes: {
        html: {
          replace: {
            js: '<script src="js/{{filePath}}"></script>'
          }
        }
      }
    }))
    .pipe(gulp.dest(paths.tmp.root));
});

// gulp.task('default', function () {
//     gulp.src(paths.client.modules)
//         .pipe(plugins.html2js('angular.js', {
//             adapter: 'angular',
//             base: 'templates',
//             name: 'angular-demo'
//         }))
//         .pipe(gulp.dest('dist/'));
// });

gulp.task('copy:tmp:assets', function () {
  return merge(
    gulp.src(paths.client.assets, {base: 'client/assets'})
    .pipe(gulp.dest(paths.tmp.root)),
    gulp.src(paths.client.mainView, {base: 'client'})
    .pipe(gulp.dest(paths.tmp.root))
  );
});

gulp.task('copy:tmp:bower', function () {
  var bowerFiles = wiredep({
    exclude: [
      /bootstrap.css/
    ]
  });
  return merge(
    gulp.src('client/bower_components/bootstrap/fonts/*')
      .pipe(gulp.dest(paths.tmp.fontRoot)),
    gulp.src('client/bower_components/font-awesome/fonts/*')
      .pipe(gulp.dest(paths.tmp.fontRoot)),
    gulp.src(_.union(bowerFiles.js, bowerFiles.css), {base: 'client'})
      .pipe(gulp.dest(paths.tmp.scriptRoot))
  );
});

gulp.task('copy:tmp:scripts', function () {
  var bowerFiles = wiredep();
  return gulp.src(paths.client.scripts, {base: 'client'})
    .pipe(gulp.dest(paths.tmp.scriptRoot));
});

gulp.task('less', function () {
  return gulp.src([paths.client.mainStyle, paths.client.bowerStyle])
    .pipe(plugins.lessSourcemap({
      sourceMap: {
        // sourceMapRootpath: '../less' // Optional absolute or relative path to your LESS files
      }
    }))
    .pipe(gulp.dest(paths.tmp.styleRoot));
});


gulp.task('start:client', function (cb) {
  whenServerReady(function () {
    open('http://localhost:' + config.port);
    cb();
  });
});

gulp.task('start:server', function () {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require(serverPath + '/config/env/' + process.env.NODE_ENV);

  plugins.nodemon('-w server server')
    .on('log', onServerLog);
});

gulp.task('watch', function () {
    plugins.livereload.listen();

    plugins.watch(paths.client.styles, function () {
      runSequence('less');
    });

    plugins.watch(paths.tmp.styles)
      .pipe(plugins.plumber())
      .pipe(plugins.livereload());

    plugins.watch(paths.client.scripts)
      .pipe(plugins.plumber())
      .pipe(gulp.dest(paths.tmp.scriptRoot))
      .pipe(plugins.livereload());

    plugins.watch(paths.client.templates, function () {
      runSequence('html2js');
    });

    plugins.watch(paths.tmp.templates)
      .pipe(plugins.plumber())
      .pipe(plugins.livereload());

    gulp.watch('bower.json', ['wiredep:client']);
});

var cucumber = require('gulp-cucumber');

gulp.task('cucumber', function() {
  return gulp.src('tests/features/*.feature').pipe(cucumber({
    steps: 'tests/features/step_definitions/*.js',
    support: 'tests/features/support/*js',
    format: 'pretty'
  }));
});

gulp.task('migrate:up', function(cb) {
  require('../server/migrate.js').up(cb);
});

gulp.task('migrate:down', function(cb) {
  require('../server/migrate.js').down(cb);
});

gulp.task('build:dev', function (cb) {
  runSequence(
    ['jshint', 'clean:tmp'],
    ['copy:tmp:assets', 'copy:tmp:bower', 'copy:tmp:scripts', 'html2js', 'less'],
    'inject',
    ['wiredep:client'],
    cb);
});

gulp.task('development', function (cb) {
  runSequence(
    'build:dev',
    ['start:server', 'start:client', 'watch'],
    cb);
});
