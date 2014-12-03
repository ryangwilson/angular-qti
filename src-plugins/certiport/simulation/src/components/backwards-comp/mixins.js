angular.module('simulation').directive('simMixins', function () {
    return {
        restrict: 'AE',
        link: function (scope, el) {
            el.remove();
        }
    };
});
