/* global angular */
angular.module('certiport').directive('mouseleave', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            var handler = function (evt) {
                // stop propagation
                evt.stopPropagation();
                // do this for FF compatibility(?)
                window.event = evt;
                // invoke event
                scope.invoke(attrs.mouseleave);
            };

            el.parent().on('mouseleave', handler);

            scope.$on('$destroy', function () {
                el.parent().off('mouseleave', handler);
            });
            
        }
    };
});