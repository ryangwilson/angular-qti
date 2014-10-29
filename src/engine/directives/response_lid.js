/**
 * 3.5.11.2 <material> Element
 * Description: This element contains the presentation materials that are to be displayed to the participant as part of the question.
 */
/* global angular */
angular.module('qti').directive('responseLid', function () {
    return {
        restrict: 'E',
        scope: true,
        transclude: true,
        templateUrl: 'templates/question-type.html',
        link: function (scope, el, attr) {
            scope.item.type = attr.rcardinality;
//                console.log('### response_lid', scope.item.type);
//                scope.$on('item::ready', function () {
//                    switch(attr.rcardinality) {
//                        case 'single':
//
//                    }
////                    scope.item.question = el[0].querySelector('mattext').innerHTML
//                });
        },
        controller: function ($scope) {

        }
    };
});