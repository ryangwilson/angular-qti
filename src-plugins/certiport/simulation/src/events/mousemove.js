angular.module('simulation').directive('mousemove', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            var handler = function (evt) {
                var action = 'invoke("' + attrs.mousemove + '")';
                // set on window (needed for Firefox)
                window.event = evt;
                // stop propagation
                evt.stopPropagation();
                // exec mousemove
                scope.$apply(action);
            };

            el.parent().on('mousemove', handler);
            scope.$on('$destroy', function () {
                el.parent().off('mousemove', handler);
            });
            
        }
    };
});