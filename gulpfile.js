var gulp = require('gulp');

var minify = require('gulp-minify');
var uglify = require('gulp-uglify');
var pump = require('pump');
var babel = require('gulp-babel');
 
gulp.task('compress', function() {
  gulp.src(['plugins.js','plugins/lib/*.js'],{base: '.'})
     .pipe(babel({
         presets: ['es2015']
     }))
    .pipe(minify({
      noSource : true,
        ext:{min:'.min.js'}
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});
