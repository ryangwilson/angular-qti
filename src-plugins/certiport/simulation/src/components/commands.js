angular.module('simulation').directive('simCommands', function () {
    return {
        restrict: 'AE',
        link: function(scope, el) {
            el.remove();
        }
    };
});