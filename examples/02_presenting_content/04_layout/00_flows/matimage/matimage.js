/* global angular */

angular.module('qti').directive('matimage', function ($compile, helpers) {

    return {
        restrict: 'E',
        scope: true,
//        template: '<img ng-src="{{url}}" />',
        link: function ($scope, $el, $attr) {

            var measureWidth = 0;
            var measureHeight = 0;
            var unitWidth = 'px';
            var unitHeight = 'px';
            //var scaleFactor = $scope.currentScaleFactor || 1;
            var loaded = false;

            var updateImageSize = function () {
                if(loaded && $scope.currentScaleFactor) {
                    imgEl.css('width', (measureWidth * $scope.currentScaleFactor.factor) + unitWidth);
                    imgEl.css('height', (measureHeight * $scope.currentScaleFactor.factor) + unitHeight);
                }
            };

            $scope.$on('scalefactor::changed', function (evt, factor) {
                //scaleFactor = factor;
                updateImageSize();
            });

            var imgEl = angular.element('<img ng-src="{{src}}" />');
            //compile the view into a function.
            var compiled = $compile(imgEl);
            //append our view to the element of the directive.
            $el.append(imgEl);
            //bind our view to the scope!
            compiled($scope);

            imgEl.bind('load', function (evt) {
                loaded = true;
                var style = window.getComputedStyle(imgEl[0]);

                measureWidth = style.width.replace(/\D+/i, '');
                unitWidth = style.width.replace(/\d+/i, '');

                measureHeight = style.height.replace(/\D+/i, '');
                unitHeight = style.height.replace(/\d+/i, '');

                updateImageSize();
            });

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
                imgEl.css('width', $attr.width + 'px');
            }

            if ($attr.hasOwnProperty('height')) {
                imgEl.css('height', $attr.height + 'px');
            }

            if ($attr.hasOwnProperty('uri')) {
                $scope.src = $attr.uri;
            } else if ($attr.hasOwnProperty('embedded')) {
                var str = 'data:image/jpg;base64,';
                $scope.src = str + $el.text();
            }
        }
    };
});