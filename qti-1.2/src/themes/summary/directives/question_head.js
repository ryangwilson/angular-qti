/* global angular */
angular.module('qti').directive('questionHeader', function(){
    return {
        restrict: 'E',
        templateUrl: 'templates/question-header.html'
    };
});