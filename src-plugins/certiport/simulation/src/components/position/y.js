angular.module('simulation').directive('y', function () {
    return {
        restrict: 'A',
        link: function ($scope, $el, $attrs) {
            var value = String($attrs.y).match(/\d+/);
            var unit = String($attrs.y).match(/\D+/) || 'px';
            
            $el.css('position', 'absolute');
            $el.css('top', value + unit);
        }
    };
});