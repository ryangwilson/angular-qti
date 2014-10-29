module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-wrap');

    var package = grunt.file.readJSON('package.json');

    //loads the various task configuration files
    var configs = require('load-grunt-configs')(grunt);
    configs.name = package.name;
    configs.version = package.version;
    grunt.initConfig(configs);

    var tasks = [
        'ngtemplates',
        'ngAnnotate',
        'uglify',
        'less',
        //'cssmin',
        'copy',
        'clean:tmp'
    ];

    grunt.registerTask('default', tasks);
}