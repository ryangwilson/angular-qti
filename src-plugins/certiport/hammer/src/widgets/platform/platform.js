/* global angular */
angular.module('hammer').directive('platform', function ($http, $compile, $templateCache) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {
            console.log('platform');

            // load JS
            // load CSS
            // load XML
            // load Images
            // load HTML

            var html = $templateCache.get('application-tpl');
            var linkFn = $compile(html);
            var $el = linkFn(scope);
            el.append($el);

            //$http.get($attrs.src).then(function (response) {
            //
            //    var html = response.data;
            //    var el = angular.element(html);
            //    angular.bootstrap(el, [$attrs.module]);
            //    $element.append(el);
            //
            //    var injector = el.injector();
            //
            //    var applicationScope = injector.get('$rootScope');
            //    if ($attrs.ready && $scope[$attrs.ready]) {
            //        applicationScope.$on('app.events.ready', function () {
            //            $scope.$on('bridge.events.ready', $scope[$attrs.ready]);
            //            $scope.$broadcast('bridge.events.ready', applicationScope);
            //        });
            //    }
            //
            //});
        }
    };
});