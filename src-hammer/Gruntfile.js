module.exports = function (grunt) {
    grunt.initConfig({
        "compile": {
            framework: {
                wrap: 'hammer',
                filename: 'framework',
                build: 'framework/build',
                scripts: {
                    src: ['framework/src/**/*.js'],
                    import: ['framework'],
                    export: ['framework']
                }
            },
            application: {
                wrap: 'hammer',
                filename: 'application',
                build: 'application/build',
                scripts: {
                    src: ['application/src/**/*.js'],
                    import: ['application'],
                    exclude: ['framework']
                }
            },
            reportCard: {
                wrap: 'hammer',
                filename: 'reportCard',
                build: 'plugins/reportCard/build',
                scripts: {
                    src: ['plugins/reportCard/src/**/*.js'],
                    import: ['reportCard'],
                    exclude: ['framework']
                }
            },
            score: {
                wrap: 'hammer',
                filename: 'score',
                build: 'plugins/score/build',
                scripts: {
                    src: ['plugins/score/src/**/*.js'],
                    import: ['score'],
                    exclude: ['framework']
                }
            }
        }
    });

    grunt.loadNpmTasks('hbjs');

    grunt.registerTask('default', 'compile');
    grunt.registerTask('framework', 'compile:framework');
    grunt.registerTask('reportCard', 'compile:reportCard');
    grunt.registerTask('score', 'compile:score');
};