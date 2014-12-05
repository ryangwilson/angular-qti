/* global angular */
angular.module('simulation').directive('mouseover', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            var handler = function (evt) {
                var action = 'invoke("' + attrs.mouseover + '")';
                // set on window (needed for Firefox)
                window.event = evt;
                // stop propagation
                evt.stopPropagation();
                // exec mouseover
                scope.$apply(action);
            };

            el.parent().on('mouseover', handler);
            scope.$on('$destroy', function () {
                el.parent().off('mouseover', handler);
            });
            
        }
    };
});