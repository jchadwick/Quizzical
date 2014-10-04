module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var typescriptFiles = ['*.ts','app/*.ts', 'app/**/*.ts', 'testing/*.ts'];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concurrent: {
            target: {
                options: { logConcurrentOutput: true },
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
        fileblocks: {
            options: {
                removeFiles: true,
            },
            'default': {
                src: 'index.html',
                blocks: {
                    'controllers': { src: 'app/**/*Controller.js' },
                    'directives': { src: 'app/**/*Directive.js' },
                    'services': { src: 'app/services/*Service.js' },
                }
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js',
                reporters: ['progress', 'growl']
            },
            coverage: {
                browsers: ['PhantomJS'],
                reporters: ['coverage'],
                singleRun: true,
            },
            unit: {
            },
            travis: {
                browsers: ['PhantomJS'],
                reporters: ['coverage'],
                singleRun: true,
            }
        },
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: { 'app/site.css': 'app/**.less' }
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
                files: ['index.html', 'app/**/*.js', 'app/**/*.html', 'app/**/*.css', '**/*.less'],
                options: {
                    livereload: true
                }
            },
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

    grunt.registerTask('preprocess', ['typescript', 'less', 'fileblocks']);
    grunt.registerTask('dev-watch', ['preprocess', 'concurrent:target']);
    grunt.registerTask('server', ['preprocess', 'connect', 'open', 'concurrent:target']);
    grunt.registerTask('test', ['preprocess', 'karma:travis']);
    grunt.registerTask('default', ['server']);
}
