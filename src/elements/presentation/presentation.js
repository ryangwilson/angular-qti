/* global angular */
angular.module('qti').directive('presentation', function (ATTR_MAP) {

    return {
        restrict: 'E',
        //transclude: true,
        //templateUrl: 'templates/presentation.html',
        link: function (scope, el, attr) {
//                console.log('presentation');

            var px = 'px';

            // find the question stem and mark it
            var questionStem = el[0].querySelector('mattext');
            if(questionStem) {
                scope.item.question = questionStem.innerHTML;
            }
            // kill the question stem to prevent duplicate
//            questionFlow = el[0].querySelector('flow flow').outerHTML = null;

            // convert style attributes to CSS style properties
            for (var e in attr) {
                if (ATTR_MAP[e]) {
                    el.css(ATTR_MAP[e], isNaN(attr[e]) ? attr[e] : attr[e] + px);
                }
            }

            scope.$on('item::ready', function () {
            });
        },
        controller: function ($scope) {
        }
    };

});