/* global angular */
angular.module('qti').directive('mattext', function ($sce) {

    return {
        restrict: 'E',
        scope: true,
        link: function (scope, el, attr) {

            if (attr.hasOwnProperty('width')) {
                el.css('width', attr.width + 'px');
            }

            if (attr.hasOwnProperty('height')) {
                el.css('height', attr.height + 'px');
            }

            if (attr.hasOwnProperty('fontface')) {
                el.css('font-family', attr.fontface);
            }

            if (attr.hasOwnProperty('fontsize')) {
                el.css('font-size', attr.fontsize + 'px');
            }

        }
    };
});
