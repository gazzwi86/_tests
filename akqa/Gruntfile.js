module.exports = function(grunt) {

    var jsFiles = [
        'library/scripts/app.js'
    ];

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        compass: {
            dist: {
                options: {
                    sassDir: 'library/sass',
                    cssDir: 'library/css',
                    imagesDir: 'library/images',
                    fontsDir: 'library/fonts',
                    environment: 'production',
                    outputStyle: 'compressed',
                    noLineComments: true
                }
            },
            dev: {
                options: {
                    sassDir: 'library/sass',
                    cssDir: 'library/css',
                    imagesDir: 'library/images',
                    fontsDir: 'library/fonts',
                    environment: 'development',
                    outputStyle: 'expanded',
                    noLineComments: false
                }
            }
        },

        uglify: {
            dist: {
                options: {
                    mangle: false,
                    preserveComments: false,
                    drop_console: true,
                    compress: {
                        global_defs: {
                            DEBUG: false
                        }
                    }
                },
                files: {
                    'library/scripts/main.js': jsFiles
                }
            },
            dev: {
                options: {
                    mangle: false,
                    preserveComments: false,
                    compress: false,
                    beautify: true,
                    report: 'min'
                },
                files: {
                    'library/scripts/main.js': jsFiles
                }
            }

        },

        watch: {
            imagemin: {
                files: [
                    'library/images_raw/*.png',
                    'library/images_raw/*.jpg',
                    'library/images_raw/*.jpeg',
                    'library/images_raw/*.gif'
                ],
                tasks: ['imagemin']
            },
            sass: {
                files: ['library/sass/**/*.scss'],
                tasks: ['compass:dist']

            },
            scripts: {
                files: ['library/scripts/**/*.js'],
                tasks: ['uglify:dist']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['compass:dist', 'uglify:dist']);

};