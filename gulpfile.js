'use strict';
// Generated on 2015-05-11 using generator-wim 0.0.1

var gulp = require('gulp');
var open = require('open');
var del = require('del');
var path = require('path');
var wiredep = require('wiredep').stream;
var useref = require('gulp-useref');

// Load plugins
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

// //only get esri api if needed
//
//     var esrislurp = require('esrislurp');
//     gulp.task('download-esri-api', function(cb) {
//         esrislurp('src/lib/esri', '3.13', 'false', cb);
//     });
//
//
// //copy leaflet images

// Styles
gulp.task('styles', function () {
    return gulp.src(['src/styles/main.css'])
        .pipe(plugins.autoprefixer('last 1 version'))
        .pipe(gulp.dest('src/styles'))
        .pipe(plugins.size());
});

// Icons
gulp.task('icons', function () {
    return gulp.src(['src/bower_components/bootstrap/dist/fonts/*.*', 'src/bower_components/fontawesome/fonts/*.*', 'src/bower_components/themify-icons/fonts/*.*'])
        .pipe(gulp.dest('build/fonts'));
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src(['src/scripts/**/*.js'])
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.size());
});

// HTML
gulp.task('html', ['styles', 'scripts', 'icons'], function () {
    var jsFilter = plugins.filter('**/*.js');
    var cssFilter = plugins.filter('**/*.css');

    return gulp.src('src/*.html')
        .pipe(plugins.useref.assets())
        .pipe(jsFilter)
        .pipe(plugins.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(plugins.csso())
        .pipe(cssFilter.restore())
        .pipe(plugins.useref.restore())
        .pipe(plugins.useref())
        //.pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('build'))
        .pipe(plugins.size());
});

// Images
gulp.task('images', function () {
    return gulp.src([
        'src/images/**/*',
        'src/lib/images/*'])
        .pipe(gulp.dest('build/images'))
        .pipe(plugins.size());
});

// Clean
gulp.task('clean', function (cb) {
    del([
        'build/styles/**',
        'build/scripts/**',
        'build/images/**'
    ], cb);
});

// Build
gulp.task('build', ['html', 'images']);

// Default task
//make sure download-esri-api (if needed) is run just after clean, but before build
//gulp.task('default', ['clean', 'download-esri-api'], function () {
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

// Connect
gulp.task('connect', function () {
    plugins.connect.server({
        root: 'src',
        port: 9000,
        livereload: true
    });
});

// Open
gulp.task('serve', ['connect'], function () {
    open("http://localhost:9000");
});

// Inject Bower components
gulp.task('wiredep', function () {
    gulp.src('src/styles/*.css')
        .pipe(wiredep({
            directory: 'src/bower_components',
            ignorePath: 'src/bower_components/'
        }))
        .pipe(gulp.dest('src/styles'));

    gulp.src('src/*.html')
        .pipe(wiredep({
            directory: 'src/bower_components',
            ignorePath: 'src/'
        }))
        .pipe(gulp.dest('src'));
});

// Watch
gulp.task('watch', ['connect', 'serve'], function () {
    // Watch for changes in `src` folder
    gulp.watch([
        'src/*.html',
        'src/styles/**/*.css',
        'src/scripts/**/*.js',
        'src/images/**/*'
    ], function (event) {
        return gulp.src(event.path)
            .pipe(plugins.connect.reload());
    });

    // Watch .css files
    gulp.watch('src/styles/**/*.css', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

    // Watch bower files
    gulp.watch('bower.json', ['wiredep']);
});