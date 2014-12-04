/* global angular */
angular.module('simulation').directive('simulation', function ($http, $compile) {
    return {
        restrict: 'AE',
        scope: {
            url: '=',
            extension: '@'
        },
        controller: function ($scope, $element) {

            var openCurly = '{{';
            var closeCurly = '}}';
            var openBindTag = '{%';
            var closeBindTag = '%}';
            var newline = '\n';
            var counter = 0;
            var externalFiles = {};

            var regExp, patterns = [];

            /**
             * Converts <tag/> to <tag></tag>
             * @param html
             * @returns {*}
             */
            var openClosedTags = function (html) {
                return html.replace(/<([\w|-]+)(\s.*)\/>/gim, '<$1$2></$1>');
            };

            /**
             * Finds external files that need to be loaded
             * @param html
             * @returns {*}
             */
            var parseExternalFiles = function (html) {
                var cleanHtml = html.replace(/<!--[\s\S]*?-->/g, '');
                var files = cleanHtml.match(/[\w|\/]+::\w+/gim);
                //console.log('extFiles', files);
                angular.forEach(files, function (file) {
                    if (typeof externalFiles[file] === 'undefined') {
                        externalFiles[file] = false; // has not been loaded
                        console.log('###file###', file);
                    }
                });
                return html;
            };

            /**
             * Adds 'sim-' to a registered tag
             * Ex. <button> to <sim-button>
             * @param html (string)
             * @returns html (string)
             */
            var parseRegisteredTags = function (html) {
                angular.forEach(patterns, function (pattern) {
                    html = html.replace(pattern, '<$1sim-$2$3');
                });
                return html;
            };

            /**
             * Converts curlies to tag that will not automatically be parsed by angular
             * Ex. {{ myVal }} to {% myVal %}
             * @param html (string)
             * @returns html (string)
             */
            var parseBindables = function (html) {
                var $el = angular.element('<div>' + html + '</div>'); // the div is a temporary wrapper
                var childNodes = $el[0].childNodes;
                var len = childNodes.length;
                for (var e = 0; e < len; e++) {
                    if (childNodes[e] && childNodes[e].nodeType === 1) { // if text node and has content remove
                        childNodes[e].outerHTML = childNodes[e].outerHTML.split(openCurly).join(openBindTag).split(closeCurly).join(closeBindTag);
                    }
                }
                return $el.html();
            };

            /**
             * Converts ## tags to <eval> tags. This is for backwards compatibility.
             * @param html (string)
             */
            var parseHashes = function (html) {
                var startToken = html.indexOf('##');
                var endToken = html.indexOf('##', startToken + 2);
                //console.log('');
                while (startToken && endToken) {
                    console.log('###found one###');
                    //
                    //}
                    //if (endToken > startToken) {
                    //    evals = html.match(/\#{2}(.*?)\#{2}/gm);
                    //    angular.forEach(evals, function (val) {
                    //        result = dataUtil.rawEval(val.substring(2, val.length - 2));
                    //        html = html.split(val).join(result);
                    //    });
                }
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

            var reserveTags = function (tags) {
                if (typeof tags === 'string') {
                    tags = tags.split(' ');
                }
                var reservedWords = tags;
                angular.forEach(reservedWords, function (word) {
                    if (word) {
                        regExp = new RegExp('<(\/?)(' + word + ')([\\s>])', 'gm');
                        patterns.push(regExp);
                    }
                });
            };

            var bindable = function (content) {
                return content.split(openBindTag).join(openCurly).split(closeBindTag).join(closeCurly);
            };

            var loadTemplate = function (url, $scope, $el, callback) {
                var path = '{val}.{ext}'.supplant({val: url, ext: $scope.extension || 'xml'});
                $http.get(path).success(function (html) {

                    // :: prep ::
                    html = openClosedTags(html);

                    // :: backwards compatibility ::
                    html = parseEvent(html);

                    // :: parsers ::
                    html = parseRegisteredTags(html);
                    html = parseBindables(html);
                    html = parseExternalFiles(html);

                    // :: comments - file indicator ::
                    html = '<!-- ' + url + ' -->' + newline + html;

                    var el = angular.element(html);

                    //compile the view into a function.
                    var compiled = $compile(el);

                    //append our view to the element of the directive.
                    $el.append(el);

                    //bind our view to the scope!
                    //(try commenting out this line to see what happens!)
                    compiled($scope);

                    callback(el);

                });
            };

            reserveTags(['exec', 'log', 'events', 'event', 'commands', 'command', 'functions', 'function',
                'properties', 'listeners', 'button', 'slide', 'mixins', 'mixin', 'view', 'eval', 'virtual',
                'script', 'style', 'link', 'listener'
            ]);

            $scope.loadTemplate = loadTemplate;
            $scope.parseRegisteredTags = parseRegisteredTags;
            $scope.bindable = bindable;


            // Backwards compatibility
            $scope.parseHashes = parseHashes;
            $scope.parseEvent = parseEvent;

            $scope.alert = function () {
                alert(123);
            };

            $scope.$watch('url', function (url) {
                if (url) {
                    loadTemplate(url, $scope, $element, function (el) {
                        console.log('ready', url);

                        //setTimeout(function () {
                        //    console.log(externalFiles);
                        //    angular.forEach(externalFiles, function (isLoaded, filepath) {
                        //        console.log('##filepath##', filepath);
                        //    });
                        //}, 1000);
                    });
                }
            });
        }
    };
});