var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var open = require('gulp-open');
var imageResize = require('gulp-image-resize');
var imagemin = require('gulp-imagemin');

var Paths = {
  HERE: './',
  DIST: 'dist/',
  CSS: './assets/css/',
  SCSS_TOOLKIT_SOURCES: './assets/scss/material-kit.scss',
  SCSS: './assets/scss/**/**'
};

gulp.task('compile-scss', function() {
  return gulp.src(Paths.SCSS_TOOLKIT_SOURCES)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write(Paths.HERE))
    .pipe(gulp.dest(Paths.CSS));
});

gulp.task('images', () => 
  gulp.src('assets/img/new-adds/*')
    .pipe(imagemin([
      imagemin.gifsicle({interlace: true}),
      imagemin.jpegtran({progressive:true}),
      imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(gulp.dest('optimized'))
);

gulp.task('watch', function() {
  gulp.watch(Paths.SCSS, ['compile-scss']);
});

gulp.task('open', function() {
  gulp.src('index.html')
    .pipe(open());
});

gulp.task('open-app', ['open', 'watch']);