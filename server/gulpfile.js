var gulp = require('gulp');
var jshint = require('gulp-jshint');
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
var wiredep = require('wiredep').stream;
var angularFilesort = require('gulp-angular-filesort');
var watch = require('gulp-watch');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var inject = require('gulp-inject');

var dirs = {
    app: '../public/app',
    dest: '../_build',
    bower: '../public/bower_components',
    assets: '../public/assets'
};
var path = {
    serverJs: ['../server/**/*.js', '!../server/node_modules/**/*.js'],
    clientJs: [dirs.app + '/**/*.js'],
    jsFiles: ['*.js', '**/*.js', '!node_modules/**/*.js', dirs.app + '/**/*.js'],
    css: [
        dirs.bower + '/bootstrap/dist/css/bootstrap.min.css',
        dirs.bower + '/ng-alertify/dist/ng-alertify.css',
        dirs.assets + '/style/css/**.*css'
        ],
    indexFile: '../public/index.html'

};

gulp.task('style', function() {
    return gulp.src(path.serverJs)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(livereload());

});

gulp.task('serve', ['style'], function() {
    var options = {
        script: 'app.js',
        delaytime: 0.5,
        env: {
            'PORT': 3000
        },
        watch: path.serverJs
    };
    return nodemon(options)
        .on('restart', ['style'], function() {
            console.log('Restarting');
        });
});
gulp.task('js:bower', function() {
    return gulp.src('../public/bower.json')
        .pipe(mainBowerFiles())
        .pipe(gulpFilter('**/*.js'))
        .pipe(uglify())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('../_build/js'))
        .pipe(livereload());
});

gulp.task('inject', function() {
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
gulp.task('js:debug', function() {
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
    watch(dirs.app + '/**/*.js', executeTask('build'));
    watch(dirs.app + '/**/*.js', executeTask('build'));
    watch(dirs.app + '/**/*.html', executeTask('build'));
    watch(dirs.assets + '/style/scss/**.*scss', executeTask('build'));
});
gulp.task('templates', function() {

    return gulp.src(dirs.app + '/**/*.html').pipe(minifyHTML())
        .pipe(templateCache('templates.js', {module: 'InBrief', standalone: false}))
        .pipe(uglify())
        .pipe(gulp.dest(dirs.dest + '/js'));
});
gulp.task('sass:compile', function() {
    var options = {
        ignorePath: '/../_build/'
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
        .pipe(gulp.dest(dirs.dest + '/css'));
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
  'templates',
  'js:bower',
  'js:debug',
  'css:compile'], function() {
      gulp.start('inject');
  });
gulp.task('fix:alertify', function() {
    return gulp.src(dirs.bower + '/ng-alertify/dist/**.*js')
        .pipe(gulp.dest(dirs.bower + '/ng-alertify/'));
});
gulp.task('start',function() {
    var options = {
        script: 'app.js',
        delaytime: 1,
        env: {
            'PORT': 3000
        }
    };
    return nodemon(options);
});

function executeTask(name) {
    return function() {
        gulp.start(name);
    };
}
