var gulp = require('gulp');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('gulp-main-bower-files');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var minifyHTML = require('gulp-minify-html');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var gulpFilter = require('gulp-filter');
var sourcemaps = require('gulp-sourcemaps');
var angularFilesort = require('gulp-angular-filesort');
var watch = require('gulp-watch');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var browserSync = require('browser-sync').create();

var dirs = {
    app: 'public/app',
    dest: '_build',
    bower: 'bower_components',
    assets: 'public/assets'
};
var path = {
    serverJs: ['server/**/*.js', '!node_modules/**/*.js'],
    clientJs: [dirs.app + '/**/*.js'],
    jsFiles: ['*.js', '**/*.js', '!node_modules/**/*.js', dirs.app + '/**/*.js'],
    css: [
        dirs.bower + '/bootstrap/dist/css/bootstrap.min.css',
        dirs.bower + '/ng-alertify/dist/ng-alertify.css',
        dirs.assets + '/style/css/**.*css'
        ],
    indexFile: 'public/index.html'

};

gulp.task('style:js:server', function() {
    return gulp.src(path.serverJs)
        .pipe(jscs())
        .pipe(jscs.reporter());
});

gulp.task('serve', function() {
    var options = {
        script: 'server/app.js',
        delaytime: 0.5,
        env: {
            'PORT': 3000
        },
        watch: path.serverJs
    };

    return nodemon(options)
        .on('restart', function() {
            console.log('Restarting server');
        });

});
gulp.task('js:bower', function() {
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles())
        .pipe(gulpFilter('**/*.js'))
        .pipe(uglify())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('_build/js'));
});

gulp.task('inject', function() {
    var options = {
        ignorePath: '_build/'
    };
    var sources = gulp.src([
        dirs.dest + '/js/vendor.js',
        dirs.dest + '/js/app.js',
        dirs.dest + '/js/templates.js',
        dirs.dest + '/css/**.*css'
    ], {read: false});
    return gulp.src('_build/index.html')
        .pipe(inject(sources, options))
        .pipe(gulp.dest(dirs.dest));
});
gulp.task('js:debug', function() {
    gulp.src([
        dirs.app + '/app.js',
        dirs.app +  '/**/*.js'
    ]).pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(ngAnnotate())
        .pipe(angularFilesort())
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dirs.dest + '/js'))
        .pipe(browserSync.stream());
});
gulp.task('watch', function() {
    watch(dirs.app + '/**/*.js', executeTask('js:debug'));
    watch(dirs.app + '/**/*.html', executeTask('templates'));
    watch(dirs.assets + '/style/scss/**.*scss', executeTask('css:compile'));
    watch(path.serverJs, executeTask('style:js:server'));

    browserSync.init({
        logFileChanges: false,
        server: false
    });
});
gulp.task('templates', function() {
    return gulp.src(dirs.app + '/**/*.html').pipe(minifyHTML())
        .pipe(templateCache('templates.js', {module: 'InBrief', standalone: false}))
        .pipe(uglify())
        .pipe(gulp.dest(dirs.dest + '/js'))
        .pipe(browserSync.stream());
});
gulp.task('sass:compile', function() {
    var options = {
        ignorePath: '_build/'
    };
    return gulp.src([
      dirs.assets + '/style/scss/**.*scss',
      dirs.bower + '/Ionicons/scss/**/*.scss'])
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(dirs.assets + '/style/css'));
});
gulp.task('css:compile', ['sass:compile'], function() {
    return gulp.src(path.css)
        //.pipe(autoprefixer())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(dirs.dest + '/css'))
        .pipe(browserSync.stream());
});
gulp.task('favicon', function() {
    return gulp.src(dirs.assets + '/img/**.*ico')
        .pipe(gulp.dest(dirs.dest + '/img'));
});
gulp.task('index', function() {
    return gulp.src(path.indexFile)
        .pipe(gulp.dest(dirs.dest));
});
gulp.task('build', [
  'index',
  'favicon',
  'fix:alertify',
  'templates',
  'js:bower',
  'js:debug',
  'css:compile'], function() {
    return gulp.start('inject');
});
gulp.task('fix:alertify', function() {
    return gulp.src(dirs.bower + '/ng-alertify/dist/**.*js')
        .pipe(gulp.dest(dirs.bower + '/ng-alertify/'));
});

gulp.task('default', ['build'], function() {
    return gulp.start('serve');
});

function executeTask(name) {
    return function() {
        gulp.start(name);
    };
}
