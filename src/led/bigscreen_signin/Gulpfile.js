var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var del = require('del');
var rename = require("gulp-rename");
var isDev = process.env.NODE_ENV == 'develop';
gulp.task('clean', function () {
    del.sync([
        'build/**/*',
    ]);
});

gulp.task('script', function() {
    // 1. 找到文件
    gulp.src('scripts/*.js')
		.pipe(uglify({ mangle: false }))
        .pipe(gulp.dest('build/scripts'))
});

gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
    };
    if (isDev) {
      gulp.src('./index.html')
        .pipe(rename("./index_test.html"))
        .pipe(htmlmin(options))
        .pipe(gulp.dest('build/'));
    } else {
        gulp.src('./index.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('build/'));
    }
});

gulp.task('cssmin', function () {
    gulp.src('styles/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('build/styles'));
});

gulp.task('img',function(){
	gulp.src('images/*.png')
	.pipe(gulp.dest('build/images'));
});

gulp.task('svg',function(){
	gulp.src('svg/*.svg')
	.pipe(gulp.dest('build/svg'));
})

gulp.task('default',['clean','img','cssmin','script','htmlmin']);
