/* global angular */
angular.module('qti').directive('flowMat', function(ATTR_MAP){
    return {
        restrict: 'E',
        scope: true,
        link: function (scope, el, attr) {
            var px = 'px';
            // convert style attributes to CSS style properties
            for (var e in attr) {
                if (ATTR_MAP[e]) {
                    el.css(ATTR_MAP[e], isNaN(attr[e]) ? attr[e] : attr[e] + px);
                }
            }

//                scope.item.type = attr.rcardinality;
//                console.log('### response_lid', scope.item.type);
//                scope.$on('item::ready', function () {
//                    switch(attr.rcardinality) {
//                        case 'single':
//
//                    }
////                    scope.item.question = el[0].querySelector('mattext').innerHTML
//                });
        }
    };
});