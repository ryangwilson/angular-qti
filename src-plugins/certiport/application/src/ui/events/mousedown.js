/* global angular */
angular.module('certiport').directive('mousedown', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            var handler = function (evt) {
                // stop propagation
                evt.stopPropagation();
                // do this for FF compatibility(?)
                window.event = evt;
                // invoke event
                scope.invoke(attrs.mousedown);
            };

            el.parent().on('mousedown', handler);

            scope.$on('$destroy', function () {
                el.parent().off('mousedown', handler);
            });
            
        }
    };
});