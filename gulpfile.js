var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    server = require('gulp-develop-server'),
    livereload = require('gulp-livereload'),
    inject = require('gulp-inject'),
    angularFilesort = require('gulp-angular-filesort'),
    autoprefixer = require('gulp-autoprefixer');


var options = {
    path: './dodskrok.js'
};

var serverFiles = [
    './dodskrok.js',
    './routes/*.js'
];

gulp.task('server:start', function() {
    server.listen(options, livereload.listen);
});

// restart server if app.js changed
gulp.task('server:restart', function() {
    gulp.watch(['./app.js'], server.restart);
});

var tinylr;
gulp.task('livereload', function() {
    tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});


gulp.task('inject', function() {
    var target = gulp.src('./views/partials/footer.ejs');
    var sources = gulp.src(['./common/directives/**/*.js', './common/controllers/**/*.js']).pipe(angularFilesort());

    return target.pipe(inject(sources))
        .pipe(gulp.dest('./views/partials'));
});

gulp.task('watch', function() {
    gulp.watch(['./common/**/*.scss', './common/*.scss'], ['sass', 'prefixer']);
    gulp.watch(['./common/**/*.js'], ['inject']);
});

gulp.task('sass', function() {
    return sass('common/components.scss')
        .on('error', sass.logError)
        .pipe(gulp.dest('./public/css'));
});

gulp.task('prefixer', function() {
    return gulp.src('public/css/components.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('public/css'));
});

function notifyLiveReload(event) {
    var fileName = require('path').relative(__dirname, event.path);

    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}

// If server scripts change, restart the server and then livereload.
gulp.task('default', ['server:start', 'livereload', 'inject', 'watch'], function() {

    function restart(file) {
        server.changed(function(error) {
            if (!error) livereload.changed(file.path);
        });
    }

    gulp.watch(serverFiles).on('change', restart);
});
