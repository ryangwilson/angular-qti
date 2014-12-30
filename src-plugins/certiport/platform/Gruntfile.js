module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-treeshake');

    grunt.initConfig({
        treeshake: {
            hb: {
                options: {
                    wrap: 'platty',
                    debug: true,
                    report: true,
                    minify: true,
                    inspect: ['build/platform.js']
                },
                files: {
                    'build/hb.js': ['bower_components/hb/src/**/**.js']
                }
            }
        }
    });

    grunt.registerTask('default', 'treeshake');
};