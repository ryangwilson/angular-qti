angular.module('qti').directive('inset', function () {
    // p.65
    return {
        restrict: 'A',
        link: function ($scope, $el, $attr) {
            var el = $el[0];
            var px = 'px';
            if ($attr.inset) {
                if ($attr.inset.indexOf(',') === -1) {
                    el.style['padding'] = parseInt($attr.inset, 10) + px;
                } else {
                    var insets = $attr.inset.split(',');
                    el.style['padding-top'] = parseInt(insets[0], 10) + px;
                    el.style['padding-left'] = parseInt(insets[1], 10) + px;
                    el.style['padding-bottom'] = parseInt(insets[2], 10) + px;
                    el.style['padding-right'] = parseInt(insets[3], 10) + px;
                }
            }
        }
    }
});