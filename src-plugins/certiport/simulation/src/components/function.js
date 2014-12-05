/* global angular */
angular.module('simulation').directive('simFunction', function () {
    return {
        restrict: 'AE',
        scope: true,
        link: function(scope, el) {
            el.remove();
        },
        controller: function ($scope, $attrs) {

            var returnVal;

            // :: init ::
            $scope.actions = [];

            $scope.registerFunction($attrs.name, function (targetScope, data) {
                angular.forEach($scope.actions, function (action) {
                    if (typeof action === 'function') {
                        returnVal = action(targetScope, data);
                        if(typeof returnVal !== 'undefined') {
                            data = returnVal;
                        }
                    }
                });
            });

            // :: api ::
            $scope.registerAction = function (fn) {
                $scope.actions.push(fn);
            };

        }
    };
});