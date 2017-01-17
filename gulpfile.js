var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create(),
	spritesmith = require('gulp.spritesmith'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	cssnano = require('gulp-cssnano'),
	rename = require("gulp-rename"),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	babel = require("gulp-babel");

// SERVER
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		}
	});
});

// SASS
gulp.task('sass', function () {
	return gulp.src('app/sass/**/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
		browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
		cascade: false
	}))
	.pipe(gulp.dest('app/css'));
});

// SPRITE
gulp.task('sprite', function () {
	var spriteData = gulp.src('app/img/icons/*.png').pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.css'
	}));
	return spriteData.pipe(gulp.dest('app/css'));
});

// SCRIPTS
gulp.task('scripts:libs', function() {
	return gulp.src('app/js/jquery-2.1.4.js')
	.pipe(uglify('jquery-2.1.4.min.js'))
	.pipe(gulp.dest('app/js'));
});
gulp.task('scripts:plugins', function() {
	return gulp.src([
		'bower_components/bPopup/jquery.bpopup.min.js',
		'bower_components/fancybox/source/jquery.fancybox.pack.js',
		'bower_components/owl.carousel/dist/owl.carousel.min.js',
		'bower_components/scrollme/jquery.scrollme.min.js',
		'bower_components/wow/dist/wow.min.js'
		])
	.pipe(concat('plugins.js'))
	.pipe(gulp.dest('app/js'));
});

// MINIFY JS
gulp.task('scripts:minify', function() {
	return gulp.src('app/js/babel/main.js')
	.pipe(babel())
	.pipe(uglify('main.min.js'))
	.pipe(gulp.dest('app/js/'));
});

// MINIFY CSS
gulp.task('css:minify', ['sass'], function() {
	return gulp.src(['app/css/*.css', '!app/css/*.min.css'])
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream:true}));
});

// WATCH
gulp.task('watch', ['browser-sync', 'sass', 'sprite','scripts:libs','scripts:plugins','scripts:minify', 'css:minify'], function () {
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/sass/**/*.scss', ['css:minify']);
	gulp.watch('app/js/**/*.js', browserSync.reload);
	gulp.watch('app/img/icons/*.png', ['sprite']);
	gulp.watch('app/js/main.js', ['scripts:minify']);
});

// BUILD
gulp.task('clear', function() {
	return del.sync('dist');
});
gulp.task('img:minify', function() {
	return gulp.src(['app/img/**/*', '!app/img/icons/**/*'])
	.pipe(imagemin())
	.pipe(gulp.dest('dist/img'));
});
gulp.task('copy', ['clear', 'img:minify'], function() {
	return gulp.src(['app/**/*', '!app/img/**/*'])
	.pipe(gulp.dest('dist'));
});
gulp.task('build', ['copy'], function() {
	return del.sync([
		'dist/sass',
		'dist/_uploaded',
		'dist/block_preview',
		'dist/README.md',
		'dist/robots.txt',
		'dist/css/*.css',
		'!dist/css/*.min.css',
		'dist/js/*.js',
		'!dist/js/*.min.js',
		'dist/img/icons'
	]);
});