/* global module */
module.exports = function (grunt) {
    'use strict';

    return {
        tasks: {
            "clean:videogular": ["build/plugins/videogular"],
            "ngAnnotate:videogular": {
                "options": {
                    "singleQuotes": true
                },
                "files": {
                    ".tmp/videogular/videogular.js": [
                        "src/plugins/videogular/videogular.js",
                        "src/plugins/videogular/plugins/*.js"
                    ]
                }
            },
            "string-replace:videogular": {
                files: {'.tmp/videogular/videogular.js': '.tmp/videogular/videogular.js'},
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
            "uglify:videogular": {
                "options": {
                    "mangle": false,
                    "compress": false,
                    "preserveComments": "none",
                    "beautify": true,
                    "exportAll": true
                },
                "files": {
                    "build/plugins/videogular/videogular.js": [".tmp/videogular/videogular.js"]
                }
            },
            "uglify:videogular_min": {
                "files": {
                    "build/plugins/videogular/videogular.min.js": [".tmp/videogular/videogular.js"]
                }
            }
        }
    };
};