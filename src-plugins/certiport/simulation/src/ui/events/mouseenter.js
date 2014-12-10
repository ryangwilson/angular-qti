/* global angular */
angular.module('simulation').directive('mouseenter', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            var handler = function (evt) {
                // stop propagation
                evt.stopPropagation();
                // do this for FF compatibility(?)
                window.event = evt;
                // invoke event
                scope.invoke(attrs.mouseenter);
            };

            el.parent().on('mouseenter', handler);

            scope.$on('$destroy', function () {
                el.parent().off('mouseenter', handler);
            });
            
        }
    };
});