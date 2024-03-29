var gulp = require("gulp");
var less = require("gulp-less");
var jade = require("gulp-jade");
var gutil = require("gulp-util");
var autoprefixer = require("gulp-autoprefixer");
var mocha = require("gulp-mocha");
var NwBuilder = require('node-webkit-builder');
var zip = require("gulp-zip");
var rename = require("gulp-rename");

var path = {
  client: {
    less: "app/client/less",
    views: "app/client/views/**/*.jade"
  },
  dist: {
    css: "app/dist/css",
    views: "app/dist/views/"
  }
};

gulp.task("less", function () {
  gulp.src(path.client.less + "/main.less")
    .pipe(less({
      paths: ["app/dist/components"]
    }))
    .on("error", gutil.log)
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

gulp.task("watch", ["less", "views"], function () {
  gulp.watch(path.client.less + "/*.less", ["less"]);
  gulp.watch(path.client.views, ["views"]);
});

gulp.task("test", function () {
  gulp.src([
    "client/js/model/Episode.js",
    "test/**/*.spec.js"
  ]).pipe(mocha())
});

gulp.task("zip", function () {
  return gulp.src([
    "./app/**",
    "!./app/tmp/**"
  ]).pipe(zip("build.nw"))
    .pipe(gulp.dest("build"));
});

gulp.task("nw", function (callback) {
  var nw = new NwBuilder({
    version: '0.9.2',
    files: ["./app/**"],
    platforms: ["osx"],
    appName: "TvChous",
    appVersion: "0.0.2"
  });

  // Log stuff you want
  nw.on('log', function (mgs) {
    gutil.log('node-webkit-builder', mgs);
  });

  // Build retruns a promise
  nw.build(function (err) {
    console.log(arguments);
    if (err) {
      gutil.log('node-webkit-builder error', err);
    }
    callback();
    gutil.beep();
  });

});
