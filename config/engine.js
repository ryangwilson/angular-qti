/* global module */
module.exports = function (grunt) {
    'use strict';

    var config = {
        name: '<%= name %>',
        banner: '/*\n* <%= name %> <%= version %>\n*/\n',
        sourcePath: '',
        tmpPath: '.tmp',
        buildPath: 'qti-1.2/build/qti/'
    };

    return {
        tasks: {
            "clean:engine": ["qti-1.2/build"],
            "copy:engine": {
                "files": [
                    {
                        "expand": true,
                        "cwd": "qti-1.2/src/themes/engine/css/",
                        "src": ["*/**"],
                        "dest": "qti-1.2/build/qti/css/"
                    }
                ]
            },
            "less:engine": {
                "files": {
                    "qti-1.2/build/qti/css/styles.css": "qti-1.2/src/themes/engine/css/main.less"
                }
            },
            "ngAnnotate:engine": {
                "options": {
                    "singleQuotes": true
                },
                "files": {
                    ".tmp/qti/qti.js": [
                        "qti-1.2/src/engine/vendors/**/**.js",
                        "qti-1.2/src/engine/**/**.js"
                    ]
                }
            },
            "ngtemplates:engine": {
                "cwd": "qti-1.2/src/themes/engine",
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
                    "qti-1.2/build/qti/qti.js": [
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
                    "qti-1.2/build/qti/qti.min.js": [
                        ".tmp/qti/qti.js",
                        '.tmp/qti/templates.js'
                    ]
                }
            }
        }
    };
};