angular.module('qti').directive('backgroundColor', function () {
    // p.67
    return {
        restrict: 'A',
        link: function ($scope, $el, $attr) {
            if ($attr.backgroundColor) {
                $el[0].style['background-color'] = $attr.backgroundColor;
            }
        }
    }
});