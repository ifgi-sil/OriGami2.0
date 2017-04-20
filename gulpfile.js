var gulp = require('gulp');
var webserver = require('gulp-webserver');
var watch = require('gulp-watch');
var inject = require('gulp-inject');
var del = require('del');
var packageJson = require('./package.json');

gulp.task('copy_packages', function () {
  var modules = Object.keys(packageJson.dependencies);
  var moduleFiles = modules.map(function(module) {
    return 'node_modules/' + module + '/**';
  });

  return gulp.src(moduleFiles, { base: 'node_modules' })
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('clean', function (cb) {
  del.sync(['dist/**', '!dist']);
  cb();
});

gulp.task('webserver', function () {
  var stream = gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
  return stream;
});

gulp.task('watch', function () {
  return gulp.src('www/**/*')
    .pipe(watch('www/**/*'))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy', function (cb) {
  gulp.src('www/**/*')
    .pipe(gulp.dest('dist'));
  cb();
});

gulp.task('dev', ['clean', 'copy', 'copy_packages', 'watch', 'webserver']);

gulp.task('build', ['clean', 'copy', 'copy_packages']);
