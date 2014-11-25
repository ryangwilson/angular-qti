/* global angular */
angular.module('qti').directive('item111', function ($sce) {
    return {
        restrict: 'E',
        require: ['?item'],
        link: function (scope, el, attr) {
            var _el = el[0];
            if (_el.querySelector('pearsonvue_referencematerial')) { // if there is a reference material
                if (_el.querySelector('pearsonvue_splitpresentation')) { // if there is a splitter
                    console.log('yup there is a splitter');
                }

                var itemrefs = _el.querySelectorAll('pearsonvue_itemreference');
                if (itemrefs.length) {
                    console.log('item refs', itemrefs.length);
                }
            }


            //console.log('whois', el);
            //console.log('pearson::item');
            //scope.item.questionId = attr.ident;
//                console.log('item', scope.item.questionId);
//            scope.$broadcast('item::ready');
        }
        //controller: function ($scope) {
        //    $scope.objective = null;
        //    $scope.item = {};
        //
        //    $scope.trustHtml = function (html) {
        //        console.log('trust me!!!!');
        //        return $sce.trustAsHtml(html);
        //    };
        //}
    };
});
