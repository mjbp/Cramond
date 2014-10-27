'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

gulp.task('js', function () {
   gulp.src('src/js/*.js')
      .pipe(concat('app.js'))
      .pipe(uglify())
      .pipe(gulp.dest('js'))
});
