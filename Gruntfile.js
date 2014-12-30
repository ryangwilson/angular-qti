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
        'copy:pearsonvue_mathjax', // copy mathjax assets
        'clean:common'
    ];

    grunt.registerTask('pearsonvue', tasksPearsonvue);

    // application tasks
    var tasksApplication = [
        'clean:application',
        'ngAnnotate:application',
        //'ngtemplates:application',
        'uglify:application',
        'uglify:application_min',
        //'less:application',
        'clean:common'
    ];

    grunt.registerTask('application', tasksApplication);

    // application tasks
    var tasksPlatform = [
        'clean:platform',
        'ngAnnotate:platform',
        //'ngtemplates:platform',
        'uglify:platform',
        'uglify:platform_min',
        //'less:platform',
        'clean:common'
    ];

    grunt.registerTask('platform', tasksPlatform);

};