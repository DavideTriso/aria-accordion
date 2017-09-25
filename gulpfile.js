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
    .pipe(rename({
      suffix: '.min'
    }))
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



//HTML -> HTML
//Put a copy of HTML file to 'dist' folder
gulp.task('htmlDist', function () {
  gulp.src('src/html/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(notify({
      message: 'htmlDist task complete'
    }));
});


gulp.task('html', ['htmlDist']);



//WATCH TASKS

gulp.task('watchScss', function () {
  gulp.watch('src/scss/*.scss', ['scss']);
});


gulp.task('watchJS', function () {
  gulp.watch('src/js/*.js', ['js']);
});

gulp.task('watchHTML', function () {
  gulp.watch('src/html/*.html', ['html']);
});


gulp.task('watchAll', function () {
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch('src/scss/*.scss', ['scss']);
  gulp.watch('src/html/*.html', ['js']);
});
