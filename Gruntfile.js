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

    // qti tasks
    var tasksQti = [
        'clean:qti',
        'ngtemplates:qti',
        'ngAnnotate:qti',
        'string-replace:qti',
        'uglify:qti',
        'uglify:qti_min',
        'less:qti',
        'copy:qti_matvideo', // copy matvideo assets
        'clean:common'
    ];

    grunt.registerTask('default', tasksQti);

    // pearsonvue tasks
    var tasksPearsonvue = [
        'clean:pearsonvue',
        'ngAnnotate:pearsonvue',
        'ngtemplates:pearsonvue',
        'uglify:pearsonvue',
        'uglify:pearsonvue_min',
        'less:pearsonvue',
        'copy:pearsonvue_mattable', // copy mattable assets
        'clean:common'
    ];

    grunt.registerTask('pearsonvue', tasksPearsonvue);

};