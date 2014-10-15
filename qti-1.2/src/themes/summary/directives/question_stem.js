/* global angular */
angular.module('qti').directive('questionStem', function(){
    return {
        restrict: 'E',
        templateUrl: 'templates/question-stem.html'
    };
});