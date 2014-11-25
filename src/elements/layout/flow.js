angular.module('qti').directive('flow', function () {
    return {
        restrict: 'E',
        scope: true,
        link: function ($scope, $el, $attr) {

            var el = $el[0];
            var px = 'px';
            var unit;

            if ($attr.width) {
                unit = String($attr.width).match(/\D+/);
                if (unit) {
                    el.style.width = $attr.width + unit[0];
                } else {
                    el.style.width = $attr.width + px;

                    // width is greater than 40 and height is not set (p.62)
                    if ($attr.height === undefined) {
                        if (parseInt($attr.width, 10) > 40) {
                            el.style['overflow'] = 'auto';
                        } else {
                            el.style['overflow'] = 'hidden';
                        }
                    }
                }
            }

            if ($attr.height) {
                unit = String($attr.height).match(/\D+/);
                if (unit) {
                    el.style.height = $attr.height + unit[0];
                } else {
                    el.style.height = $attr.height + px;
                }
            }

            // if we need to detect size changes use this
            // https://github.com/sdecima/javascript-detect-element-resize
        }
    };
});