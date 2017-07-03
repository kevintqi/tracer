module.exports = function(grunt) {
    var pkg = grunt.file.readJSON("package.json");
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bump: {
            commit: true,
            commitMessage: "Release v%VERSION%",
            createTag: true,
            tagName: "v%VERSION%",
            tagMessage: "Version %VERSION%",
            push: false,
            pushTo: "origin master"
        },
        clean: {
            tar: ["setup/docker/*.tgz"]  
        },
        watch: {
            backend: {
                tasks: ["jshint", "test"],
                files: [ "index.js", "src/**/*.js" ]
            },
            test:{
                files: [ "index.js", "src/**/*.js", "test/**/*.js"],
                tasks: ["test"]
            }
        },
        jshint: {
          //To search for warning exceptions visit http://jslinterrors.com
          options:{
            jshintrc: "./setup/.jshintrc",
            ignores: [
                "test/**/*.*",
                "node_modules/**/*.*"
            ],
            reporter: require("jshint-stylish")
          },
          all: [ "src/**/*.js" ]
        },
        mochaTest: {
          test: {
            options: {
              reporter: "spec"
            },
            src: [ "test/**/*.spec.js" ]
          }
        },
        jsdoc: {
            dist : {
                src: [ "src/**/*.js" ],
                options: {
                    destination: "dist/doc"
                }
            }
        },
        plato: {
          check: {
            options:{
              jshint : grunt.file.readJSON("setup/.jshintrc")
            },
            files: {
              "dist/report/plato": [ "index.js", "src/**/*.js" ]
            }
          }
        },
        mocha_istanbul: {
            coverage: {
                src: "test", 
                options: {
                    mask: "**/*.spec.js",
                    coverageFolder: "dist/report/coverage"
                }
            }
        }
    });

    grunt.loadTasks("./setup/grunt");
    
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-bump");
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks("grunt-mocha-istanbul");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-plato");

    grunt.registerTask("test", "Executes unit test and calculates coverage", ["jshint", "mochaTest"]);
    grunt.registerTask("build", ["test", "jsdoc"]);
    grunt.registerTask("default", ["build"]);
};