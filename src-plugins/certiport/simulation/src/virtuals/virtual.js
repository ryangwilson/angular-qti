/* global angular */
angular.module('simulation').directive('simVirtual', function () {
    return {
        restrict: 'AE',
        link: function(scope, el) {
            el.remove();
        }
    };
});