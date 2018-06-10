"use strict";
const gulp = require("gulp"),
  rename = require("gulp-rename"),
  sourcemaps = require("gulp-sourcemaps"),
  sass = require("gulp-sass"),
  sassLint = require("gulp-sass-lint"),
  cssmin = require("gulp-clean-css"),
  htmlmin = require("gulp-htmlmin"),
  eslint = require("gulp-eslint"),
  concat = require("gulp-concat"),
  babel = require("gulp-babel"),
  uglify = require("gulp-uglify");

gulp.task("sassLint", () =>
  gulp.src("sass/**/*.s+(a|c)ss")
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
);

gulp.task("sass", () =>
  gulp.src("src/styles/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/styles"))
);

gulp.task("cssmin", () =>
  gulp.src("dist/styles/main.css")
    .pipe(cssmin({ compatibility: "ie8" }))
    .pipe(rename("main.min.css"))
    .pipe(gulp.dest("dist/styles"))
);

gulp.task("htmlmin", () =>
  gulp.src(["src/markup/*.html", "src/markup/**/*.html"])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("."))
);

gulp.task("eslint", () =>
  gulp.src(["**/*.js", "!node_modules/**", "!dist/**"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task("concat", () =>
  gulp.src("src/scripts/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("main.concat.js"))
    .pipe(babel({
      presets: ["env"]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/scripts"))
);

gulp.task("uglify", () =>
  gulp.src("dist/scripts/main.concat.js")
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest("dist/scripts"))
);

gulp.task("build:markup", gulp.series("htmlmin"));
gulp.task("build:styles", gulp.series("sassLint", "sass", "cssmin"));
gulp.task("build:scripts", gulp.series("eslint", "concat", "uglify"));

gulp.task("watch:markup", () =>
  gulp.watch("src/**/*.html", gulp.series("build:markup"))
);

gulp.task("watch:styles", () =>
  gulp.watch("src/**/*.scss", gulp.series("build:styles"))
);

gulp.task("watch:scripts", () =>
  gulp.watch("src/**/*.js", gulp.series("build:scripts"))
);

gulp.task("watch", gulp.parallel("watch:markup", "watch:styles", "watch:scripts"));
gulp.task("default", gulp.series("build:markup", "build:styles", "build:scripts"));
