'use strict';

var gulp      = require('gulp');
var dbTask    = require('gulp-db');
var shell     = require('gulp-shell')
var nodemon   = require('gulp-nodemon');
var bs        = require('browser-sync').create();
var reload    = bs.reload;

// var dbManager = dbTask({
//     host:'localhost',
//     database: "sList_dev",
//     dialect: 'postgresql'
// })
//  gulp.task('start', shell.task[
//   'psql CREATE DATABASE sList_dev'
// ]);
// gulp.task('drop', dbManager.drop('sList_dev'));
// gulp.task('create', dbManager.create("sList_dev"));
// gulp.task('reset', ['drop','create']);


gulp.task('serve', [], function() {
  //bs.watch('./client/*').on('change', bs.reload);

  bs.init(null, {
    proxy: 'localhost:3000',
    files: ['client/index.html'],
    browser: 'google chrome',
    port: 7000
  });
});

gulp.task('nodemon', ['serve'], function (cb) {

  var started = false;

  return nodemon({
    script: 'server/express-server.js'

  }).on('start', function () {
    if (!started) {
      cb();
      started = true; 
    }
  });
});

gulp.task('default', ['nodemon', 'serve'], function(){});

