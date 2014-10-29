/* global angular */
angular.module('qti').directive('img', function () {

    return {
        restrict: 'E',
        scope: true,
        link: function (scope, el, attr) {
            if (attr.hasOwnProperty('align')) {
                el.css('vertical-align', attr.align);
            }

//            if (attr.hasOwnProperty('width')) {
//                el.css('width', attr.width + 'px');
//            }
//
//            if (attr.hasOwnProperty('height')) {
//                el.css('height', attr.height + 'px');
//            }
        }
    };
});
