angular.module('qti').directive('mattext', function () {
    return {
        scope: true,
        link: function ($scope, $el, $attr) {

            var el = $el[0];
            var style = window.getComputedStyle(el);
            var defaultFontSize = style.fontSize;
            var measure = defaultFontSize.replace(/\D+/i, '');
            var unit = defaultFontSize.replace(/\d+/i, '');
            var scaleFactor = 1;

            var updateFontSize = function () {
                $el.css('fontSize', (measure * scaleFactor) + unit)
            };

            $scope.$on('scalefactor::changed', function (evt, factor) {
                scaleFactor = factor;
                updateFontSize();
            });
        }
    }
});