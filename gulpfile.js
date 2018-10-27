//Require packages
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  rename = require('gulp-rename'),
  notify = require('gulp-notify');
sass.compiler = require('node-sass');


//SCSS -> CSS
//Compile SCSS and save compiled + minified CSS file to 'dist' folder
gulp.task('scssDist', function () {
  sass('src/scss/*.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 5 version'))
    .pipe(gulp.dest('dist'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'scssDist task complete' }));
});

//Save a copy of compiled CSS in 'docs' folder
gulp.task('scssDocs', function () {
  sass('src/scss/*.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 5 version'))
    .pipe(gulp.dest('docs'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(notify({ message: 'scssDocs task complete' }));
});

//JS -> JS + MIN.JS
//Put a copy and a minified version of JS file in 'dist' folder
gulp.task('jsDist', function () {
  gulp.src('src/js/*.js')
    .pipe(gulp.dest('dist'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'jsDist task complete' }));
});

//Put a copy of JS file in 'docs' folder
gulp.task('jsDocs', function () {
  gulp.src('src/js/*.js')
    .pipe(gulp.dest('docs'))
    .pipe(notify({ message: 'jsDocs task complete' }));
});


//HTML -> HTML
//Put a copy of HTML file to 'dist' folder
gulp.task('htmlDist', function () {
  gulp.src('src/html/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'htmlDist task complete' }));
});


//WATCH TASKS

gulp.task('watchAll', function () {
  gulp.watch('src/js/*.js', ['jsDist', 'jsDocs']);
  gulp.watch('src/scss/**/*.scss', ['scssDist', 'scssDocs']);
  gulp.watch('src/html/*.html', ['htmlDist']);
});
