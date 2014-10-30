module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-wrap');

    var package = grunt.file.readJSON('package.json');

    //loads the various task configuration files
    var configs = require('load-grunt-configs')(grunt, package);

    grunt.initConfig(configs);

    // qti engine tasks
    var tasksEngine = [
        'clean:engine',
        'ngtemplates:engine',
        'ngAnnotate:engine',
        'string-replace:engine',
        'uglify:engine',
        'uglify:engine_min',
        'less:engine',
        'copy:engine',
        //'clean:common'
    ];

    grunt.registerTask('default', tasksEngine);

    // videogular tasks
    var tasksVideogular = [
        'clean:videogular',
        'ngAnnotate:videogular',
        'string-replace:videogular',
        'uglify:videogular',
        'uglify:videogular_min',
        //'clean:common'
    ];

    grunt.registerTask('videogular', tasksVideogular);


    // pearsonvue tasks
    var tasksPearsonvue = [
        'clean:pearsonvue',
        'ngAnnotate:pearsonvue',
        'ngtemplates:pearsonvue',
        'uglify:pearsonvue',
        'uglify:pearsonvue_min',
        'less:pearsonvue',
        'clean:common'
    ];

    grunt.registerTask('pearsonvue', tasksPearsonvue);


    // all tasks
    var tasksAll = [
        'clean:all',
        'ngtemplates:all',
        'ngAnnotate:all',
        'uglify:all',
        'uglify:all_min',
        'less:all',
        'copy:all',
        'clean:common'
    ];

    grunt.registerTask('all', tasksAll);

};