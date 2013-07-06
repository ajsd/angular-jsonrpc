/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  var paths = {
    src: 'src',
    build: 'build'
  };

  var date = '<%= grunt.template.today("yyyy-mm-dd") %>';
  var year = '<%= grunt.template.today("yyyy") %>';

  var bannerBase = [
    '/**!',
    ' * <%= pkg.name %> v<%= pkg.version %> [build ' + date + ']',
    ' * @copyright ' + year + ' <%= pkg.author %>. All Rights Reserved.',
    ' * @license <%= pkg.license %>; see LICENCE.',
    ' * [<%= pkg.repository.url %>]',
    ' */'
  ];

  var banner = bannerBase.join('\n') + '\n';

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
        banner: '(function(){\n"use strict";\n',
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
        node: true,
        browser: true,
        //es5: true,  // default
        esnext: true,
        bitwise: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        quotmark: 'single',
        regexp: true,
        undef: true,
        unused: true,
        strict: true,
        trailing: true,
        smarttabs: true,
        globals: {
          angular: false
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      libTest: {
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
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngmin');

  // Tasks
  grunt.registerTask('build', [
    //'jshint',
    'clean',
    'concat',
    'ngmin',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'karma',
    'build'
  ]);
};
