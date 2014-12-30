/* global module */
module.exports = function (grunt, options) {
    'use strict';

    return {
        tasks: {
            "clean:platform": ["build/platform"],
            "less:platform": {
                "files": {
                    "build/platform/css/styles.css": [
                        "src/styles/main.less",
                        "src/elements/**/**.less"
                    ]
                }
            },
            //"ngtemplates:platform": {
            //    "src": "src-plugins/certiport/examples/v2/**/**.html",
            //    "dest": ".tmp/platform/templates.js",
            //    "options": {
            //        "url": function (url) {
            //            return 'templates/' + url.split('/').pop();
            //        },
            //        "module": "platform",
            //        "htmlmin": {
            //            "collapseBooleanAttributes": true,
            //            "collapseWhitespace": true,
            //            "removeAttributeQuotes": true,
            //            "removeComments": true,
            //            "removeEmptyAttributes": false,
            //            "removeRedundantAttributes": true,
            //            "removeScriptTypeAttributes": true,
            //            "removeStyleLinkTypeAttributes": true
            //        }
            //    }
            //},
            "ngAnnotate:platform": {
                "options": {
                    "singleQuotes": true
                },
                "files": {
                    ".tmp/platform/platform.js": [
                        "src-plugins/certiport/platform/src/**/**.js",
                        //"src-plugins/certiport/platform/src/events.js",
                        //"src-plugins/certiport/platform/src/polyfills/*.js",
                        //"src-plugins/certiport/platform/src/ui/**/**.js",
                    ]
                }
            },
            "string-replace:platform": {
                files: {'.tmp/platform/platform.js': '.tmp/platform/platform.js'},
                options: {
                    replacements: [
                        { // fix up module declaration - angular.module('platform.plugins.videogular', [])
                            pattern: 'angular.module("com.2fdevs.videogular", ["ngSanitize"])',
                            replacement: 'angular.module("platform.plugins")'
                        },
                        { // fixes up so there is only one module decaration - angular.module('platform.plugins.videogular')
                            pattern: /angular.module\("(com.2fdevs.videogular.*)?\)/gim,
                            replacement: 'angular.module("platform.plugins")'
                        }
                    ]
                }
            },
            "uglify:platform": {
                "options": {
                    "mangle": false,
                    "compress": false,
                    "preserveComments": "some",
                    "beautify": true,
                    "exportAll": true,
                    "wrap": 'platform',
                    "banner": '/*\n* platform <%= version %>\n*/\n'
                },
                "files": {
                    "src-plugins/certiport/platform/build/platform.js": [
                        ".tmp/platform/platform.js",
                        '.tmp/platform/templates.js'
                    ]
                }
            },
            "uglify:platform_min": {
                "options": {
                    "report": "min",
                    "wrap": 'platform',
                    "banner": '/*\n* platform <%= version %>\n*/\n'
                },
                "files": {
                    "src-plugins/certiport/platform/build/platform.min.js": [
                        ".tmp/platform/platform.js",
                        '.tmp/platform/templates.js'
                    ]
                }
            }
        }
    };
};