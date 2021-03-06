var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var watch = require('gulp-watch');
var changed = require('gulp-changed');
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber');
var path = require('path');
var demon;


gulp.task("default", function () {
	return gulp.src("pure/**/*.js")
		.pipe(babel())
		.pipe(gulp.dest("build")).on('end', function () {
			require('./build/index.js');
			setTimeout(function () {
				console.log('timeout');
				process.exit()
			}, 30000);
		});
});

gulp.task("sourcemaps", function () {
	return gulp.src("pure/**/*.js")
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write("./maps"))
		.pipe(gulp.dest("build"));
});

gulp.task('serve', ['start'], function () {
	gulp.watch(["pure/**/*.js", "tests/**/*.js"], ['es6']);
});
gulp.task('serve-broker', ['start-broker'], function () {
	gulp.watch(["pure/broker.js", "tests/**/*.js"], ['es6']);
});

gulp.task('serve-worker', ['start-worker'], function () {
	gulp.watch(["pure/worker.js", "tests/**/*.js"], ['es6']);
});


gulp.task('es6', function () {
	return gulp.src(["pure/**/*.js", "tests/**/*.js"])
		.pipe(changed("build"))
		.pipe(plumber({
			errorHandler: function (e) {
				console.log('error', e);
			}
		}))
		.pipe(babel({
			"presets": ["es2015"]
		}))
		.pipe(gulp.dest("build"))
		.on('end', function () {
			console.log('build');
		});
})


gulp.task('start', function () {
	demon = nodemon({
		script: 'build/index.js',
		watch: ['build/'],
		execMap: {
			"js": "node  --harmony --harmony_proxies"
		},
		env: {
			'NODE_ENV': 'development'
		}
	});
});

gulp.task('start-broker', function () {
	demon = nodemon({
		script: 'build/broker.js',
		watch: ['build/'],
		execMap: {
			"js": "node  --harmony --harmony_proxies"
		},
		env: {
			'NODE_ENV': 'development'
		}
	});
});
gulp.task('start-worker', function () {
	demon = nodemon({
		script: 'build/worker.js',
		watch: ['build/'],
		execMap: {
			"js": "node  --harmony --harmony_proxies"
		},
		env: {
			'NODE_ENV': 'development'
		}
	});
});
