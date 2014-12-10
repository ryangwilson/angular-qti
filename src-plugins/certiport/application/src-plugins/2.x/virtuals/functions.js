/* global angular */
angular.module('certiport.plugin').directive('simFunctions', function () {
    return {
        restrict: 'AE',
        link: function(scope, el) {
            setTimeout(function () {
                el.remove();
            });
        }
    };
});