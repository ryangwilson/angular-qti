angular.module('simulation').directive('x', function () {
    return {
        restrict: 'A',
        link: function ($scope, $el, $attrs) {
            var value = String($attrs.x).match(/\d+/);
            var unit = String($attrs.x).match(/\D+/) || 'px';

            $el.css('position', 'absolute');
            $el.css('left', value + unit);
        }
    };
});