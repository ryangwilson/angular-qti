/* global angular */
angular.module('certiport.plugin').directive('simMixins', function () {
    return {
        restrict: 'AE',
        link: function (scope, el) {
            setTimeout(function () {
                el.remove();
            });
        }
    };
});
