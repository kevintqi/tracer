"use strict";

var _ = require("lodash");

module.exports=function(grunt){
    grunt.registerTask("docker-build", "docker-build", function(){
        let pkg = grunt.file.readJSON("package.json");
    	let taskConfig = {
				exec: {
					docker: {
						exitCode: [0, "ok", "npm info ok"], // npm install sends "npm info ok" exit code
						options:{
							timeout: 300000, // 5 minutes to create docker container
							maxBuffer: 6001024 // Increase if creating docker container fails
						},
						cmd: function() {
							var name = pkg.name,
								ver = pkg.version,
								cmd = "npm pack && mv "+name+"-"+ver+".tgz setup/docker/service.tgz && docker build -t="+name+":latest -t="+name+":"+ver+" setup/docker";
							return cmd;
						}
					}
				}	
			},
			config = _.assign(grunt.config.data, taskConfig);

    	grunt.initConfig( config );
        grunt.loadNpmTasks("grunt-exec");
        grunt.log.writeln(`Generating Image ${pkg.name}:${pkg.version}`);
        grunt.task.run("exec");
    });  
};