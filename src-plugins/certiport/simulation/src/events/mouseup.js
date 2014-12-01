angular.module('simulation').directive('mouseup', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            var handler = function (evt) {
                var action = 'invoke("' + attrs.mouseup + '")';
                // set on window (needed for Firefox)
                window.event = evt;
                // stop propagation
                evt.stopPropagation();
                // exec mouseup
                scope.$apply(action);
            };

            el.parent().on('mouseup', handler);
            scope.$on('$destroy', function () {
                el.parent().off('mouseup', handler);
            });
            
        }
    };
});