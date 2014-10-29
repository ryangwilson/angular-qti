/* global angular */
angular.module('qti.plugins.pearsonvue').directive('font', function () {

    return {
        restrict: 'E',
        scope: true,
        link: function (scope, el, attr) {
            var size = attr.size;
            el[0].removeAttribute('size');
            el.css('fontSize', attr.size + 'px');
        }
    };
});
