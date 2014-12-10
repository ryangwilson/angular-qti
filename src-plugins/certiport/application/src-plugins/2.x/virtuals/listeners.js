/* global angular */
angular.module('certiport.plugin').directive('simListeners', function () {
    return {
        restrict: 'AE',
        link: function(scope, el) {
            setTimeout(function () {
                el.remove();
            });
        }
    };
});