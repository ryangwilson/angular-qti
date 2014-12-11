/* global angular, platform, extend */
angular.module('hammer').directive('platform', function ($http, $compile, $window, $templateCache) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {

            var p = platform(attrs.name);

            /**
             * Example:
             * hammer.init({
             *      plugins: [ 'reportcard', 'io-compressed', 'webservice' ]
             * });
             */
            p.init = function (options) {
                var plugin;
                options = options || {};
                angular.forEach(options.plugins, function (name) {
                    plugin = p.getPlugin(name);
                    if (plugin) {
                        debugger;
                    }
                });
            };

            /**
             * Renders a view to viewport
             * @param name
             * @param options
             */
            p.render = function (name, options) {
                var viewEl = p.getViewElement(name, options);

                //var linkFn = $compile(viewEl);
                //var $viewEl = linkFn(scope);

                // bootstrap
                angular.bootstrap(viewEl, ['certiport']);

                el.append(viewEl);

                var injector = viewEl.injector();
                var applicationScope = injector.get('$rootScope');

                applicationScope.$on('ready', function () {
                    debugger;
                    //$scope.$on('bridge.events.ready', $scope[$attrs.ready]);
                    //$scope.$broadcast('bridge.events.ready', applicationScope);
                });
            };

            // load JS
            // load CSS
            // load XML
            // load Images
            // load HTML

            p.fire('platform.events.init', p);
        }
    };
});