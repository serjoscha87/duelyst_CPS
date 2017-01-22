var gulp = require('gulp');

var minify = require('gulp-minify');
var uglify = require('gulp-uglify');
var pump = require('pump');
var babel = require('gulp-babel');

var srcs = ['plugins.js', 'plugins/*.js'];
 
gulp.task('compress', function() {
  var path_switch=0;
  gulp.src(srcs)
     .pipe(babel({
         presets: ['es2015']
     }))
    .pipe(minify({
      noSource : true,
        ext:{
            min:'.min.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '.min.js']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(function(){
      return ++path_switch >1?'dist/plugins':'dist';
    }))
});

/*gulp.task('testUg', function() {
  gulp.src('plugins.js')
     .pipe(babel({
         presets: ['es2015']
     }))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});*/