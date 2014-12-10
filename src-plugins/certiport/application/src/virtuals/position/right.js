/* global angular */
angular.module('certiport').directive('right', function () {
    return {
        restrict: 'A',
        link: function ($scope, $el, $attrs) {
            var value = String($attrs.right).match(/\d+/);
            var unit = String($attrs.right).match(/\D+/) || 'px';

            $el.css('position', 'absolute');
            $el.css('right', value + unit);
        }
    };
});