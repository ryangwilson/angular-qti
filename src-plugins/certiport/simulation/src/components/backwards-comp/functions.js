angular.module('simulation').directive('simFunctions', function () {
    return {
        restrict: 'AE',
        link: function(scope, el) {
            setTimeout(function () {
                el.remove();
            });
        }
    };
});