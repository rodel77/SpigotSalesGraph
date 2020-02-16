const gulp = require("gulp");
const zip = require("gulp-zip");
const fs = require("fs");
const {exec} = require("child_process");

let manifestFile = fs.readFileSync("manifest.json");
let manifest = JSON.parse(manifestFile);

exports.default = () => (
    gulp.src(["manifest.json", "source\\**", "icon*.png"]).pipe(zip("spigot_graph_dist_"+manifest.version+".zip")).pipe(gulp.dest("builds"))
);