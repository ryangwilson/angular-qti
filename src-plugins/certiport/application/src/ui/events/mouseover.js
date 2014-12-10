/* global angular */
angular.module('certiport').directive('mouseover', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            var handler = function (evt) {
                // stop propagation
                evt.stopPropagation();
                // do this for FF compatibility(?)
                window.event = evt;
                // invoke event
                scope.invoke(attrs.mouseover);
            };

            el.parent().on('mouseover', handler);

            scope.$on('$destroy', function () {
                el.parent().off('mouseover', handler);
            });
            
        }
    };
});