'use strict';

var gulp      = require('gulp');
var nodemon   = require('gulp-nodemon');
var bs        = require('browser-sync').create();
var reload    = bs.reload;

// start our node server using nodemon
gulp.task('serve', function() {
  // nodemon({script: 'server/express-server.js'
  //   // ,ext: 'js html css', 
  //   // ignore: 'node_modules/**/*.js'
  // });
  bs.watch('./client/*').on('change', bs.reload);

  bs.init({
    proxy: 'localhost:3000'
  });

});

gulp.task('default', ['serve']);

