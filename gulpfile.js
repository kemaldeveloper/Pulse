const gulp = require('gulp')
const browserSync = require('browser-sync')
const babel = require('gulp-babel')
const sass = require('sass')
const uglify = require('gulp-uglify')
const gulpSass = require('gulp-sass')(sass)
const rename = require('gulp-rename')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')

// Static server
gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: 'src',
    },
  })
})

gulp.task('scripts', function () {
  return gulp
    .src('src/js/script.js')
    .pipe(
      babel({
        presets: ['@babel/env'],
      }),
    )
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.stream())
})

gulp.task('styles', function () {
  return gulp
    .src('src/sass/**/*.+(scss|sass)')
    .pipe(gulpSass({ outputStyle: 'compressed' }).on('error', gulpSass.logError))
    .pipe(
      rename({
        prefix: '',
        suffix: '.min',
      }),
    )
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream())
})

gulp.task('watch', function () {
  gulp.watch('src/sass/**/*.+(scss|sass)', gulp.parallel('styles'))
  gulp.watch('src/*.html').on('change', browserSync.reload)
  gulp.watch('src/js/script.js').on('change', gulp.parallel('scripts'))
})

gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'scripts'))
