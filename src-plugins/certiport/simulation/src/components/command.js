angular.module('simulation').directive('simCommand', function ($rootScope) {

    var commands = {};

    return {
        restrict: 'AE',
        scope: true,
        link: function (scope, el) {
            el.remove();
        },
        controller: function ($scope, $attrs) {
            var returnVal;
            console.log('### SIM COMMAND ###', $attrs.name);
            // :: init ::
            $scope.actions = [];

            $scope.registerAction = function (fn) {
                //console.log('## register action ##', name);
                $scope.actions.push(fn);
            };

            if (!commands[$attrs.name]) {
                commands[$attrs.name] = true;

                $rootScope.$on($attrs.name, function (evt, targetScope, data) {
                    angular.forEach($scope.actions, function (action) {
                        if (typeof action === 'function') {
                            returnVal = action(targetScope, data);
                            if (typeof returnVal !== 'undefined') {
                                data = returnVal;
                            }
                        }
                    });
                });
            }

        }
    };
});
