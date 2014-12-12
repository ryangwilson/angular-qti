/* global angular, platform, extend */
angular.module('hammer').directive('platform', function ($http, $compile, $controller) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {

            //console.log('whois', $compile, $controller);
            var p = platform(attrs.name);

            /**
             * Responsible for loading plugins and other resources into platform
             * Example:
             * platform('hammer').init({
             *      plugins: [ 'reportcard', 'io-compressed', 'webservice', 'logger', 'debugger' ]
             * });
             */
            var init = function () {

                var plugin;
                angular.forEach(p.config.plugins, function (name) {
                    plugin = p.getPlugin(name);
                    if (plugin) {
                        debugger;
                        platformConsts.$compileProvider.directive(plugin.name, plugin.directive);
                    }
                });

                var html = '<dummy></dummy>';
                var linkFn = $compile(html);
                var $el = linkFn(scope);
                el.append($el);


                p.fire('platform.events.init', p);
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
                    p.fire('platform.events.ready');
                });
            };

            // load JS
            // load CSS
            // load XML
            // load Images
            // load HTML

            init();
        }
    };
});