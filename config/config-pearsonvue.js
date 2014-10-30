/* global module */
module.exports = function (grunt, options) {

    'use strict';

    var config = {
        name: 'pearsonvue',
        banner: '/*\n* pearsonvue\n*/\n',
        sourcePath: '',
        tmpPath: '.tmp',
        buildPath: 'build/plugins/pearsonvue/'
    };

    return {
        tasks: {
            "clean:pearsonvue": ["build/pearsonvue"],
            "less:pearsonvue": {
                "files": {
                    "build/pearsonvue/css/styles.css": [
                        "src_apps/pearsonvue/styles/main.less",
                        "src_apps/pearsonvue/elements/**/**.less"
                    ]
                }
            },
            "ngAnnotate:pearsonvue": {
                "options": {
                    "singleQuotes": true
                },
                "files": {
                    ".tmp/pearsonvue/pearsonvue.js": [
                        "src_apps/elements/**/**.js"
                    ]
                }
            },
            "ngtemplates:pearsonvue": {
                "src": "src_apps/pearsonvue/elements/*/*.html",
                "dest": ".tmp/pearsonvue/templates.js",
                "options": {
                    "url": function (url) {
                        return 'templates/' + url.split('/').pop();
                    },
                    "module": "qti.pearsonvue",
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
                    "build/pearsonvue/pearsonvue.js": [
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
                    "build/pearsonvue/pearsonvue.min.js": [
                        ".tmp/pearsonvue/pearsonvue.js",
                        ".tmp/pearsonvue/templates.js"
                    ]
                }
            }
        }
    };
};