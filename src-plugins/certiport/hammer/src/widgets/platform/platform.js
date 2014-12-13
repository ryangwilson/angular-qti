/* global angular, platform, extend */
angular.module('platform').directive('platform', function ($http, $compile, $controller) {
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
                angular.forEach(p.config.plugins, function (pluginInfo) {
                    plugin = p.getPlugin(pluginInfo.name, pluginInfo.options);
                    if (typeof plugin !== 'function') {
                        throw new Error('Plugin must return a function to be valid.');
                        //platformConsts.$compileProvider.directive(name, plugin.directive);
                    }

                    injector('platform').invoke(plugin, {}, {
                        name: pluginInfo.name,
                        options: pluginInfo.options,
                        platform: p,
                        next: function() {
                            // TODO: This is for the purpose of being asynchronouse, which means we
                            // cant be in a for loop
                            console.log('next called!!!');
                        }
                    });

                });

                //var html = '<dummy></dummy>';
                //var linkFn = $compile(html);
                //var $el = linkFn(scope);
                //el.append($el);


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