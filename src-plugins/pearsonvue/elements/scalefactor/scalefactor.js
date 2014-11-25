/* global angular */
angular.module('qti.plugins').directive('pearsonvueScalefactors', function ($compile) {
    return function ($scope, $el, $attr) {

        var scaleFactorsEl = $el[0].querySelectorAll('*');
        var scaleFactorEl, scaleFactor;
        var scaleFactors = [];
        var percent = '%';

        for (var i = 0; i < scaleFactorsEl.length; i += 1) {
            scaleFactorEl = scaleFactorsEl[i];
            scaleFactor = {
                isDefault: !!scaleFactorEl.getAttribute('default'),
                factor: Number(scaleFactorEl.getAttribute('factor'))
            };

            scaleFactors.push(scaleFactor);
            if (scaleFactor.isDefault) {
                $scope.currentScaleFactor = scaleFactor;
            }
        }

        $scope.zoomIn = function () {
            var index = scaleFactors.indexOf($scope.currentScaleFactor);
            if (index + 1 < scaleFactors.length) {
                index += 1;
            }
            $scope.currentScaleFactor = scaleFactors[index];
            $scope.$broadcast('scalefactor::changed', $scope.currentScaleFactor.factor);
        };

        $scope.zoomOut = function () {
            var index = scaleFactors.indexOf($scope.currentScaleFactor);
            if (index - 1 >= 0) {
                index -= 1;
            }
            $scope.currentScaleFactor = scaleFactors[index];
            $scope.$broadcast('scalefactor::changed', $scope.currentScaleFactor.factor);
        };

        //create an angular element. (this is still our "view")
        var zoomInEl = '<a class="btn-zoom-in" href="" ng-click="zoomIn()"></a>';
        var zoomOutEl = '<a class="btn-zoom-out" href="" ng-click="zoomOut()"><a>';
        var el = angular.element('<div style="font-size: 14px;padding: 10px">' + zoomInEl + zoomOutEl + '</div>');

        //compile the view into a function.
        var compiled = $compile(el);

        //append our view to the element of the directive.
        $el.append(el);

        //bind our view to the scope!
        //(try commenting out this line to see what happens!)
        compiled($scope);

        $el[0].parentNode.style['font-size'] = 100 * $scope.currentScaleFactor.factor + percent;
    };
});