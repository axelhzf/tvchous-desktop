var gulp = require("gulp");
var sass = require("gulp-sass");
var jade = require("gulp-jade");
var gutil = require("gulp-util");
var autoprefixer = require("gulp-autoprefixer");

var path = {
  client: {
    sass: "client/scss/*.scss",
    views: "client/views/**/*.jade"
  },
  dist: {
    css: "dist/css",
    views: "dist/views/"
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
