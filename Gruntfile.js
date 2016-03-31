module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    paths: {
      src: {
        js: 'client/*.js'
      },
      dest: {
        js: 'dist/public.js',
        jsMin: 'dist/public.min.js'
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'client/*.js', 'app/**/*.js'],
      options: {
        sub: true,
        expr: true
      }
    },

    uglify: {
      options: {
        compress: true,
        mangle: true,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      target: {
        src: '<%= paths.src.js %>',
        dest: '<%= paths.dest.jsMin %>'
      }
    },

    exec: {
      run_tests: {
        cmd: function() {
          return 'npm test';
        }
      }
    }

  });

  // Load the tasks plugins:
  // uglify
  grunt.loadNpmTasks('grunt-contrib-uglify');
  //jshint
  grunt.loadNpmTasks('grunt-contrib-jshint');
  //exect
  grunt.loadNpmTasks('grunt-exec');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'exec:run_tests']);

};
