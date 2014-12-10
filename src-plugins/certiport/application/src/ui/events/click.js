/* global angular */
angular.module('certiport').directive('click', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            var handler = function (evt) {
                // stop propagation
                evt.stopPropagation();
                // do this for FF compatibility(?)
                window.event = evt;
                // invoke event
                scope.invoke(attrs.click);
            };

            el.parent().on('click', handler);

            scope.$on('$destroy', function () {
                el.parent().off('click', handler);
            });

        }
    };
});