/* global angular */
angular.module('certiport').directive('mousemove', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            var handler = function (evt) {
                // stop propagation
                evt.stopPropagation();
                // do this for FF compatibility(?)
                window.event = evt;
                // invoke event
                scope.invoke(attrs.mousemove);
            };

            el.parent().on('mousemove', handler);

            scope.$on('$destroy', function () {
                el.parent().off('mousemove', handler);
            });
            
        }
    };
});