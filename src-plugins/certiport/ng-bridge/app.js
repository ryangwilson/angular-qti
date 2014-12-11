var app = angular.module('app', []);
app.controller('FirstController', function ($scope) {
    var count = 0;

    $scope.name1 = "I'm the first app started. ";

    $scope.setName = function () {
        $scope.name1 = 'Hey there';
        $scope.$broadcast('myEvent', 1, 'two', {label: 'three'});
    };

    setInterval(function () {
        $scope.name1 = "I'm the first app. " + (count++);
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }, 1000);

    $scope.onAppReady = function (evt, appScope) {

        appScope.callMe();

        appScope.$on('mySecondEvent', function () {
            console.log('mySecondEvent received');
        });
    };
});