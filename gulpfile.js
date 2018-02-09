var gulp = require('gulp');

// gulp plugins and utils
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var zip = require('gulp-zip');

// postcss plugins
var autoprefixer = require('autoprefixer');
var colorFunction = require('postcss-color-function');
var cssnano = require('cssnano');
var customProperties = require('postcss-custom-properties');
var easyimport = require('postcss-easy-import');

var swallowError = function swallowError(error) {
    gutil.log(error.toString());
    gutil.beep();
    this.emit('end');
};

var nodemonServerInit = function () {
    livereload.listen(1234);
};

gulp.task('build', ['css', 'hbs', 'js', 'partials'], function (/* cb */) {
    return nodemonServerInit();
});

gulp.task('partials', function () {
  return gulp.src('src/partials/**')
    .on('error', swallowError)
    .pipe(gulp.dest('dist/partials/'))
    .pipe(livereload());
});

gulp.task('hbs', function () {
  return gulp.src('src/*.hbs')
    .on('error', swallowError)
    .pipe(gulp.dest('dist/'))
    .pipe(livereload());
});

gulp.task('js', function () {
  return gulp.src('src/js/*.js')
    .on('error', swallowError)
    .pipe(gulp.dest('dist/assets/js/'))
    .pipe(livereload());
});

gulp.task('css', function () {
    var processors = [
        easyimport,
        customProperties,
        colorFunction(),
        autoprefixer({browsers: ['last 2 versions']}),
        cssnano()
    ];

    return gulp.src('src/css/*.css')
        .on('error', swallowError)
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/css/'))
        .pipe(livereload());
});

gulp.task('watch', function () {
    gulp.watch('src/css/**', ['css']);
});

gulp.task('zip', ['css', 'hbs', 'js', 'partials'], function() {
    var targetDir = 'release/';
    var themeName = require('./package.json').name;
    var filename = themeName + '.zip';

    return gulp.src([
        'dist/**',
    ])
        .pipe(zip(filename))
        .pipe(gulp.dest(targetDir));
});

gulp.task('default', ['build'], function () {
    gulp.start('watch');
});
