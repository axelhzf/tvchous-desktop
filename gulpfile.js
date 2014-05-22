var gulp = require("gulp");
var sass = require("gulp-sass");
var jade = require("gulp-jade");
var gutil = require("gulp-util");
var autoprefixer = require("gulp-autoprefixer");
var mocha = require("gulp-mocha");
var NwBuilder = require('node-webkit-builder');

var path = {
  client: {
    sass: "app/client/scss/**/*.scss",
    views: "app/client/views/**/*.jade"
  },
  dist: {
    css: "app/dist/css",
    views: "app/dist/views/"
  }
};

gulp.task("sass", function () {
  gulp.src(path.client.sass)
    .pipe(sass())
    .pipe(autoprefixer({cascade: true}))
    .on("error", gutil.log)
    .pipe(gulp.dest(path.dist.css))
});

gulp.task("views", function () {
  gulp.src(path.client.views)
    .pipe(jade())
    .on("error", gutil.log)
    .pipe(gulp.dest(path.dist.views));
});

gulp.task("watch", ["sass", "views"], function () {
  gulp.watch(path.client.sass, ["sass"]);
  gulp.watch(path.client.views, ["views"]);
});

gulp.task("test", function () {
  gulp.src([
    "client/js/model/Episode.js",
    "test/**/*.spec.js"
  ]).pipe(mocha())
});

gulp.task("nw", function (callback) {
  var nw = new NwBuilder({
    version: '0.9.2',
    files: ["./app/**"],
    platforms: ['osx'],
    appName: "TvChous"
  });

  // Log stuff you want
  nw.on('log', function (mgs) {
    gutil.log('node-webkit-builder', mgs);
  });

  // Build retruns a promise
  nw.build(function (err) {
    console.log(arguments);
    if(err) {
      gutil.log('node-webkit-builder error', err);
    }
    callback();
    gutil.beep();
  });


});