/* global angular */

angular.module('qti').directive('matimage', function ($compile) {

    return {
        restrict: 'E',
        scope: true,
        link: function ($scope, $el, $attr) {

            var px = 'px';
            var base64 = 'data:image/jpg;base64';
            var content = $el.text().trim();

            var imgEl = angular.element('<img ng-src="{{src}}" matimage-img />');
            //compile the view into a function.
            var compiled = $compile(imgEl);
            //append our view to the element of the directive.
            $el.empty();
            $el.append(imgEl);
            //bind our view to the scope!
            compiled($scope);

            var valign;
            switch ($attr.valign) {
                case 'top':
                    valign = 'top';
                    break;
                case 'bottom':
                    valign = 'bottom';
                    break;
                default:
                    valign = 'middle';
                    break;
            }

            imgEl.css('vertical-align', valign);

            if ($attr.hasOwnProperty('width')) {
                imgEl.css('width', $attr.width + px);
            }

            if ($attr.hasOwnProperty('height')) {
                imgEl.css('height', $attr.height + px);
            }

            if ($attr.hasOwnProperty('uri')) {
                $scope.src = $attr.uri;
            } else if ($attr.hasOwnProperty('embedded')) {
                $scope.src = base64 + ',' + content;
            }
        }
    };
});