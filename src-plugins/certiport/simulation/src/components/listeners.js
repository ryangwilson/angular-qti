angular.module('simulation').directive('simListeners', function () {
    return {
        restrict: 'AE',
        link: function(scope, el) {
            el.remove();
        }
    };
});