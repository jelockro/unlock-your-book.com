var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var open = require('gulp-open');
var imageResize = require('gulp-image-resize');
var imagemin = require('gulp-imagemin');
var resizer = require('gulp-images-resizer');
const flatMap = require('flat-map').default
const scaleImages = require('gulp-scale-images');
const bs = require('browser-sync').create(); // Create a browser sync instance


var Paths = {
  HERE: './',
  DIST: 'dist/',
  CSS: './assets/css/',
  SCSS_TOOLKIT_SOURCES: './assets/scss/material-kit.scss',
  SCSS: './assets/scss/**/**'
};

const twoVariantsPerFile = (file, cb) => {
  const pngFile = file.clone()
  pngFile.scale = {maxWidth: 500, maxHeight: 500, format: 'png'}
  const jpegFile = file.clone()
  jpegFile.scale = {maxWidth: 700, format: 'jpeg'}
  cb(null, [pngFile, jpegFile])
}

gulp.task('resizer', () => {
  return gulp.src('assets/img/new-adds/*.{jpeg,jpg,png,gif}')
  .pipe(flatMap(twoVariantsPerFile))
  .pipe(scaleImages())
  .pipe(gulp.dest('optimized/'));
});

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

gulp.task('resize', () => {
  return gulp.src('assets/img/new-adds/*.*')
    .pipe(resizer({
      format: "png",
      width: "50%"
    }))
    .pipe(gulp.dest('optimized/'));
});

gulp.task('watch', function() {
  gulp.watch(Paths.SCSS, ['compile-scss']);
});

gulp.task('open', function() {
  gulp.src('index.html')
    .pipe(open());
});

gulp.task('browser-sync', () => {
  bs.init({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('open-app', ['open', 'watch']);