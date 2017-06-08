var gulp = require('gulp');
var plumber = require('gulp-plumber');
var ejs = require('gulp-ejs');
var compass = require('gulp-compass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var rename = require('gulp-rename');
var minimist = require('minimist');
var changed  = require('gulp-changed');
var del = require('del');
var runSequence = require('run-sequence');

var SCSS_FILE   = './source/sass/**/*.scss';

// EJS処理
gulp.task('ejs', function() {

    var env = minimist(process.argv.slice(2));
    if (env.dev) {
        data = {debug : true};
    } else {
        data = {debug : false};
    }

    // 対象にするファイル
    gulp.src(['./source/ejs/**/*.html', '!' + './source/ejs/**/_*.html'])
    .pipe(plumber())
    .pipe(ejs(data))
    // 出力先
    .pipe(gulp.dest('./develop/'))
});

/*
 * Compass
 */
gulp.task('compass',function(){
    gulp.src([SCSS_FILE])
        .pipe(plumber())
        .pipe(compass({
            config_file : 'config.rb',
            comments : false,
            css : './develop/css/',
            sass: './source/sass/',
            sourcemap: true
        }))
        .pipe(sourcemaps.write());
});


gulp.task('bsreload', function(){
  browserSync.reload();   // ファイルに変更があれば同期しているブラウザをリロード
});

gulp.task('js.concat', function() {
  return gulp.src('source/js/*.js')
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('develop/js'));
});

gulp.task('js.uglify', ['js.concat'], function() {
  return gulp.src('develop/js/main.js')
    .pipe(plumber())
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('html/js/'));
});

gulp.task('copy', function() {
    gulp.src('source/images/**/**/*.{jpg, png, gif, svg}', {base:'source/images/'})
        .pipe(changed( 'develop/images/' ))
        .pipe(gulp.dest('develop/images/'));

    gulp.src('source/js/lib/**/*', {base:'source/js/lib/'})
        .pipe(changed( 'develop/js/lib/' ))
        .pipe(gulp.dest('develop/js/lib/'));

    gulp.src('source/_debug/**/*', {base:'source/_debug/'})
        .pipe(changed( 'develop/_debug/' ))
        .pipe(gulp.dest('develop/_debug/'));
});

// watch処理
gulp.task('watch', ['compass', 'ejs', 'js.concat', 'copy'], function () {
  browserSync({
      server: {
          baseDir: "./develop/" // ルートとなるディレクトリを指定
      }
  });
    gulp.watch('./source/ejs/**/*.html', ['ejs']);
    gulp.watch('./source/sass/**/*.scss', ['compass']);
    gulp.watch('./source/js/**/*.js', ['js.concat']);
    gulp.watch(['./source/images/**/**/*.{jpg, png, gif, svg}', './source/js/lib/**/*', './source/_debug/**/*'], ['copy', 'bsreload']);
    gulp.watch(["./develop/*.html", "./develop/css/*.css", "./develop/js/*.js"], ['bsreload']);
});

// build

gulp.task('clean', function(cb){
    return del('html');
});
gulp.task('initialize', function(){
    gulp.src('source/images/**/**/*.{jpg, png, gif, svg}', {base:'source/images/'})
        .pipe(gulp.dest('html/images/'));

    gulp.src('source/js/lib/**/*', {base:'source/js/lib/'})
        .pipe(gulp.dest('html/js/lib/'));
});

gulp.task('css', function(){
    gulp.src('develop/css/**/*.css', {base:'develop/css/'})
        .pipe(gulp.dest('html/css/'));
});

gulp.task('html', function(){

    var env = minimist(process.argv.slice(2));
    if (env.dev) {
        data = {debug : true};
    } else {
        data = {debug : false};
    }

    // 対象にするファイル
    gulp.src(['./source/ejs/**/*.html', '!' + './source/ejs/**/_*.html'])
        .pipe(plumber())
        .pipe(gulp.dest('./html/'))

});

gulp.task('build', function(done) {
    runSequence(
        'clean',
        'initialize',
        'compass',
        'html',
        'css',
        'js.concat',
        'js.uglify',
        done);
});