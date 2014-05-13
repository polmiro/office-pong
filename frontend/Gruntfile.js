module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-compass");
  grunt.loadNpmTasks("grunt-replace");
  grunt.loadNpmTasks("grunt-react");
  grunt.loadNpmTasks("grunt-newer");

  modRewrite = require("connect-modrewrite");

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    clean: {
      output: ["compiled", "local"]
    },

    copy: {
      local: {
        files: [
        {
          expand: true,
          cwd: "src/html/",
          src: ["**/*"],
          dest: "local"
        },
        {
          expand: true,
          cwd: "bower_components/components-font-awesome/fonts",
          src: ["**/*"],
          dest: "local/fonts"
        },
        {
          expand: true,
          cwd: "src/fonts",
          src: ["**/*"],
          dest: "local/fonts"
        },
        {
          expand: true,
          cwd: "src/images/",
          src: ["**/*"],
          dest: "local/images"
        }]
      }
    },

    react: [
      {
        expand: true,
        cwd: "src",
        src: ["**/*.jsx"],
        dest: "compiled",
        ext: ".js"
      }
    ],

    compass: {
      local: {
        options: {
          sassPath: "src/stylesheets",
          imagesPath: "src/images",
          fontsPath: "src/fonts",
          importPath: [
            "bower_components/bootstrap-sass/vendor/assets/stylesheets",
            "bower_components/components-font-awesome/scss",
            "bower_components/circliful/css"
          ],
          httpFontsDir: "local/fonts",
          generatedImagesDir: "local/images",
          cssPath: "local/css",
          specify: "src/stylesheets/application.sass"
        }
      }
    },

    uglify: {
      local: {
        options: {
          mangle: false,
          compress: false,
          beautify: true,
          sourceMap: true,
          sourceMapIncludeSources: true,
        },
        files: {
          "local/js/application.js": [
            "bower_components/history.js/scripts/bundled/html5/native.history.js",
            "bower_components/superagent/superagent.js",
            "bower_components/jsuri/Uri.js",
            "bower_components/store.js/,store.js",
            "bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap.js",
            "bower_components/react/react-with-addons.js",
            "bower_components/react-async/react-async.js",
            "src/javascripts/lib/react-router-component.js",
            "bower_components/lodash/dist/lodash.js",
            "bower_components/moment/moment.js",
            "bower_components/react-bootstrap-bower/react-bootstrap.js",
            "bower_components/jquery/dist/jquery.min.js",
            "bower_components/circliful/js/jquery.circliful.js",
            "src/javascripts/constants/**/*.js",
            "src/javascripts/helpers/**/*.js",
            "src/javascripts/services/**/*.js",
            "src/javascripts/adapters/**/*.js",
            "src/javascripts/forms/**/*.js",
            "src/javascripts/app/*.js",
            "src/javascripts/mixins/**/*.js",
            "compiled/javascripts/components/**/*.js"
          ]
        }
      }
    },

    replace: {
      local: {}
    },

    connect: {
      server: {
        options: {
          base: ["local"],
          keepalive: true,
          debug: true,
          middleware: function(connect, options, middlewares) {
            middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]']));
            options.base.forEach(function(base) {
              middlewares.push(connect.static(base));
            });
            return middlewares;
          }
        }
      }
    },

    watch: {
      sass: {
       files: ["src/stylesheets/**/*.sass"],
        tasks: ["compass:local", "replace:local"],
        options: { interrupt: true }
      },
      jsx: {
        files: ["src/javascripts/**/*.js"],
        tasks: ["uglify:local", "replace:local"],
        options: { interrupt: true }
      },
      js: {
        files: ["src/javascripts/**/*.jsx"],
        tasks: ["newer:react", "uglify:local", "replace:local"],
        options: { interrupt: true }
      }
    }
  });

  grunt.registerTask("build", [
    "react",
    "copy:local",
    "compass:local",
    "uglify:local",
    "replace:local"
  ]);

  grunt.registerTask("server", ["connect"]);
  grunt.registerTask("default", ["clean", "build", "connect"]);
};
