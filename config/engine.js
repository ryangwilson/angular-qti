/* global module */
module.exports = function (grunt) {
    'use strict';

    var config = {
        name: '<%= name %>',
        banner: '/*\n* <%= name %> <%= version %>\n*/\n'
    };

    return {
        tasks: {
            "clean:engine": ["qti-1.2/build/themes/engine", "qti-1.2/build/qti.js", "qti-1.2/build/qti.min.js"],
            "copy:engine": {
                "files": [
                    {
                        "expand": true,
                        "cwd": "qti-1.2/src/themes/engine/css/",
                        "src": ["*/**"],
                        "dest": "qti-1.2/build/themes/engine/"
                    }
                ]
            },
            "less:engine": {
                "files": {
                    "qti-1.2/build/themes/engine/styles.css": "qti-1.2/src/themes/engine/css/main.less"
                }
            },
            "ngAnnotate:engine": {
                "options": {
                    "singleQuotes": true
                },
                "files": {
                    ".tmp/1.2/qti.js": [
                        "qti-1.2/src/engine/vendors/**/**.js",
                        "qti-1.2/src/engine/**/**.js"
                    ]
                }
            },
            "ngtemplates:engine": {
                "cwd": "qti-1.2/src/themes/engine",
                "src": "templates/**.html",
                "dest": "qti-1.2/build/themes/engine/templates.js",
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
                    "preserveComments": "some",
                    "beautify": true,
                    "exportAll": true,
                    "banner": config.banner
                },
                "files": {
                    "qti-1.2/build/qti.js": [".tmp/1.2/qti.js"]
                }
            },
            "uglify:engine_min": {
                "options": {
                    "report": "min",
                    "wrap": config.name,
                    "banner": config.banner
                },
                "files": {
                    "qti-1.2/build/qti.min.js": [".tmp/1.2/qti.js"]
                }
            }
        }
    };
};