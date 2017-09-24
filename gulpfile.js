//Require packages
var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify');


//SCSS -> CSS
//Compile SCSS and save compiled + minified CSS file to 'dist' folder
gulp.task('scssDist', function () {
  return sass('src/scss/*.scss', {
      style: 'expanded'
    })
    .pipe(autoprefixer('last 5 version'))
    .pipe(gulp.dest('dist'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(cssnano())
    .pipe(gulp.dest('dist'))
    .pipe(notify({
      message: 'scssDist task complete'
    }));
});

//Save a copy of compiled CSS in 'docs' folder
gulp.task('scssDocs', function () {
  return sass('src/scss/*.scss', {
      style: 'expanded'
    })
    .pipe(autoprefixer('last 5 version'))
    .pipe(gulp.dest('docs'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(notify({
      message: 'scssDocs task complete'
    }));
});

//Task alias
gulp.task('scss', ['scssDist', 'scssDocs']);


//JS -> JS + MIN.JS
//Put a copy and a minified version of JS file in 'dist' folder
gulp.task('jsDist', function () {
  gulp.src('src/js/*.js')
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .pipe(notify({
      message: 'jsDist task complete'
    }));
});

//Put a copy of JS file in 'docs' folder
gulp.task('jsDocs', function () {
  gulp.src('src/js/*.js')
    .pipe(gulp.dest('docs'))
    .pipe(notify({
      message: 'jsDocs task complete'
    }));
});

//Task alias
gulp.task('js', ['jsDist', 'jsDocs']);




//WATCH

gulp.task('watchScss', function () {
  gulp.watch('src/scss/*.scss', ['scss']);
});


gulp.task('watchJS', function () {
  gulp.watch('src/js/*.js', ['js']);
});
