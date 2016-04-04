var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    uglify = require('gulp-uglify'),
    mainBowerFiles = require('gulp-main-bower-files'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    minifyHTML = require('gulp-minify-html'),
    templateCache = require('gulp-angular-templatecache'),
    ngAnnotate = require('gulp-ng-annotate'),
    gulpFilter = require('gulp-filter'),
    sourcemaps = require('gulp-sourcemaps'),
    wiredep = require('wiredep').stream,
    angularFilesort = require('gulp-angular-filesort'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    inject = require('gulp-inject');

var dirs = {
    app: '../public/app',
    dest: '../_build',
    bower: '../public/bower_components',
    assets: '../public/assets'
};
var path = {
    serverJs: ['../server/**/*.js', '!../server/node_modules/**/*.js'],
    clientJs: [dirs.app + '/**/*.js'],
    jsFiles:['*.js', '**/*.js', '!node_modules/**/*.js', dirs.app + '/**/*.js'],
    css: [dirs.bower + '/bootstrap/dist/css/bootstrap.min.css', dirs.assets + '/style/css/**.*css']
};

gulp.task('style', function () {
    return gulp.src(path.serverJs)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs())
        .pipe(jscs.reporter());

});

gulp.task('serve', ['style'], function () {
    var options = {
        script: 'app.js',
        delaytime: 1,
        env: {
            'PORT': 3000
        },
        watch: path.serverJs
    };

    return nodemon(options)
        .on('restart', function (ven) {
            console.log('Restarting');
        });
});
gulp.task('js:bower', function() {
    return gulp.src('../public/bower.json')
        .pipe(mainBowerFiles())
        .pipe(gulpFilter('**/*.js'))
        .pipe(uglify())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('../_build/js'));
});

gulp.task('inject', function () {
    var options = {
        ignorePath: '/../_build/'
    };
    var sources = gulp.src([
        dirs.dest + '/js/vendor.js',
        dirs.dest + '/js/app.js',
        dirs.dest + '/js/templates.js',
        dirs.dest + '/css/**.*css'
    ], {read: false});
    return gulp.src('../_build/index.html')
        .pipe(inject(sources, options))
        .pipe(gulp.dest(dirs.dest));
});
gulp.task('js:debug',function() {
    gulp.src([
        dirs.app + '/app.js',
        dirs.app +  '/**/*.js'
    ]).pipe(ngAnnotate())
        .pipe(angularFilesort())
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dirs.dest + '/js'));
});
gulp.task('watch', function() {
    watch(dirs.app + '/**/*.js', executeTask('style'));
    watch(dirs.app + '/**/*.js', executeTask('js:debug'));
    watch(dirs.dest + '/js/**/*.js', executeTask('inject'));
    watch(path.serverJs, executeTask('style'));
});
gulp.task('templates', function() {
    var opts = {
        conditionals: true,
        spare:true
    };
    return gulp.src(dirs.app + '/**/*.html').pipe(minifyHTML())
        .pipe(templateCache('templates.js', {module: 'InBrief', standalone: false}))
        .pipe(uglify())
        .pipe(gulp.dest(dirs.dest + '/js'));
});
gulp.task('sass:compile', function() {
    return gulp.src(dirs.assets + '/style/scss/**.*scss')
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(dirs.assets + '/style/css'));
});
gulp.task('css:compile', ['sass:compile'], function() {
    return gulp.src(path.css)
        .pipe(autoprefixer())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(dirs.dest + '/css'));
})

function executeTask(name) {
    return function() {
        gulp.start(name);
    };
}
