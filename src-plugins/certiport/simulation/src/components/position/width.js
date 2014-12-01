angular.module('simulation').directive('width', function () {
    return {
        restrict: 'A',
        link: function ($scope, $el, $attrs) {
            var value = String($attrs.width).match(/\d+/);
            var unit = String($attrs.width).match(/\D+/) || 'px';
            
            $el.css('width', value + unit);
        }
    };
});