angular.module('simulation').directive('left', function () {
    return {
        restrict: 'A',
        link: function ($scope, $el, $attrs) {
            var value = String($attrs.left).match(/\d+/);
            var unit = String($attrs.left).match(/\D+/) || 'px';

            $el.css('position', 'absolute');
            $el.css('left', value + unit);
        }
    };
});