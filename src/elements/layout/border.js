angular.module('qti').directive('border', function () {
    // p.67
    return {
        restrict: 'A',
        link: function ($scope, $el, $attr) {
            var el = $el[0];
            var px = 'px';
            if ($attr.border) {
                el.style['border-style'] = 'solid';
                if ($attr.border.indexOf(',') === -1) {
                    el.style.border = parseInt($attr.border, 10) + px;
                } else {
                    var borders = $attr.border.split(',');
                    el.style['border-top-width'] = parseInt(borders[0], 10) + px;
                    el.style['border-left-width'] = parseInt(borders[1], 10) + px;
                    el.style['border-bottom-width'] = parseInt(borders[2], 10) + px;
                    el.style['border-right-width'] = parseInt(borders[3], 10) + px;
                }
            }

            if ($attr.borderColor) {
                el.style['border-color'] = $attr.borderColor;
            }
        }
    }
});