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

                var linkFn = $compile(viewEl);
                var $viewEl = linkFn(scope);

                el.append($viewEl);

            };

            // load JS
            // load CSS
            // load XML
            // load Images
            // load HTML

            p.fire('ready', p);
        }
    };
});