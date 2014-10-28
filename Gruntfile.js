module.exports = function (grunt) {

    var tasks = [
        'ngtemplates',
        'ngAnnotate',
        'uglify',
        'less',
        'cssmin',
        'copy',
        'clean:tmp'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*\n' +
        '* <%= pkg.name %> <%= pkg.version %>\n' +
        '*/\n',
        jshint: {
            // define the files to lint
            files: ['scripts/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
                globals: {
                    loopfunc: false
                },
                ignores: [
                    'scripts/libs/**/*.js'
                ]
            }
        },
        less: {
            themes: {
                files: {
                    "qti-1.2/build/themes/engine/styles.css": "qti-1.2/src/themes/engine/css/main.less",
                    "qti-1.2/build/themes/pearsonvue/styles.css": "qti-1.2/src/themes/pearsonvue/css/main.less",
                    "qti-1.2/build/themes/summary/styles.css": "qti-1.2/src/themes/summary/css/main.less"
                }
            }
        },
        ngAnnotate: {
            engine: {
                files: {
                    '.tmp/1.2/qti.js': [
                        'qti-1.2/src/engine/bootstrap.js',
                        'qti-1.2/src/engine/consts.js',
                        'qti-1.2/src/engine/**/*.js'
                    ]
                }
            },
            pearsonvue: {
                files: {
                    '.tmp/1.2/pearsonvue.js': [
                        'qti-1.2/src/addons/pearsonvue/bootstrap.js',
                        'qti-1.2/src/addons/pearsonvue/consts.js',
                        'qti-1.2/src/addons/pearsonvue/**/*.js'
                    ]
                }
            },
            videogular: {
                files: {
                    '.tmp/1.2/videogular.js': [
                        'qti-1.2/src/addons/videogular/*.js',
                        'qti-1.2/src/addons/videogular/constants/*.js',
                        'qti-1.2/src/addons/videogular/directives/*.js',
                        'qti-1.2/src/addons/videogular/plugins/*.js',
                        'qti-1.2/src/addons/videogular/plugins/widgets/*.js',
                        'qti-1.2/src/addons/videogular/services/*.js'
                    ]
                }
            },
            videogular2: {
                files: {
                    '.tmp/1.2/videogular2.js': [
                        'qti-1.2/src/addons/videogular2/*.js',
                        'qti-1.2/src/addons/videogular2/plugins/*.js'
                    ]
                }
            }
        },
        uglify: {
            engine: {
                options: {
                    mangle: false,
                    compress: false,
                    preserveComments: 'some',
                    beautify: true,
                    exportAll: true,
                    banner: '<%= banner %>'
                },
                files: {
                    'qti-1.2/build/qti-1.2.js': ['.tmp/1.2/qti.js']
                }
            },
            engine_min: {
                options: {
                    report: 'min',
                    wrap: '<%= pkg.packageName %>',
                    banner: '<%= banner %>'
                },
                files: {
                    'qti-1.2/build/qti-1.2.min.js': ['.tmp/1.2/qti.js']
                }
            },
            pearsonvue: {
                options: {
                    mangle: false,
                    compress: false,
                    preserveComments: 'some',
                    beautify: true,
                    exportAll: true,
                    banner: '<%= banner %>'
                },
                files: {
                    'qti-1.2/build/addons/pearsonvue.js': ['.tmp/1.2/pearsonvue.js']
                }
            },
            pearsonvue_min: {
                options: {
                    report: 'min',
                    wrap: '<%= pkg.packageName %>',
                    banner: '<%= banner %>'
                },
                files: {
                    'qti-1.2/build/addons/pearsonvue.min.js': ['.tmp/1.2/pearsonvue.js']
                }
            },
            videogular: {
                options: {
                    mangle: false,
                    compress: false,
                    preserveComments: 'some',
                    beautify: true,
                    exportAll: true,
                    banner: '<%= banner %>'
                },
                files: {
                    'qti-1.2/build/addons/videogular.js': ['.tmp/1.2/videogular.js'],
                    'qti-1.2/build/addons/videogular2.js': ['.tmp/1.2/videogular2.js']
                }
            },
            videogular_min: {
                options: {
                    report: 'min',
                    wrap: '<%= pkg.packageName %>',
                    banner: '<%= banner %>'
                },
                files: {
                    'qti-1.2/build/addons/videogular.min.js': ['.tmp/1.2/videogular.js']
                }
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    //{expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'},

                    // includes files within path and its sub-directories
                    {
                        expand: true,
                        cwd: 'qti-1.2/src/themes/engine/css/',
                        src: ['*/**'],
                        dest: 'qti-1.2/build/themes/engine/'
                    },

                    // makes all src relative to cwd
                    //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

                    // flattens results to a single level
                    //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
                ]
            }
        },
        ngtemplates: {
            'summary': {
                cwd: 'qti-1.2/src/themes/summary',
                src: 'templates/**.html',
                dest: 'qti-1.2/build/themes/summary/templates.js',
                options: {
                    module: 'qti',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true, // Only if you don't use comment directives!
                        removeEmptyAttributes: false,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                }
            },
            'engine': {
                cwd: 'qti-1.2/src/themes/engine',
                src: 'templates/**.html',
                dest: 'qti-1.2/build/themes/engine/templates.js',
                options: {
                    module: 'qti',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true, // Only if you don't use comment directives!
                        removeEmptyAttributes: false,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                }
            },
            'pearsonvue': {
                cwd: 'qti-1.2/src/themes/pearsonvue',
                src: 'templates/**.html',
                dest: 'qti-1.2/build/themes/pearsonvue/templates.js',
                options: {
                    module: 'qti',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true, // Only if you don't use comment directives!
                        removeEmptyAttributes: false,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                }
            }
        },
        cssmin: {
            summary: {
                options: {
                    banner: '/* My minified css file */'
                },
                files: {
                    'qti-1.2/build/themes/summary/styles.css': ['qti-1.2/src/themes/summary/css/style.css']
                }
            },
            pearsonvue: {
                options: {
                    banner: '/* My minified css file */'
                },
                files: {
                    'qti-1.2/build/themes/pearsonvue/styles.css': ['qti-1.2/src/themes/pearsonvue/css/style.css']
                }
            }
        },
        clean: {
            build: ['<%= pkg.buildDir %>'],
            tmp: ['.tmp']
        }
    });

    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-wrap');

    grunt.registerTask('default', tasks);

};