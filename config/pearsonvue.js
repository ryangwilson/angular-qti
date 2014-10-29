/* global module */
module.exports = function (grunt, options) {

    'use strict';

    var config = {
        name: 'pearsonvue',
        banner: '/*\n* pearsonvue\n*/\n',
        sourcePath: '',
        tmpPath: '.tmp',
        buildPath: 'build/addons/pearsonvue/'
    };

    return {
        tasks: {
            "clean:pearsonvue": ["build/addons/pearsonvue"],
            "less:pearsonvue": {
                "files": {
                    "build/addons/pearsonvue/css/styles.css": "src/themes/pearsonvue/css/main.less"
                }
            },
            "ngAnnotate:pearsonvue": {
                "options": {
                    "singleQuotes": true
                },
                "files": {
                    ".tmp/pearsonvue/pearsonvue.js": [
                        "src/addons/pearsonvue/**/**.js"
                    ]
                }
            },
            "ngtemplates:pearsonvue": {
                "cwd": "src/themes/pearsonvue",
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
                    "build/addons/pearsonvue/pearsonvue.js": [
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
                    "build/addons/pearsonvue/pearsonvue.min.js": [
                        ".tmp/pearsonvue/pearsonvue.js",
                        ".tmp/pearsonvue/templates.js"
                    ]
                }
            }
        }
    };
};