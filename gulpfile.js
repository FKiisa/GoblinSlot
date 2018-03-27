var all = require('gulp-all')
 
var styl_dir = 'path/to/styles/dir'
var js_dir   = 'path/to/scripts/dir'
 
function build() {
    return all(
        gulp.src(styl_dir + '/**/*')
            // build Styles 
            .pipe(gulp.dest('dist_dir')),
        gulp.src(js_dir + '/**/*')
            // build Scripts 
            .pipe(gulp.dest('dist_dir'))
    )
}
 
gulp.task('build', build)