/* global angular */
angular.module('qti').directive('objectives', function () {
    return {
        restrict: 'E',
        link: function (scope, el, attr) {
            scope.objectives[attr.ident] = el[0].querySelector('mattext').innerHTML;
            el[0].outerHTML = null;

//                el.css('display', 'none');
//                console.log('setting', attr.ident);
            scope.$on('item::ready', function () {

            });
        },
        controller: function ($scope) {
            $scope.objectives = $scope.objectives || {};
        }
    };
});
