/* global angular */
angular.module('simulation').directive('hammer2x', function () {
    return {
        restrict: 'AE',
        scope: true,
        link: function (scope, el) {

            console.log('%c * hammer 2.x plugin * ', 'background: #333; color: #fff');

            /**
             * Removes event.data from HTML templates
             * @param html
             * @returns {string}
             */
            var removeEventData = function (html) {
                return html.split('event.data.').join('');
            };

            /**
             * Converts <event> tags to <listener> tags.
             * @param html
             * @returns {*}
             */
            var parseEvent = function (html) {
                var regExp = /<(listeners)>([\s\S]*?)<\/\1>/gim;
                var listenersHtml = html.match(regExp);
                if (listenersHtml) {
                    var updatedHtml = listenersHtml[0].replace(/<(event)(\s.*?)<\/\1>/gim, '<listener$2</listener>');
                    html = html.replace(regExp, updatedHtml);
                }
                return html;
            };

            /**
             * Converts ## tags to <%= %> tags
             * @param html (string)
             */
            var parseHashes = function (html) {
                return html.replace(/#{2}((.|\n)*?)#{2}/gim, '<%= $1 %>');
            };

            scope.addSlideInterceptor(removeEventData);
            scope.addSlideInterceptor(parseEvent);
            scope.addSlideInterceptor(parseHashes);

            setTimeout(function () {
                el.remove();
            });
        }
    };
});