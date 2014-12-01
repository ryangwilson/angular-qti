angular.module('simulation').directive('mouseleave', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            var handler = function (evt) {
                var action = 'invoke("' + attrs.mouseleave + '")';
                // set on window (needed for Firefox)
                window.event = evt;
                // stop propagation
                evt.stopPropagation();
                // exec mouseleave
                scope.$apply(action);
            };

            el.parent().on('mouseleave', handler);
            scope.$on('$destroy', function () {
                el.parent().off('mouseleave', handler);
            });
            
        }
    };
});