gulp = require "gulp"
coffee = require "gulp-coffee"
sass = require "gulp-sass"
jade = require "gulp-jade"
gutil = require "gulp-util"
autoprefixer = require "gulp-autoprefixer"


path =
  client:
    coffee: "client/coffee/**/*.coffee"
    sass: "client/scss/main.scss"
    views: "client/views/**/*.jade"
  dist:
    js: "dist/js"
    css: "dist/css"
    views: "dist/views/"

gulp.task "coffee", ->
  gulp.src(path.client.coffee)
    .pipe(coffee({bare: true}))
    .on("error", gutil.log)
    .pipe(gulp.dest(path.dist.js))

gulp.task "sass", ->
  gulp.src(path.client.sass)
    .pipe(sass())
    .pipe(autoprefixer({cascade: true}))
    .on("error", gutil.log)
    .pipe(gulp.dest(path.dist.css))

gulp.task "views", ->
  gulp.src(path.client.views)
    .pipe(jade())
    .on("error", gutil.log)
    .pipe(gulp.dest(path.dist.views))

gulp.task "watch", ["sass", "coffee", "views"], ->
  gulp.watch path.client.sass, ["sass"]
  gulp.watch path.client.coffee, ["coffee"]
  gulp.watch path.client.views, ["views"]