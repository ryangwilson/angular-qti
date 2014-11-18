/* global angular */
angular.module('qti').directive('item', function ($sce) {
    return {
        restrict: 'E',
        scope: true,
        link: function (scope, el, attr) {
            scope.item.questionId = attr.ident;
            scope.$broadcast('item::ready');
        },
        controller: function ($scope) {
            $scope.objective = null;
            $scope.item = {};

            //$scope.trustHtml = function (html) {
            //    return $sce.trustAsHtml(html);
            //};
        }
    };
});
