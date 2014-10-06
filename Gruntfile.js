module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var typescriptFiles = ['app/*.ts', 'app/**/*.ts', 'server.ts', 'server/**.ts', 'testing/**.ts'];

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
                options: { cwd: 'app/' },
                src: 'app/index.html',
                blocks: {
                    'controllers':  { src: '**/*Controller.js' },
                    'directives':   { src: '**/*Directive.js' },
                    'services':     { src: 'services/*Service.js' },
                }
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js',
                browsers: ['PhantomJS'],
            },
            coverage: {
                reporters: ['coverage'],
                singleRun: true,
            },
            unit: {
                reporters: ['progress', 'growl', 'coverage']
            },
            travis: {
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
                    module: 'commonjs',
                    target: 'es5'
                }
            }
        },
        watch: {
            "static": {
                files: ['app/**.js', 'app/**.html', 'app/**.css'],
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

    grunt.registerTask('clean', function() {
        var filesToDelete = grunt.file.expand('app/*.js*')
                .concat(grunt.file.expand('app/**/*.js*'))
                .concat(grunt.file.expand('app/*.css*'))
                .concat(grunt.file.expand('server/**.js*'));

        for (var i = 0; i < filesToDelete.length; i++) {
            grunt.file.delete(filesToDelete[i]);
        }
    });

    grunt.registerTask('build', ['clean', 'typescript', 'less', 'fileblocks']);
    grunt.registerTask('dev-watch', ['build', 'concurrent:target']);
    grunt.registerTask('server', ['build', 'connect', 'open', 'concurrent:target']);
    grunt.registerTask('test', ['build', 'karma:travis']);
    grunt.registerTask('heroku:production', ['build']);
    grunt.registerTask('default', ['server']);
}
