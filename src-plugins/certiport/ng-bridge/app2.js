(function () {
    var secondApp = angular.module('secondApp', []);
    secondApp.controller('SecondController', function ($scope, $timeout) {

        var api = $scope.$root;

        api.callMe = function () {
            console.log('YOU CALLED ME');
        };

        console.log('second ctrl');
        var count = 0;
        $scope.name2 = "I'm the second app started. ";
        setInterval(function () {
            $scope.name2 = "I'm the second app. " + (count++);
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }, 1000);

        $scope.$on('myEvent', function (evt, a, b, c) {
            console.log('here we are', a, b, c);
//                        scope.$emet(evt.)
        });

        $timeout(function () {
            $scope.$emit('mySecondEvent');
        }, 1000);
    });
})();

