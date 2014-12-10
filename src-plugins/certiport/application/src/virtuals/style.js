/* global angular */
angular.module('certiport').directive('simStyle', function () {

    return {
        restrict: 'AE',
        controller: function ($scope, $element, $attrs) {

            var slideClass = '.slide_' + $scope.$id;

            var content = $element.html();
            content = content.replace(/([\#\.\D]{1}[A-Za-z]{1}[\w\.\s]+)(,|\{)/g, function (match, p1, p2) {
                return (slideClass + ' ' + p1.trim() + p2).trim();
            });
            $element[0].outerHTML = ('<style>' + content + '</style>');

        }
    };
});