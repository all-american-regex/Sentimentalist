'use strict';

var gulp      = require('gulp');
var nodemon   = require('gulp-nodemon');
var bs        = require('browser-sync').create();
var reload    = bs.reload;

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

