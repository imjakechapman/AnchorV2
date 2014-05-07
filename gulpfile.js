// Gulp Requires
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    rjs = require('gulp-requirejs'),
    clean = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    notify = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();
 
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
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe( gulp.dest(DIST + '/styles') )
    .pipe(livereload(server));
});




// Image Minification
gulp.task('compress-images', function () {
    return gulp.src( SRC + '/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest( DIST + '/images' ))
        .pipe(notify('Images compressed'));
});




// JS Build with R.js
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
  .pipe(gulp.dest(DIST + '/js'));
});



// Clean dist directory for rebuild
gulp.task('clean', function() {
  return gulp.src(DIST, {read: false})
    .pipe(clean());
});



// Do the creep, ahhhhhhh!
gulp.task('watch', function() {

  // Listen on port 35729
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err)
    }
      
    // Watch .scss files
    gulp.watch(SRC + '/styles/**/*.scss', ['scss']);

    // Watch image files
    gulp.watch( SRC + '/images/**/*', ['compress-images']);

  });

});

 
// Gulp Default Task
gulp.task('default', ['scss', 'watch']);
gulp.task('jsBuild', ['requirejsBuild']);
gulp.task('image-min', ['compress-images']);
