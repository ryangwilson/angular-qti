/* global angular */
angular.module('simulation').directive('bottom', function () {
    return {
        restrict: 'A',
        link: function ($scope, $el, $attrs) {
            var value = String($attrs.bottom).match(/\d+/);
            var unit = String($attrs.bottom).match(/\D+/) || 'px';

            $el.css('position', 'absolute');
            $el.css('bottom', value + unit);
        }
    };
});