/* global module */
module.exports = function (grunt, options) {

    'use strict';

    var config = {
        name: 'pearsonvue',
        banner: '/*\n* pearsonvue\n*/\n',
        sourcePath: '',
        tmpPath: '.tmp',
        buildPath: 'qti-1.2/build/addons/pearsonvue/'
    };

    return {
        tasks: {
            "clean:pearsonvue": ["qti-1.2/build/themes/pearsonvue", "qti-1.2/build/qti.js", "qti-1.2/build/qti.min.js"],
            "less:pearsonvue": {
                "files": {
                    "qti-1.2/build/addons/pearsonvue/css/styles.css": "qti-1.2/src/themes/pearsonvue/css/main.less"
                }
            },
            "ngAnnotate:pearsonvue": {
                "options": {
                    "singleQuotes": true
                },
                "files": {
                    ".tmp/pearsonvue/pearsonvue.js": [
                        "qti-1.2/src/addons/pearsonvue/**/**.js"
                    ]
                }
            },
            "ngtemplates:pearsonvue": {
                "cwd": "qti-1.2/src/themes/pearsonvue",
                "src": "templates/**.html",
                "dest": ".tmp/pearsonvue/templates.js",
                "options": {
                    "module": "pearsonvue",
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
                    "preserveComments": "none",
                    "beautify": true,
                    "exportAll": true,
                    "banner": "<%= banner %>"
                },
                "files": {
                    "qti-1.2/build/addons/pearsonvue/pearsonvue.js": [
                        ".tmp/pearsonvue/pearsonvue.js",
                        ".tmp/pearsonvue/templates.js"
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
                    "qti-1.2/build/addons/pearsonvue/pearsonvue.min.js": [
                        ".tmp/pearsonvue/pearsonvue.js",
                        ".tmp/pearsonvue/templates.js"
                    ]
                }
            }
        }
    };
};