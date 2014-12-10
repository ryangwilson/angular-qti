/* global angular */
angular.module('certiport').directive('simVirtual', function () {
    return {
        restrict: 'AE',
        link: function(scope, el) {
            el.remove();
        }
    };
});