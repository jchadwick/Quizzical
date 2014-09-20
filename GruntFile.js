module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concurrent: {
            target: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: ['karma:unit', 'watch']
            }
        },
        connect: {
            server: {
                options: {
                    port: 8080,
                    hostname: 'localhost',
                    base: './',
					livereload: true
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            },
            travis: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
        typescript: {
            base: {
                src: ['**/*.ts'],
                options: {
                    module: 'amd',
                    target: 'es5'
                }
            }
        },
        watch: {
        	"static": {
        		files: [ '**/*.css', '**/*.html', '**/*.js' ],
        		options: {
	        		livereload: true
        		}
        	},
        	typescript: {
                files: '**/*.ts',
	            tasks: ['typescript']
	    	}
        },
        open: {
            dev: {
                path: 'http://localhost:8080/index.html'
            }
        }
    });
 
    grunt.registerTask('default', ['connect', 'open', 'concurrent:target']);
    grunt.registerTask('test', ['typescript', 'karma:travis']); 
}