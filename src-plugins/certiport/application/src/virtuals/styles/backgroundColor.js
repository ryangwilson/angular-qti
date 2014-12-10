/* global angular */
angular.module('certiport').directive('backgroundColor', function () {
    return {
        restrict: 'A',
        link: function ($scope, $el, $attrs) {
            $el.css('backgroundColor', $attrs.backgroundColor);
        }
    };
});