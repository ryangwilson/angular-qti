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
            var removeEventData = function(html) {
                return html.split('event.data.').join('');
            };

            /**
             * Converts <event> tags to <listener> tags for backwards compatibility.
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
             * Converts ## tags to <eval> tags. This is for backwards compatibility.
             * @param html (string)
             */
            var parseHashes = function (html) {
                //var startToken = html.indexOf('##');
                //var endToken = html.indexOf('##', startToken + 2);
                //$console.log('');
                //while (startToken && endToken) {
                //    console.log('###found one###');
                    //
                    //}
                    //if (endToken > startToken) {
                    //    evals = html.match(/\#{2}(.*?)\#{2}/gm);
                    //    angular.forEach(evals, function (val) {
                    //        result = dataUtil.rawEval(val.substring(2, val.length - 2));
                    //        html = html.split(val).join(result);
                    //    });
                //}

                return html;
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