angular.module('simulation').directive('top', function () {
    return {
        restrict: 'A',
        link: function ($scope, $el, $attrs) {
            var value = String($attrs.top).match(/\d+/);
            var unit = String($attrs.top).match(/\D+/) || 'px';

            $el.css('position', 'absolute');
            $el.css('top', value + unit);
        }
    };
});