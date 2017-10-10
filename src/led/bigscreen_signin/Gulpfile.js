var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var del = require('del');
var rename = require("gulp-rename");
var htmlreplace = require('gulp-html-replace');
// var connect = require('gulp-connect');
// var copyfile = require('gulp-file-copy');
var webserver = require('gulp-webserver');
gulp.task('webserver-dev', function() {
 gulp.src('build')
   .pipe(webserver({
     livereload: true,
     directoryListing: false,
     open: true,
     path:'/',
     fallback:'index.html'
   }));
});

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

gulp.task('htmlmin_production', function () {
    var options = {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
    };
    gulp.src('./index.html')
    .pipe(htmlreplace({
        'js': 'scripts/config.js'
    }))
    .pipe(htmlmin(options))
    .pipe(gulp.dest('build/'));
});
gulp.task('htmlmin_dev', function () {
    var options = {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
    };
    gulp.src('./index.html')
    .pipe(rename("./index_test.html"))
    .pipe(htmlreplace({
        'js': 'scripts/config_test.js'
    }))
    .pipe(htmlmin(options))
    .pipe(gulp.dest('build/'));
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

gulp.task('build',['clean','img','cssmin','script','htmlmin_production','htmlmin_dev']);
