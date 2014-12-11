app.directive('ngBridge', function ($http) {
    return {
        restrict: 'AE',
        link: function ($scope, $element, $attrs) {

            $http.get($attrs.src).then(function (response) {

                var html = response.data;
                var el = angular.element(html);
                angular.bootstrap(el, [$attrs.module]);
                $element.append(el);

                var injector = el.injector();

                var applicationScope = injector.get('$rootScope');
                if ($attrs.ready && $scope[$attrs.ready]) {
                    applicationScope.$on('app.events.ready', function () {
                        $scope.$on('bridge.events.ready', $scope[$attrs.ready]);
                        $scope.$broadcast('bridge.events.ready', applicationScope);
                    });
                }

            });
        }
    }
});