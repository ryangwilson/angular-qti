angular.module('simulation').directive('backgroundColor', function () {
    return {
        restrict: 'A',
        link: function ($scope, $el, $attrs) {
            $el.css('backgroundColor', $attrs.backgroundColor);
        }
    };
});