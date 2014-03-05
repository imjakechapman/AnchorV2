// Gulp Requires
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    rjs = require('gulp-requirejs');
 
// Node requires for exec and sys
var exec = require('child_process').exec,
    sys = require('sys');
 
// Directories
var SRC = 'public/assets',
    DIST = 'public/dist';
 
// SCSS Compiling and Minification
gulp.task('scss', function(){
  return gulp.src(SRC + '/styles/app.scss')
    .pipe( 
      sass({
        outputStyle: 'expanded',
        debugInfo: true,
        lineNumbers: true,
        errLogToConsole: false,
        onSuccess: function(){
          notify().write({ message: "SCSS Compiled successfully!" });
        },
        onError: function(err) {
          gutil.beep();
          notify().write(err);
        }
      })
    )
    .pipe( gulp.dest(DIST + '/styles') )
    .pipe(livereload());
});

// Build JS through R.js
gulp.task('requirejsBuild', function() {
  rjs({
      baseUrl: SRC + '/js/',
      mainConfigFile: SRC + '/js/app.js',
      paths: {
        jquery: 'empty:',
        _common: 'modules/_common'
      },
      optimize: "uglify2",
      name: 'main',
      out: 'main.min.js'
  })
  .pipe(uglify())
  .pipe(gulp.dest(DIST + '/js'))
  .pipe(notify('JS Build Complete'));
});

// Gulp Watcher
gulp.task('watch', function() {
  gulp.watch(SRC + '/styles/**/*.scss', ['scss']);
  gulp.watch(SRC + '/js/**/*.js', ['jsBuild']);
});
 
// Gulp Default Task
gulp.task('default', ['scss', 'watch']);
gulp.task('jsBuild', ['requirejsBuild']);