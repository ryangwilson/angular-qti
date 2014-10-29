/* global module */
module.exports = function (grunt, options) {

    'use strict';

    return {
        tasks: {
            "clean:pearsonvue": ["qti-1.2/build/themes/pearsonvue", "qti-1.2/build/qti.js", "qti-1.2/build/qti.min.js"],
            "ngAnnotate:pearsonvue": {
                "options": {
                    "singleQuotes": true
                },
                "files": {
                    ".tmp/1.2/pearsonvue.js": [
                        "qti-1.2/src/addons/pearsonvue/**/**.js"
                    ]
                }
            },
            "ngtemplates:pearsonvue": {
                "cwd": "qti-1.2/src/themes/pearsonvue",
                "src": "templates/**.html",
                "dest": "qti-1.2/build/themes/pearsonvue/templates.js",
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
            "uglify:pearsonvue": {
                "options": {
                    "mangle": false,
                    "compress": false,
                    "preserveComments": "some",
                    "beautify": true,
                    "exportAll": true,
                    "banner": "<%= banner %>"
                },
                "files": {
                    "qti-1.2/build/addons/pearsonvue.js": [
                        ".tmp/1.2/pearsonvue.js"
                    ]
                }
            },
            "uglify:pearsonvue_min": {
                "options": {
                    "report": "min",
                    "wrap": "<%= name %>",
                    "banner": "<%= banner %>"
                },
                "files": {
                    "qti-1.2/build/addons/pearsonvue.min.js": [
                        ".tmp/1.2/pearsonvue.js"
                    ]
                }
            }
        }
    };
};