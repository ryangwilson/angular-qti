module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-treeshake');

    grunt.initConfig({
        treeshake: {
            hb: {
                options: {
                    wrap: 'hb',
                    debug: true,
                    report: true,
                    minify: true,
                    inspect: ['build/application.js'],
                    imports: ['utils.validators.*']
                },
                files: {
                    'build/hb.js': ['bower_components/hb/src/**/**.js']
                }
            }
        }
    });

    grunt.registerTask('hb', 'treeshake');
};