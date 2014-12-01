angular.module('simulation').directive('height', function () {
    return {
        restrict: 'A',
        link: function ($scope, $el, $attrs) {
            var value = String($attrs.height).match(/\d+/);
            var unit = String($attrs.height).match(/\D+/) || 'px';
            
            $el.css('height', value + unit);
        }
    };
});