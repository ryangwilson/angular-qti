/* global angular */
angular.module('simulation').directive('mouseenter', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            var handler = function (evt) {
                var action = 'invoke("' + attrs.mouseenter + '")';
                // set on window (needed for Firefox)
                window.event = evt;
                // stop propagation
                evt.stopPropagation();
                // exec mouseenter
                scope.$apply(action);
            };

            el.parent().on('mouseenter', handler);
            scope.$on('$destroy', function () {
                el.parent().off('mouseenter', handler);
            });
            
        }
    };
});