/* global module */
module.exports = function (grunt, options) {
    'use strict';

    return {
        tasks: {
            "clean:application": ["build/application"],
            "less:application": {
                "files": {
                    "build/application/css/styles.css": [
                        "src/styles/main.less",
                        "src/elements/**/**.less"
                    ]
                }
            },
            "ngtemplates:application": {
                "src": "src-plugins/certiport/examples/v2/**/**.html",
                "dest": ".tmp/application/templates.js",
                "options": {
                    "url": function (url) {
                        return 'templates/' + url.split('/').pop();
                    },
                    "module": "application",
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
            "ngAnnotate:application": {
                "options": {
                    "singleQuotes": true
                },
                "files": {
                    ".tmp/application/application.js": [
                        "src-plugins/certiport/application/src/**/**.js",
                        //"src-plugins/certiport/application/src/events.js",
                        //"src-plugins/certiport/application/src/polyfills/*.js",
                        //"src-plugins/certiport/application/src/ui/**/**.js",
                    ]
                }
            },
            "string-replace:application": {
                files: {'.tmp/application/application.js': '.tmp/application/application.js'},
                options: {
                    replacements: [
                        { // fix up module declaration - angular.module('application.plugins.videogular', [])
                            pattern: 'angular.module("com.2fdevs.videogular", ["ngSanitize"])',
                            replacement: 'angular.module("application.plugins")'
                        },
                        { // fixes up so there is only one module decaration - angular.module('application.plugins.videogular')
                            pattern: /angular.module\("(com.2fdevs.videogular.*)?\)/gim,
                            replacement: 'angular.module("application.plugins")'
                        }
                    ]
                }
            },
            "uglify:application": {
                "options": {
                    "mangle": false,
                    "compress": false,
                    "preserveComments": "none",
                    "beautify": true,
                    "exportAll": true,
                    "wrap": 'application',
                    "banner": '/*\n* application <%= version %>\n*/\n'
                },
                "files": {
                    "src-plugins/certiport/application/build/application.js": [
                        ".tmp/application/application.js",
                        '.tmp/application/templates.js'
                    ]
                }
            },
            "uglify:application_min": {
                "options": {
                    "report": "min",
                    "wrap": 'application',
                    "banner": '/*\n* application <%= version %>\n*/\n'
                },
                "files": {
                    "src-plugins/certiport/application/build/application.min.js": [
                        ".tmp/application/application.js",
                        '.tmp/application/templates.js'
                    ]
                }
            },
            "copy:application_matvideo": {
                "expand": true,
                "cwd": "src/elements/matvideo/styles/",
                "src": ["assets/**", "fonts/**"],
                "dest": "build/application/css/matvideo"
            }
        }
    };
};