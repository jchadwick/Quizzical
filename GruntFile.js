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
                    base: './'
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
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
            files: '**/*.ts',
            tasks: ['typescript']
        },
        open: {
            dev: {
                path: 'http://localhost:8080/index.html'
            }
        }
    });
 
    grunt.registerTask('default', ['connect', 'open', 'concurrent:target']);
 
}