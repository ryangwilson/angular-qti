/* global module */
module.exports = function (grunt) {
    'use strict';

    var config = {
        name: '<%= name %>',
        banner: '/*\n* <%= name %> <%= version %>\n*/\n',
        sourcePath: '',
        tmpPath: '.tmp',
        buildPath: 'build/qti/'
    };

    return {
        tasks: {
            "clean:engine": ["build/qti"],
            "copy:engine": {
                "files": [
                    {
                        "expand": true,
                        "cwd": "src/themes/engine/css/",
                        "src": ["*/**"],
                        "dest": "build/qti/css/"
                    }
                ]
            },
            "less:engine": {
                "files": {
                    "build/qti/css/styles.css": "src/themes/engine/css/main.less"
                }
            },
            "ngAnnotate:engine": {
                "options": {
                    "singleQuotes": true
                },
                "files": {
                    ".tmp/qti/qti.js": [
                        "src/*.js",
                        "src/plugins/videogular/videogular.js",
                        "src/plugins/videogular/plugins/*.js",
                        "src/directives/**/**.js",
                        "src/filters/**/**.js",
                        "src/vendors/**/**.js"
                    ]
                }
            },
            "ngtemplates:engine": {
                "cwd": "src/themes/engine",
                "src": "templates/**.html",
                "dest": ".tmp/qti/templates.js",
                "options": {
                    "module": "qti",
                    "htmlmin": {
                        "collapseBooleanAttributes": true,
                        "collapseWhitespace": true,
                        "removeAttributeQuotes": true,
                        "removeComments": true,
                        "removeEmptyAttributes": false,
                        "removeRedundantAttributes": true,
                        "removeScriptTypeAttributes": true,
                        "removeStyleLinkTypeAttributes": true
                    }
                }
            },
            "string-replace:engine": {
                files: {'.tmp/qti/qti.js': '.tmp/qti/qti.js'},
                options: {
                    replacements: [
                        { // fix up module declaration - angular.module('qti.plugins.videogular', [])
                            pattern: '"com.2fdevs.videogular"',
                            replacement: '"qti.plugins.videogular"'
                        },
                        { // fixes up so there is only one module decaration - angular.module('qti.plugins.videogular')
                            pattern: /angular.module\("(com.2fdevs.videogular.*)?\)/gim,
                            replacement: 'angular.module("qti.plugins.videogular")'
                        }
                    ]
                }
            },
            "uglify:engine": {
                "options": {
                    "mangle": false,
                    "compress": false,
                    "preserveComments": "none",
                    "beautify": true,
                    "exportAll": true,
                    "banner": config.banner
                },
                "files": {
                    "build/qti/qti.js": [
                        ".tmp/qti/qti.js",
                        '.tmp/qti/templates.js'
                    ]
                }
            },
            "uglify:engine_min": {
                "options": {
                    "report": "min",
                    "wrap": config.name,
                    "banner": config.banner
                },
                "files": {
                    "build/qti/qti.min.js": [
                        ".tmp/qti/qti.js",
                        '.tmp/qti/templates.js'
                    ]
                }
            }
        }
    };
};