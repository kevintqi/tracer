module.exports = function(grunt) {
    var pkg = grunt.file.readJSON("package.json");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            tar: ["setup/docker/*tgz"]
        },
        jshint: {
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
            src: [ "test/**/*.js" ]
          }
        }
    });

    grunt.loadTasks("./setup/grunt");
    
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-mocha-test");

    grunt.registerTask("docker", "Creates docker container ", ["clean:tar","docker-build", "clean:tar"]);
    grunt.registerTask("test", "Executes test", ["jshint", "mochaTest"]);
    grunt.registerTask("build", ["test", "docker"]);
    grunt.registerTask("default", ["build"]);
}