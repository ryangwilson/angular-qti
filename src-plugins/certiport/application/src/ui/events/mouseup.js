/* global angular */
angular.module('certiport').directive('mouseup', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            var handler = function (evt) {
                // stop propagation
                evt.stopPropagation();
                // do this for FF compatibility(?)
                window.event = evt;
                // invoke event
                scope.invoke(attrs.mouseup);
            };

            el.parent().on('mouseup', handler);

            scope.$on('$destroy', function () {
                el.parent().off('mouseup', handler);
            });
            
        }
    };
});