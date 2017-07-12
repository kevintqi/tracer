module.exports = (grunt)=>{
	grunt.initConfig({
		eslint:{
			options:{
				configFile: "setup/eslint.json"
			},
			target: ["index.js"]
		},
		jsdoc: {
			dist : {
                src: [ "index.js","src/**/*.js" ],
                options: {
                    destination: "docs",
                    readme: "./README.md",
                    tutorials: "_docs/tutorials",
                    configure: "./conf.json",
                    template: "node_modules/docdash"
                }
            }
		}	
	});
	
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-jsdoc");
	
	grunt.registerTask("default", "Development lifecylce lint, test, docs", ["eslint", "jsdoc"]);
};