/* global angular */
angular.module('simulation').directive('dblclick', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            var handler = function (evt) {
                var action = 'invoke("' + attrs.click + '")';
                // set on window (needed for Firefox)
                window.event = evt;
                // stop propagation
                evt.stopPropagation();
                // exec click
                scope.$apply(action);
            };

            el.parent().on('dblclick', handler);
            scope.$on('$destroy', function () {
                el.parent().off('dblclick', handler);
            });

        }
    };
});