var path = require("path");
var gulp = require("gulp");
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var webserver = require('gulp-webserver');

var gutil = require("gulp-util");
var webpack = require("webpack");
// var WebpackDevServer = require("webpack-dev-server");

/* DEVELOPMEN */
// Copia html en public
gulp.task('copyHtml', function() {
    gulp.src('./app/index.html')
        .pipe(gulp.dest('./public/'))
        .pipe(livereload());
});

// Copia los estilos en public
gulp.task('copyCss', function() {
    gulp.src([
        './app/css/*',
        'bower_components/simplemde/dist/simplemde.min.css'
    ])
        .pipe(gulp.dest('./public/css/'))
})

// Copia las imagenes en public
gulp.task('copyImg', function() {
    gulp.src('./app/img/*')
        .pipe(gulp.dest('./public/img/'))
})

// Copia scripts que esten fuera del webpack en public
gulp.task('copyJs', function() {
    gulp.src([
        'bower_components/simplemde/dist/simplemde.min.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/jsdiff/diff.min.js'
    ])
        .pipe(gulp.dest('./public/js/'))
})

gulp.task('watch', function() {
    livereload.listen();

    // Javascripts
    gulp.watch('./app/js/main.js', ['webpack']);

    // Copia html
    gulp.watch('./app/*.html', function(file) {

        gulp.src(file.path)
            .pipe(gulp.dest('./public/'))
            .pipe(livereload());
    });

    // Copia css
    gulp.watch('./app/css/*.css', function(file) {
        gulp.src(file.path)
            .pipe(gulp.dest('./public/css/'))
            .pipe(livereload());
    });

});


// Ejecutando webpack
gulp.task("webpack", function(callback) {
    webpack({
        entry: {
            app: ["./app/js/main.js"]
        },
        output: {
            path: path.resolve(__dirname, "public", "js"),
            publicPath: "/js/",
            filename: "bundle.js"
        }
    }, function(err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);

        // Log stadisticas
        gutil.log("[webpack]", stats.toString({
            // output options
        }));

        // Reload navegador
        livereload.changed('public/js/main.js');

        callback();
    });
});

gulp.task('webserver', function() {
  gulp.src('public')
    .pipe(webserver({
    	// livereload: true,
      // directoryListing: true,
      // open: true
    }));
});

/* PRODUCCIÓN */
// Copia los estilos en public
gulp.task('copyCssProd', function() {
    gulp.src('./app/css/*')
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./public/css/'))
})




// Tarea por defecto
gulp.task("default", ['copyHtml', 'copyCss', 'copyImg', 'copyJs', 'webpack', 'watch', 'webserver']);