/*global module:false*/
module.exports = function(grunt) {

  var paths = {
    src: 'src',
    build: 'build'
  };

  var dateTime = '<%= grunt.template.today("yyyy-mm-dd HH:MM:SS") %>';
  var year = '<%= grunt.template.today("yyyy") %>';

  var banner = '/*!\n' +
      ' * <%= pkg.name %> - <%= pkg.version %> [build ' + dateTime + ']\n' +
      ' * @copyright ' + year + ' <%= pkg.author %>. All Rights Reserved.\n' +
      ' * @license <%= pkg.license %>; see LICENCE.\n' +
      ' * [<%= pkg.repository %>]\n' +
      ' */\n';

  var bannerMin = banner.replace(/\n/g, ' | ');

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    paths: paths,
    pkg: grunt.file.readJSON('package.json'),

    // Task configuration.
    clean: {
      build: ['<%= paths.build %>']
    },
    concat: {
      build: {
        files: {
          '<%= paths.build %>/jsonrpc.js': [
            '<%= paths.src %>/*.js'
          ]
        }
      },
      options: {
        banner: '(function(){\n',
        footer: '\n})();'
      }
    },
    ngmin: {
      build: {
        files: {
          '<%= paths.build %>/jsonrpc.ngmin.js': [
            '<%= paths.build %>/jsonrpc.js'
          ]
        }
      }
    },
    uglify: {
      build: {
        files: {
          '<%= paths.build %>/jsonrpc.min.js': [
            '<%= paths.build %>/jsonrpc.ngmin.js'
          ]
        }
      },
      options: {
        banner: banner
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          angular: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['<%= paths.src %>/**/*.js', 'test/**/*.js']
      }
    },
    karma: {
      unit: {
        configFile: 'unittest.conf.js',
        singleRun: true
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');;
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngmin');

  // Default task.
  grunt.registerTask('default', [
    'clean',
    'jshint',
    'karma',
    'concat',
    'ngmin',
    'uglify'
  ]);
};
