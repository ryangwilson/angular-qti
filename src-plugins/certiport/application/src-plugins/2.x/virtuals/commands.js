/* global angular */
angular.module('certiport.plugin').directive('simCommands', function () {
    return {
        restrict: 'AE',
        link: function (scope, el) {
            setTimeout(function () {
                el.remove();
            });
        }
    };
});


