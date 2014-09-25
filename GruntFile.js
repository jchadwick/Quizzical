module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var typescriptFiles = ['app/*.ts','app/**/*.ts','testing/*.ts'];

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
                    port: 3000,
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
            all: {
                src: typescriptFiles,
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
        	}
        },
        open: {
            dev: {
                path: 'http://localhost:3000/'
            }
        }
    });


    // --with-ts command line option (for non-Visual Studio editors)
    if (grunt.option('with-ts')) {

        grunt.config.set('watch.typescript', {
            files: typescriptFiles,
            options: { spawn: false },
            tasks: ['typescript'],
        });

        // Only compile individual TypeScript files on change
        grunt.event.on('watch', function (action, filepath) {
            if (filepath.lastIndexOf('.ts') >= 1)
                grunt.config('typescript.all.src', filepath);
        });

    }

    grunt.registerTask('dev-watch', ['typescript', 'concurrent:target']);
    grunt.registerTask('server', ['typescript', 'connect', 'open', 'concurrent:target']);
    grunt.registerTask('test', ['typescript', 'karma:travis']);
    grunt.registerTask('default', ['server']);
}
