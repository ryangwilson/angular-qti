/* global angular */
angular.module('simulation').directive('simulation', function ($http, $compile, $q, $log, $timeout, XMLService, DataService) {
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
            var regExp, patterns = [];

            var incCounter = function (url) {
                counter += 1;
                $log.log('%cinc(' + counter + '): ' + url, 'color: #27ae60');
            };

            var decCounter = function (url) {
                counter -= 1;
                $log.log('%cdec(' + counter + '): ' + url, 'color: #c0392b');
            };

            // :: Model Functionality :://
            $scope.model = {};

            var ds = DataService.data($scope.model);
            $scope.set = function (path, value, delimiter) {
                delimiter = delimiter || '/';
                if (path.indexOf('::') !== -1) {
                    path = path.split('::').join('|').split(delimiter).join('|');
                    delimiter = '|';
                }
                return ds.set(path, value, delimiter);
            };

            $scope.get = function (path, delimiter) {
                delimiter = delimiter || '/';
                if (path.indexOf('::') !== -1) {
                    path = path.split('::').join('|').split(delimiter).join('|');
                    delimiter = '|';
                }
                return ds.get(path, delimiter);
            };

            $scope.watch = function (path, callback) {

                if (!$scope.isBindable(path)) { // if no curly braces

                    $timeout(function () {
                        callback(path);
                    }, 0);

                    return function () { // simulating an unwatch()
                    };
                }

                var delimiter = '/';
                path = path.substring(2, path.length - 2);

                if (path.indexOf('::') !== -1) {
                    path = 'model["' + path.split('::').join('|').split(delimiter).join('|').split('|').join('"]["') + '"]';
                }

                return $scope.$watch(path, function (val) {
                    if (val) {
                        callback(val);
                    }
                });

            };

            /**
             * Converts <tag/> to <tag></tag>
             * @param html
             * @returns {*}
             */
            var openClosedTags = function (html) {
                return html.replace(/<([\w|-]+)(\s.*)\/>/gim, '<$1$2></$1>');
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
                //$console.log('');
                while (startToken && endToken) {
                    $log.log('###found one###');
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

            $scope.isBindable = function (val) {
                val += '';
                return val.indexOf(openBindTag) !== -1;
                //return val.match(/{%.*?%}/gim);
            };

            $scope.curlify = function (content) {
                return content.split(openBindTag).join(openCurly).split(closeBindTag).join(closeCurly);
            };

            $scope.loadSlide = function (options) {
                // first thing we do is increment counter
                incCounter(options.templateUrl);

                //$console.log('counter', counter, options.templateUrl);

                var deferred = $q.defer();
                var path = '{val}.{ext}'.supplant({val: options.templateUrl, ext: $scope.extension || 'xml'});

                $http.get(path).success(function (html) {

                    // :: prep ::
                    html = openClosedTags(html);

                    // :: backwards compatibility ::
                    html = parseEvent(html);

                    // :: parsers ::
                    html = parseRegisteredTags(html);
                    html = parseBindables(html);

                    // :: comments - file indicator ::
                    html = '<!-- ' + options.templateUrl + ' -->' + newline + html;

                    var el = angular.element(html);

                    //compile the view into a function.
                    var compiled = $compile(el);

                    //bind our view to the scope!
                    //(try commenting out this line to see what happens!)
                    compiled(options.targetScope);

                    //append our view to the element of the directive.
                    options.targetEl.append(el);

                    $scope.loadVirtuals(html).then(function () {
                        //$console.log('### DONE LOADING VIRTUALS ####', options.templateUrl);
                        deferred.resolve();
                    });

                    // last thing we do is decrement counter
                    decCounter(options.templateUrl);

                    //var timer = setInterval(function () {
                    //    $console.log('counter', counter);
                    //    if(!counter) {
                    //        var unwatch = $scope.$watch(function(){
                    //            clearInterval(timer);
                    //            deferred.resolve();
                    //        })
                    //    }
                    //}, 100);

                    //deferred.resolve();
                });

                return deferred.promise;
            };

            $scope.loadVirtuals = function (content) {

                var deferred = $q.defer();
                var cleanHtml = content.replace(/<!--[\s\S]*?-->/g, '');
                var files = cleanHtml.match(/([\w\.\/]+)(?=::)/gim);

                if (files) {
                    angular.forEach(files, function (url) {

                        // first thing we do is increment counter
                        incCounter(url);

                        //$console.log('##VIRTUALS##', url);
                        var ext = '.xml';// TODO: Check if extension exists, default to XML
                        $http.get(url + ext).success(function (response) {
                            //$console.log('xml', response.match(/xmlns="(.*?)"/gim).toString());

                            // get the xmlns
                            var xmlns = response.match(/xmlns\="(.*?)(?=")/gim);
                            if (!xmlns) {
                                throw new Error('missing require "xmlns" attribute');
                            }

                            // ex. xmlns="http://certiport.com/hammer/sdk/model
                            var type = xmlns[0].split('/').pop(); // ex. model
                            switch (type) {
                                case 'model':
                                    var json = XMLService.toJson(response);
                                    //$console.log('URL', url);
                                    $scope.set(url, json);
                                    $scope.$broadcast(url);
                                    break;
                            }

                            $scope.loadVirtuals(response).then(function () {
                                deferred.resolve();
                            });

                            // last thing we do is decrement counter
                            decCounter(url);
                        });
                    });
                } else {
                    deferred.resolve();
                }

                return deferred.promise;
            };

            $scope.parseRegisteredTags = parseRegisteredTags;

            // Backwards compatibility
            $scope.parseHashes = parseHashes;
            $scope.parseEvent = parseEvent;

            $scope.$watch('url', function (url) {
                if (url) {
                    $log.log('%c SIM START ', 'background: #2980b9; color: #fff');
                    $scope.loadSlide({
                        templateUrl: url,
                        targetScope: $scope,
                        targetEl: $element
                    }).then(function ($el) {
                    });

                    var unwatch = $scope.$watch(function () {
                        if (counter < 1) {
                            unwatch();
                            $log.log('%c SIM READY ', 'background: #27ae60; color: #fff');
                        }
                    });

                }
            });

            // :: init ::
            reserveTags(['exec', 'log', 'events', 'event', 'commands', 'command', 'functions', 'function',
                'properties', 'listeners', 'button', 'slide', 'mixins', 'mixin', 'view', 'eval', 'virtual',
                'script', 'style', 'link', 'listener'
            ]);
        }
    };
});