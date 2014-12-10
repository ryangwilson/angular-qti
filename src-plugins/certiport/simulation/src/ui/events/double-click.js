/* global angular */
angular.module('simulation').directive('dblclick', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            var handler = function (evt) {
                // stop propagation
                evt.stopPropagation();
                // do this for FF compatibility(?)
                window.event = evt;
                // invoke event
                scope.invoke(attrs.dblclick);
            };

            el.parent().on('dblclick', handler);

            scope.$on('$destroy', function () {
                el.parent().off('dblclick', handler);
            });

        }
    };
});