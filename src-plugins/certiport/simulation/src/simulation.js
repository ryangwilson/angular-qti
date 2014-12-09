/* global angular */
angular.module('simulation').directive('simulation', function ($http, $compile, $q, $timeout, XMLService, DataService) {
    return {
        restrict: 'AE',
        scope: {
            url: '=',
            extension: '@'
        },
        controller: function ($scope, $element) {

            var prefixTag = 'sim-';
            var openCurly = '{{';
            var closeCurly = '}}';
            var openBindTag = '{%';
            var closeBindTag = '%}';
            var newline = '\n';
            var counter = 0;
            var regExp, patterns = [];
            var virtuals = {};

            var analytics = {
                slideCount: 0,
                virtualCount: 0
            };

            $scope.$$data = {};
            var ds = DataService.data($scope.$$data);

            $scope.$$strings = {};

            //$scope.strings = {};
            //var dsStrings = DataService.data($scope.strings);

            /**
             * Increments a counter used to determine when simulation is ready
             * @param url
             */
            var incCounter = function (url) {
                counter += 1;
                console.log('%cinc(' + counter + '): ' + url, 'color: #27ae60');
            };

            /**
             * Decrements a counter used to determine when simulation is ready
             * @param url
             */
            var decCounter = function (url) {
                counter -= 1;
                console.log('%cdec(' + counter + '): ' + url, 'color: #c0392b');
            };

            // :: Model Functionality :://
            /**
             * Sets a property on the model, can be a complex path using a string
             * @param path
             * @param value
             * @param delimiter
             * @returns {*}
             */
            $scope.set = function (path, value, delimiter) {
                delimiter = delimiter || '/';
                if (path.indexOf('::') !== -1) {
                    path = path.split('::').join('|').split(delimiter).join('|');
                    delimiter = '|';
                }
                return ds.set(path, value, delimiter);
            };

            /**
             * Gets a property on the model, can be a complex path using a string
             * @param path
             * @param delimiter
             * @returns {*}
             */
            $scope.get = function (path, delimiter) {
                delimiter = delimiter || '/';
                if (path.indexOf('::') !== -1) {
                    path = path.split('::').join('|').split(delimiter).join('|');
                    delimiter = '|';
                }
                return ds.get(path, delimiter);
            };

            /**
             * Watches a property on a path, will automatically parse sim paths
             * @param path
             * @param callback
             * @returns {*}
             */
            $scope.watch = function (path, callback, deepWatch) {

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
                    path = '$$data["' + path.split('::').join('|').split(delimiter).join('|').split('|').join('"]["') + '"]';
                }

                return $scope.$watch(path, function (val) {
                    if (val) {
                        callback(val);
                    }
                }, deepWatch);

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
             * converts string
             * @param html
             */
            var parseStrings = function (html) {
                html = html.replace(/\$([\w\.]+)/gim, "{{::@@strings.$1}}");
                html = html.split('@@').join('$$'); // had to do this because $ in regex string causing issues

                return html;
            };

            /**
             * Converts curlies to tag that will not automatically be parsed by angular.
             * Ignore <view> backwards compatibility. If <virtual> tag, only parse virtual tag.
             * Ex. {{ myVal }} to {% myVal %}
             * @param html (string)
             * @returns html (string)
             */
            var parseBindables = function (html) {

                var $el = angular.element('<div>' + html + '</div>'); // the div is a temporary wrapper

                //var viewEl = $el[0].querySelector('sim-view');
                //var viewHtml;
                //if(viewEl) {
                //    viewHtml = viewEl.innerHTML;
                //}

                var childNodes = $el[0].childNodes;
                var len = childNodes.length;
                for (var e = 0; e < len; e++) {
                    if (childNodes[e] && childNodes[e].nodeType === 1) { // if text node and has content remove
                        childNodes[e].outerHTML = childNodes[e].outerHTML.split(openCurly).join(openBindTag).split(closeCurly).join(closeBindTag);
                    }
                }

                //if(viewEl) {
                //    var $viewEl = angular.element(viewEl);
                //    $viewEl.html(viewHtml);
                //}

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

            /**
             * Reserved tags will be prefixed with "sim-"
             * @param tags
             */
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

            /**
             * Appends a commands segment to the DOM as an angular element
             * @param path
             * @param html
             */
            var appendCommand = function (path, html) {

                html = parseRegisteredTags(html);

                // add path
                html = html.replace(/name="(\w+)"/gim, 'name="' + path + '::$1"');

                // create angular element
                var el = angular.element(html);

                //compile the view into a function.
                var compiled = $compile(el);

                //bind our view to the scope!
                compiled($scope);

                //append our view to the element of the directive.
                $element.append(el);

            };

            /**
             * Checks if the value is using bind tags
             * @param val
             * @returns {boolean}
             */
            $scope.isBindable = function (val) {
                val += '';
                return val.indexOf(openBindTag) !== -1;
            };

            /**
             * Converts sim bindable tags to angular bindable tags
             * @param content
             * @returns {string}
             */
            $scope.curlify = function (content) {
                return content.split(openBindTag).join(openCurly).split(closeBindTag).join(closeCurly);
            };


            /**
             * Loads a slide and all the virtuals and then appends slide to DOM
             * @param options
             * @returns {promise.promise|jQuery.promise|jQuery.ready.promise|promise|qFactory.Deferred.promise|dd.g.promise}
             */
            $scope.loadSlide = function (options) {

                console.log('%cloading slide ' + options.templateUrl + ' ', 'color: #bdc3c7');

                // first thing we do is increment counter
                incCounter(options.templateUrl);
                analytics.slideCount += 1;

                var deferred = $q.defer();
                var path = '{val}.{ext}'.supplant({val: options.templateUrl, ext: $scope.extension || 'xml'});

                $http.get(path).success(function (html) {

                    // TODO: Possibly break out the parsers (?)
                    // :: prep ::
                    html = openClosedTags(html);

                    // :: backwards compatibility ::
                    html = parseEvent(html);

                    // :: parsers ::
                    html = parseRegisteredTags(html);
                    html = parseBindables(html);
                    html = parseStrings(html);

                    // :: comments - file indicator ::
                    html = '<!-- ' + options.templateUrl + ' -->' + newline + html;

                    var el = angular.element(html);

                    //compile the view into a function.
                    var compiled = $compile(el);

                    //bind our view to the scope!
                    compiled(options.targetScope);

                    //append our view to the element of the directive.
                    options.targetEl.append(el);

                    //console.log('ATTEMPT LOAD VIRTUALS', path);
                    $scope.loadVirtuals(html, path).then(function () {
                        //console.log('### DONE LOADING VIRTUALS ####', options.templateUrl);
                        console.log('%cvirtuals loaded for ' + options.templateUrl, 'color: #3498db');
                        deferred.resolve();
                    });

                    // last thing we do is decrement counter
                    decCounter(options.templateUrl);
                });

                return deferred.promise;
            };

            /**
             * Finds and loads all virtual elements of the content provided.
             * @param content
             * @returns {promise.promise|jQuery.promise|jQuery.ready.promise|promise|qFactory.Deferred.promise|dd.g.promise}
             */
            $scope.loadVirtuals = function (content, url) {

                var deferred = $q.defer();
                var cleanHtml = content.replace(/<!--[\s\S]*?-->/g, '');
                var files = cleanHtml.match(/([\w\.\/]+)(?=::)/gim);

                if (files) {
                    var virtualCount = 0;
                    angular.forEach(files, function (url) {

                        if (!virtuals[url]) {
                            virtualCount += 1;
                            // first thing we do is increment counter
                            incCounter(url);
                            analytics.virtualCount += 1

                            virtuals[url] = true;

                            //$console.log('##VIRTUALS##', url);
                            var ext = '.xml';// TODO: Check if extension exists, default to XML
                            $http.get(url + ext).success(function (html) {
                                //$console.log('xml', response.match(/xmlns="(.*?)"/gim).toString());

                                // get the xmlns
                                var xmlns = html.match(/xmlns\="(.*?)(?=")/gim);
                                if (!xmlns) {
                                    throw new Error('missing require "xmlns" attribute');
                                }

                                // ex. xmlns="http://certiport.com/hammer/sdk/model
                                var type = xmlns[0].split('/').pop(); // ex. model
                                switch (type) {
                                    case 'model':
                                        var json = XMLService.toJson(html);
                                        $scope.set(url, json);
                                        break;
                                    case 'commands':
                                        appendCommand(url, html);
                                        break;
                                }

                                $scope.loadVirtuals(html, url).then(function () {
                                    deferred.resolve();
                                });

                                // last thing we do is decrement counter
                                decCounter(url);
                            });
                        }

                        if (virtualCount === 0) {
                            deferred.resolve();
                        }
                    });
                } else {
                    //console.info('NO VIRTUALS TO LOAD', url);
                    deferred.resolve();
                }

                return deferred.promise;
            };

            $scope.parseRegisteredTags = parseRegisteredTags;
            $scope.incCounter = incCounter;
            $scope.decCounter = decCounter;

            // Backwards compatibility
            $scope.parseHashes = parseHashes;
            $scope.parseEvent = parseEvent;

            // :: init ::
            $element.addClass(prefixTag + 'cloak');

            reserveTags(['exec', 'log', 'events', 'event', 'commands', 'command', 'functions', 'function',
                'properties', 'listeners', 'button', 'slide', 'mixins', 'mixin', 'view', 'eval', 'virtual',
                'script', 'style', 'link', 'listener', 'image', 'strings'
            ]);


            var padRight = function (str) {
                var filler = '                                        ';
                return str + filler.slice(str.length);
            };

            /**
             * Watch when url has changed
             */
            $scope.$watch('url', function (url) {
                if (url) {
                    analytics.startTime = Date.now();
                    console.log('%c ' + padRight('SIM START'), 'background: #2980b9; color: #fff');
                    $scope.loadSlide({
                        templateUrl: url,
                        targetScope: $scope,
                        targetEl: $element
                    }).then(function ($el) {
                    });

                    var timer;
                    var unwatch = $scope.$watch(function () {
                        $timeout.cancel(timer);
                        timer = $timeout(function () {
                            if (counter < 1) {
                                unwatch();
                                analytics.endTime = Date.now();
                                analytics.totalTime = analytics.endTime - analytics.startTime;
                                console.log('%cslide ready ' + url, 'color: #8e44ad');
                                console.log('%c ' + padRight('SIM READY'), 'background: #27ae60; color: #fff');
                                console.log('%c ' + padRight('INITIALIZATION REPORT'), 'background: #34495e; color: #fff');
                                console.log('%ctime: ' + analytics.totalTime, 'color: #34495e');
                                console.log('%cslide count: ' + analytics.slideCount, 'color: #34495e');
                                console.log('%cvirtual count: ' + analytics.virtualCount, 'color: #34495e');
                                console.log('%c ' + padRight('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'), 'background: #34495e; color: #fff');

                                $element.removeClass(prefixTag + 'cloak');

                                $scope.$broadcast('sim::ready');
                            }
                        }, 0);
                    });

                }
            });
        }
    };
});