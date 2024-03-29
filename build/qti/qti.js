/*
* qti-1.2-engine 0.1.0
*/
angular.module("qti.plugins", []);

angular.module("qti", [ "qti.plugins", "ngSanitize" ]);

angular.module("qti").constant("ATTR_MAP", {
    fontsize: "font-size",
    fontface: "font-family",
    backgroundColor: "background-color",
    width: "width",
    height: "height"
});

angular.module("qti").service("helpers", function() {
    this.strToXML = function(str) {
        var parser, xmlDoc;
        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(str, "text/xml");
        } else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(str);
        }
        return xmlDoc;
    };
    this.xmlToStr = function(xmlObject) {
        var str;
        if (window.ActiveXObject) {
            str = xmlObject.xml;
        } else {
            str = new XMLSerializer().serializeToString(xmlObject);
        }
        str = str.replace(/\sxmlns=".*?"/gim, "");
        return str;
    };
    this.addClass = function(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += " " + className;
        }
    };
    this.removeClass = function(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
        }
    };
});

angular.module("qti").directive("qti", [ "$http", "$compile", "helpers", function($http, $compile, helpers) {
    function stripCDATA(str) {
        return str.split("<![CDATA[").join("").split("]]>").join("");
    }
    function fixNamespace(str) {
        return str;
    }
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            scope.src = null;
            scope.template = null;
            scope.content = null;
            $http.get(attr.src).then(function(response) {
                scope.src = response.data;
                scope.template = stripCDATA(scope.src);
                scope.template = fixNamespace(scope.template);
                scope.$emit("qti::setup");
                var linkFn = $compile(scope.template);
                scope.content = linkFn(scope);
                el.append(scope.content);
                scope.$emit("qti::ready");
            });
        }
    };
} ]);

angular.module("qti").directive("font", function() {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            var size = attr.size;
            el[0].removeAttribute("size");
            el.css("fontSize", attr.size + "px");
        }
    };
});

angular.module("qti").directive("img", function() {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            if (attr.hasOwnProperty("align")) {
                el.css("vertical-align", attr.align);
            }
        }
    };
});

angular.module("qti.plugins").service("scripting", [ "$rootScope", function($rootScope) {
    var replaceDyn = function(str) {
        return str.replace(/<dyn type="text\/groovy">(\s?)+return(\s?)+((.|\n)*?)(;?)<\/dyn>/gim, "{{ $3 }}");
    };
    var replaceShorthand = function(str) {
        return str.replace(/\${(\s?)+((.|\n)*?)\}/gim, "{{ system.$2 }}");
    };
    $rootScope.$on("qti::setup", function(evt) {
        evt.targetScope.template = replaceDyn(evt.targetScope.template);
        evt.targetScope.template = replaceShorthand(evt.targetScope.template);
    });
} ]).run([ "scripting", function(scripting) {} ]);

angular.module("qti.plugins").directive("tabStops", [ "$compile", function($compile) {
    function parseTabStops(attributes) {
        var tabStops = {};
        if (attributes) {
            var props = attributes.split(";");
            var prop, key, value;
            for (var i = 0; i < props.length; i += 1) {
                prop = props[i].split(":");
                key = (prop[0] + "").trim();
                value = (prop[1] + "").trim();
                if (key === "interval") {
                    tabStops[key] = Number(value);
                } else if (key === "tabset") {
                    tabStops[key] = JSON.parse('{"list": [' + value + "]}").list;
                } else if (key === "alignment") {
                    tabStops[key] = value.match(/\w+/gim);
                    if (tabStops[key].length === 1) {
                        tabStops[key] = tabStops[key][0];
                    }
                }
            }
        }
        return tabStops;
    }
    return {
        restrict: "A",
        link: function(scope, el, attr) {
            var tabStops = parseTabStops(attr.tabStops);
            var html = el.html();
            var tabCount = html.split("	").length - 1;
            var linkFn, content;
            if (tabCount) {
                if (tabStops.hasOwnProperty("interval")) {
                    html = html.split("	").join('<span style="padding-right:' + tabStops.interval + 'in"></span>');
                    html = "<div>" + html + "</div>";
                    linkFn = $compile(html);
                    content = linkFn(scope);
                    el.empty();
                    el.append(content);
                } else if (tabStops.hasOwnProperty("tabset")) {
                    var htmlStr = "";
                    html = html.split("	");
                    for (var i = 0; i < html.length; i += 1) {
                        htmlStr += html[i] + '<span style="padding-right:' + tabStops.tabset[i] + 'in"></span>';
                    }
                    html = "<div>" + htmlStr + "</div>";
                    linkFn = $compile(html);
                    content = linkFn(scope);
                    el.empty();
                    el.append(content);
                }
            }
        }
    };
} ]);

"use strict";

angular.module("qti.plugins").constant("VG_STATES", {
    PLAY: "play",
    PAUSE: "pause",
    STOP: "stop"
}).service("VG_UTILS", function() {
    this.fixEventOffset = function($event) {
        if (navigator.userAgent.match(/Firefox/i)) {
            var style = $event.currentTarget.currentStyle || window.getComputedStyle($event.target, null);
            var borderLeftWidth = parseInt(style["borderLeftWidth"], 10);
            var borderTopWidth = parseInt(style["borderTopWidth"], 10);
            var rect = $event.currentTarget.getBoundingClientRect();
            var offsetX = $event.clientX - borderLeftWidth - rect.left;
            var offsetY = $event.clientY - borderTopWidth - rect.top;
            $event.offsetX = offsetX;
            $event.offsetY = offsetY;
        }
        return $event;
    };
    this.getZIndex = function() {
        var zIndex = 1;
        angular.element("*").filter(function() {
            return angular.element(this).css("zIndex") !== "auto";
        }).each(function() {
            var thisZIndex = parseInt(angular.element(this).css("zIndex"));
            if (zIndex < thisZIndex) zIndex = thisZIndex + 1;
        });
        return zIndex;
    };
    this.secondsToDate = function(seconds) {
        var result = new Date();
        result.setTime(seconds * 1e3);
        return result;
    };
    this.isMobileDevice = function() {
        return typeof window.orientation !== "undefined" || navigator.userAgent.indexOf("IEMobile") !== -1;
    };
    this.isiOSDevice = function() {
        return navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i);
    };
}).run([ "$window", "VG_UTILS", function($window, VG_UTILS) {
    var fullScreenAPI;
    var APIs = {
        w3: {
            enabled: "fullscreenEnabled",
            element: "fullscreenElement",
            request: "requestFullscreen",
            exit: "exitFullscreen",
            onchange: "fullscreenchange",
            onerror: "fullscreenerror"
        },
        newWebkit: {
            enabled: "webkitFullscreenEnabled",
            element: "webkitFullscreenElement",
            request: "webkitRequestFullscreen",
            exit: "webkitExitFullscreen",
            onchange: "webkitfullscreenchange",
            onerror: "webkitfullscreenerror"
        },
        oldWebkit: {
            enabled: "webkitIsFullScreen",
            element: "webkitCurrentFullScreenElement",
            request: "webkitRequestFullScreen",
            exit: "webkitCancelFullScreen",
            onchange: "webkitfullscreenchange",
            onerror: "webkitfullscreenerror"
        },
        moz: {
            enabled: "mozFullScreen",
            element: "mozFullScreenElement",
            request: "mozRequestFullScreen",
            exit: "mozCancelFullScreen",
            onchange: "mozfullscreenchange",
            onerror: "mozfullscreenerror"
        },
        ios: {
            enabled: "webkitFullscreenEnabled",
            element: "webkitFullscreenElement",
            request: "webkitEnterFullscreen",
            exit: "webkitExitFullscreen",
            onchange: "webkitfullscreenchange",
            onerror: "webkitfullscreenerror"
        },
        ms: {
            enabled: "msFullscreenEnabled",
            element: "msFullscreenElement",
            request: "msRequestFullscreen",
            exit: "msExitFullscreen",
            onchange: "msfullscreenchange",
            onerror: "msfullscreenerror"
        }
    };
    for (var browser in APIs) {
        if (APIs[browser].enabled in document) {
            fullScreenAPI = APIs[browser];
            fullScreenAPI.isFullScreen = function() {
                return document[this.element] != null;
            };
            break;
        }
    }
    if (VG_UTILS.isiOSDevice()) {
        fullScreenAPI = APIs.ios;
        fullScreenAPI.isFullScreen = function() {
            return document[this.element] != null;
        };
    }
    angular.element($window)[0].fullScreenAPI = fullScreenAPI;
} ]).directive("videogular", [ "$window", "VG_STATES", "VG_UTILS", function($window, VG_STATES, VG_UTILS) {
    return {
        restrict: "E",
        scope: {
            theme: "=vgTheme",
            autoPlay: "=vgAutoplay",
            vgComplete: "&",
            vgUpdateVolume: "&",
            vgUpdateTime: "&",
            vgUpdateState: "&",
            vgPlayerReady: "&",
            vgChangeSource: "&"
        },
        controller: [ "$scope", "$timeout", function($scope, $timeout) {
            var currentTheme = null;
            var isFullScreenPressed = false;
            var isMetaDataLoaded = false;
            var vgCompleteCallBack = $scope.vgComplete();
            var vgUpdateVolumeCallBack = $scope.vgUpdateVolume();
            var vgUpdateTimeCallBack = $scope.vgUpdateTime();
            var vgUpdateStateCallBack = $scope.vgUpdateState();
            var vgPlayerReadyCallBack = $scope.vgPlayerReady();
            var vgChangeSourceCallBack = $scope.vgChangeSource();
            this.videogularElement = null;
            this.clearMedia = function() {
                $scope.API.mediaElement[0].src = "";
            };
            this.onMobileVideoReady = function(evt, target) {
                this.onVideoReady(evt, target, true);
            };
            this.onVideoReady = function(evt, target, avoidDigest) {
                $scope.API.isReady = true;
                $scope.API.currentState = VG_STATES.STOP;
                if (!avoidDigest) $scope.$apply();
                isMetaDataLoaded = true;
                if ($scope.vgPlayerReady()) {
                    vgPlayerReadyCallBack = $scope.vgPlayerReady();
                    vgPlayerReadyCallBack($scope.API);
                }
                if ($scope.autoPlay && !VG_UTILS.isMobileDevice() || $scope.API.currentState === VG_STATES.PLAY) {
                    $timeout(function() {
                        $scope.API.play();
                    });
                }
            };
            this.onUpdateTime = function(event) {
                $scope.API.currentTime = VG_UTILS.secondsToDate(event.target.currentTime);
                $scope.API.totalTime = VG_UTILS.secondsToDate(event.target.duration);
                $scope.API.timeLeft = VG_UTILS.secondsToDate(event.target.duration - event.target.currentTime);
                if ($scope.vgUpdateTime()) {
                    vgUpdateTimeCallBack = $scope.vgUpdateTime();
                    vgUpdateTimeCallBack(event.target.currentTime, event.target.duration);
                }
                $scope.$apply();
            };
            this.$on = function() {
                $scope.$on.apply($scope, arguments);
            };
            this.seekTime = function(value, byPercent) {
                var second;
                if (byPercent) {
                    second = value * $scope.API.mediaElement[0].duration / 100;
                    $scope.API.mediaElement[0].currentTime = second;
                } else {
                    second = value;
                    $scope.API.mediaElement[0].currentTime = second;
                }
                $scope.API.currentTime = VG_UTILS.secondsToDate(second);
            };
            this.playPause = function() {
                if ($scope.API.mediaElement[0].paused) {
                    this.play();
                } else {
                    this.pause();
                }
            };
            this.setState = function(newState) {
                if (newState && newState != $scope.API.currentState) {
                    if ($scope.vgUpdateState()) {
                        vgUpdateStateCallBack = $scope.vgUpdateState();
                        vgUpdateStateCallBack(newState);
                    }
                    $scope.API.currentState = newState;
                }
                return $scope.API.currentState;
            };
            this.play = function() {
                $scope.API.mediaElement[0].play();
                this.setState(VG_STATES.PLAY);
            };
            this.pause = function() {
                $scope.API.mediaElement[0].pause();
                this.setState(VG_STATES.PAUSE);
            };
            this.stop = function() {
                $scope.API.mediaElement[0].pause();
                $scope.API.mediaElement[0].currentTime = 0;
                this.setState(VG_STATES.STOP);
            };
            this.toggleFullScreen = function() {
                if (!angular.element($window)[0].fullScreenAPI) {
                    if ($scope.API.isFullScreen) {
                        $scope.API.videogularElement.removeClass("fullscreen");
                        $scope.API.videogularElement.css("z-index", 0);
                    } else {
                        $scope.API.videogularElement.addClass("fullscreen");
                        $scope.API.videogularElement.css("z-index", VG_UTILS.getZIndex());
                    }
                    $scope.API.isFullScreen = !$scope.API.isFullScreen;
                } else {
                    if (angular.element($window)[0].fullScreenAPI.isFullScreen()) {
                        if (!VG_UTILS.isMobileDevice()) {
                            document[angular.element($window)[0].fullScreenAPI.exit]();
                        }
                    } else {
                        if (VG_UTILS.isMobileDevice()) {
                            if (VG_UTILS.isiOSDevice()) {
                                if (isMetaDataLoaded) {
                                    this.enterElementInFullScreen($scope.API.mediaElement[0]);
                                } else {
                                    isFullScreenPressed = true;
                                    this.play();
                                }
                            } else {
                                this.enterElementInFullScreen($scope.API.mediaElement[0]);
                            }
                        } else {
                            this.enterElementInFullScreen($scope.API.videogularElement[0]);
                        }
                    }
                }
            };
            this.enterElementInFullScreen = function(element) {
                element[angular.element($window)[0].fullScreenAPI.request]();
            };
            this.changeSource = function(newValue) {
                if ($scope.vgChangeSource()) {
                    vgChangeSourceCallBack = $scope.vgChangeSource();
                    vgChangeSourceCallBack(newValue);
                }
            };
            this.setVolume = function(newVolume) {
                if ($scope.vgUpdateVolume()) {
                    vgUpdateVolumeCallBack = $scope.vgUpdateVolume();
                    vgUpdateVolumeCallBack(newVolume);
                }
                $scope.API.mediaElement[0].volume = newVolume;
                $scope.API.volume = newVolume;
            };
            this.updateTheme = function(value) {
                if (currentTheme) {
                    var links = document.getElementsByTagName("link");
                    for (var i = 0, l = links.length; i < l; i++) {
                        if (links[i].outerHTML.indexOf(currentTheme) >= 0) {
                            links[i].parentNode.removeChild(links[i]);
                        }
                    }
                }
                if (value) {
                    var headElem = angular.element(document).find("head");
                    headElem.append("<link rel='stylesheet' href='" + value + "'>");
                    currentTheme = value;
                }
            };
            this.onStartBuffering = function(event) {
                $scope.API.isBuffering = true;
            };
            this.onStartPlaying = function(event) {
                event.target.width++;
                event.target.width--;
                $scope.API.isBuffering = false;
            };
            this.onComplete = function(event) {
                if ($scope.vgComplete()) {
                    vgCompleteCallBack = $scope.vgComplete();
                    vgCompleteCallBack();
                }
                $scope.API.setState(VG_STATES.STOP);
                $scope.API.isCompleted = true;
                $scope.$apply();
            };
            $scope.API = this;
            $scope.init = function() {
                $scope.API.isReady = false;
                $scope.API.isCompleted = false;
                $scope.API.currentTime = 0;
                $scope.API.totalTime = 0;
                $scope.API.timeLeft = 0;
                $scope.API.updateTheme($scope.theme);
                $scope.addBindings();
                if (angular.element($window)[0].fullScreenAPI) {
                    document.addEventListener(angular.element($window)[0].fullScreenAPI.onchange, $scope.onFullScreenChange);
                }
            };
            $scope.addBindings = function() {
                $scope.$watch("theme", function(newValue, oldValue) {
                    if (newValue != oldValue) {
                        $scope.API.updateTheme(newValue);
                    }
                });
                $scope.$watch("autoPlay", function(newValue, oldValue) {
                    if (newValue != oldValue) {
                        if (newValue) $scope.API.play();
                    }
                });
            };
            $scope.onFullScreenChange = function(event) {
                $scope.API.isFullScreen = angular.element($window)[0].fullScreenAPI.isFullScreen();
                $scope.$apply();
            };
            $scope.$on("$destroy", this.clearMedia);
            $scope.$on("$routeChangeStart", this.clearMedia);
            $scope.init();
        } ],
        link: {
            pre: function(scope, elem, attr, controller) {
                controller.videogularElement = angular.element(elem);
            }
        }
    };
} ]).directive("vgVideo", [ "$compile", "VG_UTILS", function($compile, VG_UTILS) {
    return {
        restrict: "E",
        require: "^videogular",
        scope: {
            vgSrc: "=",
            vgLoop: "=",
            vgPreload: "=",
            vgNativeControls: "=",
            vgTracks: "="
        },
        link: function(scope, elem, attr, API) {
            var videoTagText = '<video vg-source="vgSrc" ';
            videoTagText += "></video>";
            API.mediaElement = angular.element(videoTagText);
            var compiled = $compile(API.mediaElement)(scope);
            API.mediaElement[0].addEventListener("loadedmetadata", API.onVideoReady, false);
            API.mediaElement[0].addEventListener("waiting", API.onStartBuffering, false);
            API.mediaElement[0].addEventListener("ended", API.onComplete, false);
            API.mediaElement[0].addEventListener("playing", API.onStartPlaying, false);
            API.mediaElement[0].addEventListener("timeupdate", API.onUpdateTime, false);
            elem.append(compiled);
            if (VG_UTILS.isMobileDevice()) {
                API.mediaElement[0].removeEventListener("loadedmetadata", API.onVideoReady, false);
                API.onMobileVideoReady();
            }
        }
    };
} ]).directive("vgAudio", [ "$compile", "VG_UTILS", function($compile, VG_UTILS) {
    return {
        restrict: "E",
        require: "^videogular",
        scope: {
            vgSrc: "=",
            vgLoop: "=",
            vgPreload: "=",
            vgNativeControls: "=",
            vgTracks: "="
        },
        link: function(scope, elem, attr, API) {
            var audioTagText = '<audio vg-source="vgSrc" ';
            audioTagText += "></audio>";
            API.mediaElement = angular.element(audioTagText);
            var compiled = $compile(API.mediaElement)(scope);
            API.mediaElement[0].addEventListener("loadedmetadata", API.onVideoReady, false);
            API.mediaElement[0].addEventListener("waiting", API.onStartBuffering, false);
            API.mediaElement[0].addEventListener("ended", API.onComplete, false);
            API.mediaElement[0].addEventListener("playing", API.onStartPlaying, false);
            API.mediaElement[0].addEventListener("timeupdate", API.onUpdateTime, false);
            elem.append(compiled);
            if (VG_UTILS.isMobileDevice()) {
                API.mediaElement[0].removeEventListener("loadedmetadata", API.onVideoReady, false);
                API.onMobileVideoReady();
            }
        }
    };
} ]).directive("vgSource", [ function() {
    return {
        restrict: "A",
        link: {
            pre: function(scope, elem, attr) {
                var sources;
                var canPlay;
                function changeSource() {
                    canPlay = "";
                    if (elem[0].canPlayType) {
                        for (var i = 0, l = sources.length; i < l; i++) {
                            canPlay = elem[0].canPlayType(sources[i].type);
                            if (canPlay == "maybe" || canPlay == "probably") {
                                elem.attr("src", sources[i].src);
                                elem.attr("type", sources[i].type);
                                break;
                            }
                        }
                    } else {
                        elem.attr("src", sources[0].src);
                        elem.attr("type", sources[0].type);
                    }
                    if (canPlay == "") {}
                }
                scope.$watch(attr.vgSource, function(newValue, oldValue) {
                    if ((!sources || newValue != oldValue) && newValue) {
                        sources = newValue;
                        changeSource();
                    }
                });
            }
        }
    };
} ]).directive("vgTracks", [ function() {
    return {
        restrict: "A",
        require: "^videogular",
        link: {
            pre: function(scope, elem, attr, API) {
                var tracks;
                var trackText;
                var i;
                var l;
                function changeSource() {
                    var oldTracks = API.mediaElement.children();
                    for (i = 0, l = oldTracks.length; i < l; i++) {
                        oldTracks[i].remove();
                    }
                    if (tracks) {
                        for (i = 0, l = tracks.length; i < l; i++) {
                            trackText = "";
                            trackText += "<track ";
                            for (var prop in tracks[i]) {
                                trackText += prop + '="' + tracks[i][prop] + '" ';
                            }
                            trackText += "></track>";
                            API.mediaElement.append(trackText, tracks[i].src);
                        }
                    }
                }
                scope.$watch(attr.vgTracks, function(newValue, oldValue) {
                    if (!tracks || newValue != oldValue) {
                        tracks = newValue;
                        API.tracks = tracks;
                        changeSource();
                    }
                });
            }
        }
    };
} ]).directive("vgLoop", [ function() {
    return {
        restrict: "A",
        require: "^videogular",
        link: {
            pre: function(scope, elem, attr, API) {
                var loop;
                scope.$watch(attr.vgLoop, function(newValue, oldValue) {
                    if ((!loop || newValue != oldValue) && newValue) {
                        loop = newValue;
                        API.mediaElement.attr("loop", loop);
                    } else {
                        API.mediaElement.removeAttr("loop");
                    }
                });
            }
        }
    };
} ]).directive("vgPreload", [ function() {
    return {
        restrict: "A",
        require: "^videogular",
        link: {
            pre: function(scope, elem, attr, API) {
                var preload;
                scope.$watch(attr.vgPreload, function(newValue, oldValue) {
                    if ((!preload || newValue != oldValue) && newValue) {
                        preload = newValue;
                        API.mediaElement.attr("preload", preload);
                    } else {
                        API.mediaElement.removeAttr("preload");
                    }
                });
            }
        }
    };
} ]).directive("vgNativeControls", [ function() {
    return {
        restrict: "A",
        require: "^videogular",
        link: {
            pre: function(scope, elem, attr, API) {
                var controls;
                scope.$watch(attr.vgNativeControls, function(newValue, oldValue) {
                    if ((!controls || newValue != oldValue) && newValue) {
                        controls = newValue;
                        API.mediaElement.attr("controls", "");
                    } else {
                        API.mediaElement.removeAttr("controls");
                    }
                });
            }
        }
    };
} ]);

angular.module("qti").directive("assessment", function() {
    return {
        restrict: "E",
        scope: true,
        transclude: true,
        replace: true,
        templateUrl: "templates/assessment.html",
        link: function(scope, el, attr) {
            scope.assessment = {
                id: attr.ident,
                title: attr.title
            };
        }
    };
});

angular.module("qti").directive("flowMat", [ "ATTR_MAP", function(ATTR_MAP) {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            var px = "px";
            for (var e in attr) {
                if (ATTR_MAP[e]) {
                    el.css(ATTR_MAP[e], isNaN(attr[e]) ? attr[e] : attr[e] + px);
                }
            }
        }
    };
} ]);

angular.module("qti").directive("item", [ "$sce", function($sce) {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            scope.item.questionId = attr.ident;
            scope.$broadcast("item::ready");
        },
        controller: [ "$scope", function($scope) {
            $scope.objective = null;
            $scope.item = {};
        } ]
    };
} ]);

angular.module("qti").directive("backgroundColor", function() {
    return {
        restrict: "A",
        link: function($scope, $el, $attr) {
            if ($attr.backgroundColor) {
                $el[0].style["background-color"] = $attr.backgroundColor;
            }
        }
    };
});

angular.module("qti").directive("border", function() {
    return {
        restrict: "A",
        link: function($scope, $el, $attr) {
            var el = $el[0];
            var px = "px";
            if ($attr.border) {
                el.style["border-style"] = "solid";
                if ($attr.border.indexOf(",") === -1) {
                    el.style.border = parseInt($attr.border, 10) + px;
                } else {
                    var borders = $attr.border.split(",");
                    el.style["border-top-width"] = parseInt(borders[0], 10) + px;
                    el.style["border-left-width"] = parseInt(borders[1], 10) + px;
                    el.style["border-bottom-width"] = parseInt(borders[2], 10) + px;
                    el.style["border-right-width"] = parseInt(borders[3], 10) + px;
                }
            }
            if ($attr.borderColor) {
                el.style["border-color"] = $attr.borderColor;
            }
        }
    };
});

angular.module("qti").directive("firstlineindent", function() {
    return {
        restrict: "A",
        link: function($scope, $el, $attr) {
            var mattexts, str, i, len;
            str = "";
            len = parseInt($attr.firstlineindent, 10);
            for (i = 0; i < len; i += 1) {
                str += "&nbsp;";
            }
            mattexts = $el[0].querySelectorAll("mattext:not([fli]");
            len = mattexts.length;
            for (i = 0; i < len; i += 1) {
                if (!mattexts[i].getAttribute("firstlineindent")) {
                    mattexts[i].innerHTML = str + mattexts[i].innerHTML;
                    mattexts[i].setAttribute("fli", "");
                }
            }
        }
    };
});

angular.module("qti").directive("flow", function() {
    return {
        restrict: "E",
        scope: true,
        link: function($scope, $el, $attr) {
            var el = $el[0];
            var px = "px";
            var unit;
            if ($attr.width) {
                unit = String($attr.width).match(/\D+/);
                if (unit) {
                    el.style.width = $attr.width + unit[0];
                } else {
                    el.style.width = $attr.width + px;
                    if ($attr.height === undefined) {
                        if (parseInt($attr.width, 10) > 40) {
                            el.style["overflow"] = "auto";
                        } else {
                            el.style["overflow"] = "hidden";
                        }
                    }
                }
            }
            if ($attr.height) {
                unit = String($attr.height).match(/\D+/);
                if (unit) {
                    el.style.height = $attr.height + unit[0];
                } else {
                    el.style.height = $attr.height + px;
                }
            }
        }
    };
});

angular.module("qti").directive("inset", function() {
    return {
        restrict: "A",
        link: function($scope, $el, $attr) {
            var el = $el[0];
            var px = "px";
            if ($attr.inset) {
                if ($attr.inset.indexOf(",") === -1) {
                    el.style["padding"] = parseInt($attr.inset, 10) + px;
                } else {
                    var insets = $attr.inset.split(",");
                    el.style["padding-top"] = parseInt(insets[0], 10) + px;
                    el.style["padding-left"] = parseInt(insets[1], 10) + px;
                    el.style["padding-bottom"] = parseInt(insets[2], 10) + px;
                    el.style["padding-right"] = parseInt(insets[3], 10) + px;
                }
            }
        }
    };
});

angular.module("qti").directive("matimage", [ "$compile", function($compile) {
    return {
        restrict: "E",
        scope: true,
        link: function($scope, $el, $attr) {
            var px = "px";
            var base64 = "data:image/jpg;base64";
            var content = $el.text().trim();
            var imgEl = angular.element('<img ng-src="{{src}}" matimage-img />');
            var compiled = $compile(imgEl);
            $el.empty();
            $el.append(imgEl);
            compiled($scope);
            var valign;
            switch ($attr.valign) {
              case "top":
                valign = "top";
                break;

              case "bottom":
                valign = "bottom";
                break;

              default:
                valign = "middle";
                break;
            }
            imgEl.css("vertical-align", valign);
            if ($attr.hasOwnProperty("width")) {
                imgEl.css("width", $attr.width + px);
            }
            if ($attr.hasOwnProperty("height")) {
                imgEl.css("height", $attr.height + px);
            }
            if ($attr.hasOwnProperty("uri")) {
                $scope.src = $attr.uri;
            } else if ($attr.hasOwnProperty("embedded")) {
                $scope.src = base64 + "," + content;
            }
        }
    };
} ]);

angular.module("qti").directive("mattext", [ "$sce", function($sce) {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            if (attr.hasOwnProperty("width")) {
                el.css("width", attr.width + "px");
                el.css("display", "inline-block");
            }
            if (attr.hasOwnProperty("height")) {
                el.css("height", attr.height + "px");
                el.css("display", "inline-block");
            }
            if (attr.hasOwnProperty("fontface")) {
                el.css("font-family", attr.fontface);
            }
            if (attr.hasOwnProperty("fontsize")) {
                el.css("font-size", attr.fontsize + "px");
            }
        }
    };
} ]);

angular.module("qti").service("mattext", [ "$rootScope", "helpers", function($rootScope, helpers) {
    var _replaceSpaces = function(match, group) {
        return match.split(" ").join("__SPACE__");
    };
    var _replaceTabs = function(match, group) {
        return match.split(" ").join("__TAB__");
    };
    var fixMattext = function(xmlStr) {
        var xml = helpers.strToXML(xmlStr);
        var mattexts = xml.querySelectorAll("mattext");
        var mattext, childNodes, childNode, str;
        for (var i = 0; i < mattexts.length; i++) {
            mattext = mattexts[i];
            var mattextStr = mattext.innerHTML;
            if (mattextStr.indexOf("<") === -1) {
                helpers.addClass(mattext, "qti-prewrap");
            }
        }
        var oSerializer = new XMLSerializer();
        xmlStr = oSerializer.serializeToString(xml);
        return xmlStr;
    };
    $rootScope.$on("qti::setup", function(evt) {
        evt.targetScope.template = fixMattext(evt.targetScope.template);
    });
} ]).run([ "mattext", function(mattext) {} ]);

angular.module("qti.plugins").directive("matvideo", [ "$sce", function($sce) {
    return {
        restrict: "E",
        scope: true,
        templateUrl: "templates/matvideo.html",
        link: function(scope, el, attrs) {
            scope.currentTime = 0;
            scope.totalTime = 0;
            scope.state = null;
            scope.volume = 1;
            scope.isCompleted = false;
            scope.API = null;
            scope.onPlayerReady = function(API) {
                scope.API = API;
            };
            scope.onCompleteVideo = function() {
                scope.isCompleted = true;
            };
            scope.onUpdateState = function(state) {
                scope.state = state;
            };
            scope.onUpdateTime = function(currentTime, totalTime) {
                scope.currentTime = currentTime;
                scope.totalTime = totalTime;
            };
            scope.onUpdateVolume = function(newVol) {
                scope.volume = newVol;
            };
            scope.onUpdateSize = function(width, height) {
                scope.config.width = width;
                scope.config.height = height;
            };
            var config = {};
            config.autoHide = false;
            config.autoHideTime = 3e3;
            config.autoPlay = attrs.autoPlay === "true";
            config.playAvailable = attrs.playAvailable !== "false";
            config.pauseAvailable = attrs.pauseAvailable !== "false";
            config.stopAvailable = attrs.stopAvailable !== "false";
            config.progressAvailable = attrs.progressAvailable !== "false";
            config.seekAvailable = attrs.seekAvailable !== "false";
            config.volumeAvailable = attrs.volumeAvailable !== "false";
            config.sources = [ {
                src: $sce.trustAsResourceUrl(attrs.uri) + "",
                type: "video/mp4"
            } ];
            config.loop = attrs.autoLoop === "true";
            config.preload = "auto";
            config.transclude = false;
            config.controls = undefined;
            config.theme = {
                url: attrs.themeuri
            };
            config.plugins = {
                poster: {
                    url: attrs.posteruri
                }
            };
            scope.config = config;
        }
    };
} ]);

angular.module("qti.plugins").directive("mataudio", [ "$sce", function($sce) {
    return {
        restrict: "E",
        scope: true,
        templateUrl: "templates/mataudio.html",
        link: function(scope, el, attrs) {
            scope.currentTime = 0;
            scope.totalTime = 0;
            scope.state = null;
            scope.volume = 1;
            scope.isCompleted = false;
            scope.API = null;
            scope.onPlayerReady = function(API) {
                scope.API = API;
            };
            scope.onCompleteVideo = function() {
                scope.isCompleted = true;
            };
            scope.onUpdateState = function(state) {
                scope.state = state;
            };
            scope.onUpdateTime = function(currentTime, totalTime) {
                scope.currentTime = currentTime;
                scope.totalTime = totalTime;
            };
            scope.onUpdateVolume = function(newVol) {
                scope.volume = newVol;
            };
            scope.onUpdateSize = function(width, height) {
                scope.config.width = width;
                scope.config.height = height;
            };
            var config = {};
            config.autoHide = false;
            config.autoHideTime = 3e3;
            config.autoPlay = attrs.autoPlay === "true";
            config.playAvailable = attrs.playAvailable !== "false";
            config.pauseAvailable = attrs.pauseAvailable !== "false";
            config.stopAvailable = attrs.stopAvailable !== "false";
            config.progressAvailable = attrs.progressAvailable !== "false";
            config.seekAvailable = attrs.seekAvailable !== "false";
            config.volumeAvailable = attrs.volumeAvailable !== "false";
            config.sources = [ {
                src: $sce.trustAsResourceUrl(attrs.uri) + "",
                type: "video/mp4"
            } ];
            config.loop = attrs.autoLoop === "true";
            config.preload = "auto";
            config.transclude = false;
            config.controls = undefined;
            config.theme = {
                url: attrs.themeuri
            };
            config.plugins = {
                poster: {
                    url: attrs.posteruri
                }
            };
            scope.config = config;
        }
    };
} ]);

"use strict";

angular.module("qti.plugins").directive("vgBuffering", [ "VG_UTILS", function(VG_UTILS) {
    return {
        restrict: "E",
        require: "^videogular",
        template: "<div class='bufferingContainer'>" + "<div ng-class='spinnerClass' class='loadingSpinner'></div>" + "</div>",
        link: function(scope, elem, attr, API) {
            function showSpinner() {
                scope.spinnerClass = {
                    stop: API.isBuffering
                };
                elem.css("display", "block");
            }
            function hideSpinner() {
                scope.spinnerClass = {
                    stop: API.isBuffering
                };
                elem.css("display", "none");
            }
            function setState(isBuffering) {
                if (isBuffering) {
                    showSpinner();
                } else {
                    hideSpinner();
                }
            }
            function onPlayerReady(isReady) {
                if (isReady) {
                    hideSpinner();
                }
            }
            showSpinner();
            if (VG_UTILS.isMobileDevice()) {
                hideSpinner();
            } else {
                scope.$watch(function() {
                    return API.isReady;
                }, function(newVal, oldVal) {
                    if (newVal != oldVal) {
                        onPlayerReady(newVal);
                    }
                });
            }
            scope.$watch(function() {
                return API.isBuffering;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    setState(newVal);
                }
            });
        }
    };
} ]);

"use strict";

angular.module("qti.plugins").directive("vgControls", [ "$timeout", "VG_STATES", function($timeout, VG_STATES) {
    return {
        restrict: "E",
        require: "^videogular",
        transclude: true,
        template: '<div id="controls-container" ng-mousemove="onMouseMove()" ng-class="animationClass" ng-transclude></div>',
        scope: {
            autoHide: "=vgAutohide",
            autoHideTime: "=vgAutohideTime"
        },
        link: function(scope, elem, attr, API) {
            var w = 0;
            var h = 0;
            var autoHideTime = 2e3;
            var hideInterval;
            scope.onMouseMove = function onMouseMove() {
                if (scope.autoHide) showControls();
            };
            function hideControls() {
                scope.animationClass = "hide-animation";
            }
            function showControls() {
                scope.animationClass = "show-animation";
                $timeout.cancel(hideInterval);
                if (scope.autoHide) hideInterval = $timeout(hideControls, autoHideTime);
            }
            if (scope.autoHide != undefined) {
                scope.$watch("autoHide", function(value) {
                    if (value) {
                        scope.animationClass = "hide-animation";
                    } else {
                        scope.animationClass = "";
                        $timeout.cancel(hideInterval);
                        showControls();
                    }
                });
            }
            if (scope.autoHideTime != undefined) {
                scope.$watch("autoHideTime", function(value) {
                    autoHideTime = value;
                });
            }
        }
    };
} ]).directive("vgPlayPauseButton", [ "VG_STATES", function(VG_STATES) {
    return {
        restrict: "E",
        require: "^videogular",
        template: "<button class='iconButton' ng-click='onClickPlayPause()' ng-class='playPauseIcon' aria-label='Play/Pause'></button>",
        link: function(scope, elem, attr, API) {
            function setState(newState) {
                switch (newState) {
                  case VG_STATES.PLAY:
                    scope.playPauseIcon = {
                        pause: true
                    };
                    break;

                  case VG_STATES.PAUSE:
                    scope.playPauseIcon = {
                        play: true
                    };
                    break;

                  case VG_STATES.STOP:
                    scope.playPauseIcon = {
                        play: true
                    };
                    break;
                }
            }
            scope.onClickPlayPause = function onClickPlayPause() {
                API.playPause();
            };
            scope.playPauseIcon = {
                play: true
            };
            scope.$watch(function() {
                return API.currentState;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    setState(newVal);
                }
            });
        }
    };
} ]).directive("vgTimedisplay", [ function() {
    return {
        require: "^videogular",
        restrict: "E",
        link: function(scope, elem, attr, API) {
            scope.$watch(function() {
                return API.currentTime;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    scope.currentTime = newVal;
                }
            });
            scope.$watch(function() {
                return API.timeLeft;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    scope.timeLeft = newVal;
                }
            });
            scope.$watch(function() {
                return API.totalTime;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    scope.totalTime = newVal;
                }
            });
        }
    };
} ]).directive("vgScrubbar", [ "VG_STATES", "VG_UTILS", function(VG_STATES, VG_UTILS) {
    return {
        restrict: "AE",
        require: "^videogular",
        transclude: true,
        template: '<div role="slider" aria-valuemax="{{ariaTime(API.totalTime)}}" ' + 'aria-valuenow="{{ariaTime(API.currentTime)}}" ' + 'aria-valuemin="0" aria-label="Time scrub bar" tabindex="0" ' + 'ng-transclude ng-keydown="onScrubBarKeyDown($event)"></div>',
        link: function(scope, elem, attr, API) {
            var isSeeking = false;
            var isPlaying = false;
            var isPlayingWhenSeeking = false;
            var touchStartX = 0;
            var LEFT = 37;
            var RIGHT = 39;
            var NUM_PERCENT = 1;
            scope.API = API;
            scope.ariaTime = function(time) {
                return time === 0 ? "0" : Math.round(time.getTime() / 1e3);
            };
            function onScrubBarTouchStart($event) {
                var event = $event.originalEvent || $event;
                var touches = event.touches;
                var touchX;
                if (VG_UTILS.isiOSDevice()) {
                    touchStartX = (touches[0].clientX - event.layerX) * -1;
                } else {
                    touchStartX = event.layerX;
                }
                touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;
                isSeeking = true;
                if (isPlaying) isPlayingWhenSeeking = true;
                API.pause();
                seekTime(touchX * API.mediaElement[0].duration / elem[0].scrollWidth);
                scope.$apply();
            }
            function onScrubBarTouchMove($event) {
                var event = $event.originalEvent || $event;
                if (isPlayingWhenSeeking) {
                    isPlayingWhenSeeking = false;
                    API.play();
                }
                isSeeking = false;
                scope.$apply();
            }
            function onScrubBarTouchMove($event) {
                var event = $event.originalEvent || $event;
                var touches = event.touches;
                var touchX;
                if (isSeeking) {
                    touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;
                    seekTime(touchX * API.mediaElement[0].duration / elem[0].scrollWidth);
                }
                scope.$apply();
            }
            function onScrubBarTouchLeave(event) {
                isSeeking = false;
                scope.$apply();
            }
            function onScrubBarMouseDown(event) {
                event = VG_UTILS.fixEventOffset(event);
                if (scope.config.seekAvailable) {
                    isSeeking = true;
                    if (isPlaying) isPlayingWhenSeeking = true;
                    API.pause();
                    seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);
                    scope.$apply();
                }
            }
            function onScrubBarMouseUp(event) {
                event = VG_UTILS.fixEventOffset(event);
                if (scope.config.seekAvailable) {
                    if (isPlayingWhenSeeking) {
                        isPlayingWhenSeeking = false;
                        API.play();
                    }
                    isSeeking = false;
                    seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);
                    scope.$apply();
                }
            }
            function onScrubBarMouseMove(event) {
                if (isSeeking) {
                    event = VG_UTILS.fixEventOffset(event);
                    seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);
                }
                scope.$apply();
            }
            function onScrubBarMouseLeave(event) {
                isSeeking = false;
                scope.$apply();
            }
            scope.onScrubBarKeyDown = function(event) {
                var currentPercent = API.currentTime.getTime() / API.totalTime.getTime() * 100;
                if (event.which === LEFT || event.keyCode === LEFT) {
                    API.seekTime(currentPercent - NUM_PERCENT, true);
                    event.preventDefault();
                } else if (event.which === RIGHT || event.keyCode === RIGHT) {
                    API.seekTime(currentPercent + NUM_PERCENT, true);
                    event.preventDefault();
                }
            };
            function seekTime(time) {
                if (scope.config.seekAvailable) {
                    API.seekTime(time, false);
                }
            }
            function setState(newState) {
                if (!isSeeking) {
                    switch (newState) {
                      case VG_STATES.PLAY:
                        isPlaying = true;
                        break;

                      case VG_STATES.PAUSE:
                        isPlaying = false;
                        break;

                      case VG_STATES.STOP:
                        isPlaying = false;
                        break;
                    }
                }
            }
            scope.$watch(function() {
                return API.currentState;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    setState(newVal);
                }
            });
            if (VG_UTILS.isMobileDevice()) {
                elem.bind("touchstart", onScrubBarTouchStart);
                elem.bind("touchend", onScrubBarTouchEnd);
                elem.bind("touchmove", onScrubBarTouchMove);
                elem.bind("touchleave", onScrubBarTouchLeave);
            } else {
                elem.bind("mousedown", onScrubBarMouseDown);
                elem.bind("mouseup", onScrubBarMouseUp);
                elem.bind("mousemove", onScrubBarMouseMove);
                elem.bind("mouseleave", onScrubBarMouseLeave);
            }
        }
    };
} ]).directive("vgScrubbarcurrenttime", [ function() {
    return {
        restrict: "E",
        require: "^videogular",
        link: function(scope, elem, attr, API) {
            var percentTime = 0;
            function onUpdateTime(newCurrentTime) {
                if (newCurrentTime && API.totalTime) {
                    percentTime = newCurrentTime.getTime() * -1 / 1e3 * 100 / (API.totalTime.getTime() * -1 / 1e3);
                    elem.css("width", percentTime + "%");
                }
            }
            function onComplete() {
                percentTime = 0;
                elem.css("width", percentTime + "%");
            }
            scope.$watch(function() {
                return API.currentTime;
            }, function(newVal, oldVal) {
                onUpdateTime(newVal);
            });
            scope.$watch(function() {
                return API.isCompleted;
            }, function(newVal, oldVal) {
                onComplete(newVal);
            });
        }
    };
} ]).directive("vgVolume", [ "VG_UTILS", function(VG_UTILS) {
    return {
        restrict: "E",
        link: function(scope, elem, attr) {
            function onMouseOverVolume() {
                scope.volumeVisibility = "visible";
                scope.$apply();
            }
            function onMouseLeaveVolume() {
                scope.volumeVisibility = "hidden";
                scope.$apply();
            }
            if (VG_UTILS.isMobileDevice()) {
                elem.css("display", "none");
            } else {
                scope.volumeVisibility = "hidden";
                elem.bind("mouseover", onMouseOverVolume);
                elem.bind("mouseleave", onMouseLeaveVolume);
            }
        }
    };
} ]).directive("vgVolumebar", [ "VG_UTILS", function(VG_UTILS) {
    return {
        restrict: "E",
        require: "^videogular",
        template: "<div class='verticalVolumeBar'>" + "<div class='volumeBackground' ng-click='onClickVolume($event)' ng-mousedown='onMouseDownVolume()' ng-mouseup='onMouseUpVolume()' ng-mousemove='onMouseMoveVolume($event)' ng-mouseleave='onMouseLeaveVolume()'>" + "<div class='volumeValue'></div>" + "<div class='volumeClickArea'></div>" + "</div>" + "</div>",
        link: function(scope, elem, attr, API) {
            var isChangingVolume = false;
            var volumeBackElem = angular.element(elem[0].getElementsByClassName("volumeBackground"));
            var volumeValueElem = angular.element(elem[0].getElementsByClassName("volumeValue"));
            scope.onClickVolume = function onClickVolume(event) {
                event = VG_UTILS.fixEventOffset(event);
                var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
                var value = event.offsetY * 100 / volumeHeight;
                var volValue = 1 - value / 100;
                API.setVolume(volValue);
            };
            scope.onMouseDownVolume = function onMouseDownVolume() {
                isChangingVolume = true;
            };
            scope.onMouseUpVolume = function onMouseUpVolume() {
                isChangingVolume = false;
            };
            scope.onMouseLeaveVolume = function onMouseLeaveVolume() {
                isChangingVolume = false;
            };
            scope.onMouseMoveVolume = function onMouseMoveVolume(event) {
                if (isChangingVolume) {
                    event = VG_UTILS.fixEventOffset(event);
                    var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
                    var value = event.offsetY * 100 / volumeHeight;
                    var volValue = 1 - value / 100;
                    API.setVolume(volValue);
                }
            };
            function updateVolumeView(value) {
                value = value * 100;
                volumeValueElem.css("height", value + "%");
                volumeValueElem.css("top", 100 - value + "%");
            }
            function onChangeVisibility(value) {
                elem.css("visibility", value);
            }
            elem.css("visibility", scope.volumeVisibility);
            scope.$watch("volumeVisibility", onChangeVisibility);
            scope.$watch(function() {
                return API.volume;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    updateVolumeView(newVal);
                }
            });
        }
    };
} ]).directive("vgMutebutton", [ function() {
    return {
        restrict: "E",
        require: "^videogular",
        template: "<button class='iconButton' ng-class='muteIcon'" + " ng-click='onClickMute()' ng-focus='onMuteButtonFocus()' ng-blur='onMuteButtonLoseFocus()' ng-keydown='onMuteButtonKeyDown($event)'" + " aria-label='Mute'></button>",
        link: function(scope, elem, attr, API) {
            var isMuted = false;
            var UP = 38;
            var DOWN = 40;
            var CHANGE_PER_PRESS = .05;
            scope.onClickMute = function onClickMute() {
                if (isMuted) {
                    scope.currentVolume = scope.defaultVolume;
                } else {
                    scope.currentVolume = 0;
                    scope.muteIcon = {
                        mute: true
                    };
                }
                isMuted = !isMuted;
                API.setVolume(scope.currentVolume);
            };
            scope.onMuteButtonFocus = function() {
                scope.volumeVisibility = "visible";
            };
            scope.onMuteButtonLoseFocus = function() {
                scope.volumeVisibility = "hidden";
            };
            scope.onMuteButtonKeyDown = function(event) {
                var currentVolume = API.volume != null ? API.volume : 1;
                if (event.which === UP || event.keyCode === UP) {
                    API.setVolume(currentVolume + CHANGE_PER_PRESS);
                    event.preventDefault();
                } else if (event.which === DOWN || event.keyCode === DOWN) {
                    API.setVolume(currentVolume - CHANGE_PER_PRESS);
                    event.preventDefault();
                }
            };
            function onSetVolume(newVolume) {
                scope.currentVolume = newVolume;
                if (!isMuted) {
                    scope.defaultVolume = newVolume;
                } else {
                    if (newVolume > 0) {
                        scope.defaultVolume = newVolume;
                    }
                }
                var percentValue = Math.round(newVolume * 100);
                if (percentValue == 0) {
                    scope.muteIcon = {
                        mute: true
                    };
                } else if (percentValue > 0 && percentValue < 25) {
                    scope.muteIcon = {
                        level0: true
                    };
                } else if (percentValue >= 25 && percentValue < 50) {
                    scope.muteIcon = {
                        level1: true
                    };
                } else if (percentValue >= 50 && percentValue < 75) {
                    scope.muteIcon = {
                        level2: true
                    };
                } else if (percentValue >= 75) {
                    scope.muteIcon = {
                        level3: true
                    };
                }
            }
            scope.defaultVolume = 1;
            scope.currentVolume = scope.defaultVolume;
            scope.muteIcon = {
                level3: true
            };
            scope.$watch(function() {
                return API.volume;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    onSetVolume(newVal);
                }
            });
        }
    };
} ]).directive("vgFullscreenbutton", [ function() {
    return {
        restrict: "AE",
        require: "^videogular",
        scope: {
            vgEnterFullScreenIcon: "=",
            vgExitFullScreenIcon: "="
        },
        template: "<button class='iconButton' ng-click='onClickFullScreen()' ng-class='fullscreenIcon' aria-label='Toggle full screen'></button>",
        link: function(scope, elem, attr, API) {
            function onChangeFullScreen(isFullScreen) {
                var result = scope.fullscreenIcon = {
                    enter: !isFullScreen,
                    exit: isFullScreen
                };
            }
            scope.onClickFullScreen = function onClickFullScreen() {
                API.toggleFullScreen();
            };
            scope.fullscreenIcon = {
                exit: false
            };
            scope.fullscreenIcon = {
                enter: true
            };
            scope.$watch(function() {
                return API.isFullScreen;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    onChangeFullScreen(newVal);
                }
            });
        }
    };
} ]);

"use strict";

angular.module("qti.plugins").directive("vgImaAds", [ "$window", "VG_STATES", function($window, VG_STATES) {
    return {
        restrict: "E",
        require: "^videogular",
        scope: {
            vgNetwork: "=",
            vgUnitPath: "=",
            vgCompanion: "=",
            vgCompanionSize: "=",
            vgAdTagUrl: "=",
            vgSkipButton: "="
        },
        link: function(scope, elem, attr, API) {
            var adDisplayContainer = new google.ima.AdDisplayContainer(elem[0]);
            var adsLoader = new google.ima.AdsLoader(adDisplayContainer);
            var adsManager = null;
            var adsLoaded = false;
            var w;
            var h;
            var onContentEnded = function() {
                adsLoader.contentComplete();
            };
            var currentAd = 0;
            var skipButton = angular.element(scope.vgSkipButton);
            function onPlayerReady(isReady) {
                if (isReady) {
                    API.mediaElement[0].addEventListener("ended", onContentEnded);
                    w = API.videogularElement[0].offsetWidth;
                    h = API.videogularElement[0].offsetHeight;
                    adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, false, this);
                    adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false, this);
                    if (scope.vgCompanion) {
                        googletag.cmd.push(function() {
                            googletag.defineSlot("/" + scope.vgNetwork + "/" + scope.vgUnitPath, scope.vgCompanionSize, scope.vgCompanion).addService(googletag.companionAds()).addService(googletag.pubads());
                            googletag.companionAds().setRefreshUnfilledSlots(true);
                            googletag.pubads().enableVideoAds();
                            googletag.enableServices();
                        });
                    }
                }
            }
            function onUpdateState(newState) {
                switch (newState) {
                  case VG_STATES.PLAY:
                    if (!adsLoaded) {
                        API.pause();
                        adDisplayContainer.initialize();
                        requestAds(scope.vgAdTagUrl);
                        adsLoaded = true;
                    }
                    break;

                  case VG_STATES.STOP:
                    adsLoader.contentComplete();
                    break;
                }
            }
            function requestAds(adTagUrl) {
                show();
                var adsRequest = new google.ima.AdsRequest();
                var computedStyle = $window.getComputedStyle(elem[0]);
                adsRequest.adTagUrl = adTagUrl;
                adsRequest.linearAdSlotWidth = parseInt(computedStyle.width, 10);
                adsRequest.linearAdSlotHeight = parseInt(computedStyle.height, 10);
                adsRequest.nonLinearAdSlotWidth = parseInt(computedStyle.width, 10);
                adsRequest.nonLinearAdSlotHeight = parseInt(computedStyle.height, 10);
                adsLoader.requestAds(adsRequest);
            }
            function onAdsManagerLoaded(adsManagerLoadedEvent) {
                show();
                adsManager = adsManagerLoadedEvent.getAdsManager(API.mediaElement[0]);
                processAdsManager(adsManager);
            }
            function processAdsManager(adsManager) {
                adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, onContentPauseRequested, false, this);
                adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, onContentResumeRequested, false, this);
                adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED, onSkippableStateChanged, false, this);
                adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, onAllAdsComplete, false, this);
                adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdComplete, false, this);
                adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false, this);
                adsManager.init(w, h, google.ima.ViewMode.NORMAL);
                adsManager.start();
            }
            function onSkippableStateChanged() {
                var isSkippable = adsManager.getAdSkippableState();
                if (isSkippable) {
                    skipButton.css("display", "block");
                } else {
                    skipButton.css("display", "none");
                }
            }
            function onClickSkip() {
                adsManager.skip();
            }
            function onContentPauseRequested() {
                show();
                API.mediaElement[0].removeEventListener("ended", onContentEnded);
                API.pause();
            }
            function onContentResumeRequested() {
                API.mediaElement[0].addEventListener("ended", onContentEnded);
                API.play();
                hide();
            }
            function onAdError() {
                if (adsManager) adsManager.destroy();
                hide();
                API.play();
            }
            function onAllAdsComplete() {
                hide();
            }
            function onAdComplete() {
                currentAd++;
            }
            function show() {
                elem.css("display", "block");
            }
            function hide() {
                elem.css("display", "none");
            }
            skipButton.bind("click", onClickSkip);
            elem.prepend(skipButton);
            angular.element($window).bind("resize", function() {
                w = API.videogularElement[0].offsetWidth;
                h = API.videogularElement[0].offsetHeight;
                if (adsManager) {
                    if (API.isFullScreen) {
                        adsManager.resize(w, h, google.ima.ViewMode.FULLSCREEN);
                    } else {
                        adsManager.resize(w, h, google.ima.ViewMode.NORMAL);
                    }
                }
            });
            scope.$watch(function() {
                return API.isReady;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    onPlayerReady(newVal);
                }
            });
            scope.$watch(function() {
                return API.currentState;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    onUpdateState(newVal);
                }
            });
        }
    };
} ]);

"use strict";

angular.module("qti.plugins").directive("vgOverlayPlay", [ "VG_STATES", function(VG_STATES) {
    return {
        restrict: "E",
        require: "^videogular",
        template: "<div class='overlayPlayContainer' ng-click='onClickOverlayPlay()'>" + "<div class='iconButton' ng-class='overlayPlayIcon'></div>" + "</div>",
        link: function(scope, elem, attr, API) {
            function onComplete(target, params) {
                scope.overlayPlayIcon = {
                    play: true
                };
            }
            function onPlay(target, params) {
                scope.overlayPlayIcon = {};
            }
            function onChangeState(newState) {
                console.log("newstate", newState);
                switch (newState) {
                  case VG_STATES.PLAY:
                    scope.overlayPlayIcon = {};
                    break;

                  case VG_STATES.PAUSE:
                    scope.overlayPlayIcon = {
                        play: true
                    };
                    break;

                  case VG_STATES.STOP:
                    scope.overlayPlayIcon = {
                        play: true
                    };
                    break;
                }
            }
            scope.onClickOverlayPlay = function onClickOverlayPlay(event) {
                if (API.currentState === "play" && scope.config.pauseAvailable) {
                    API.pause();
                } else if (scope.config.playAvailable) {
                    API.play();
                }
            };
            scope.overlayPlayIcon = {
                play: true
            };
            scope.$watch(function() {
                return API.currentState;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    onChangeState(newVal);
                }
            });
        }
    };
} ]);

"use strict";

angular.module("qti.plugins").directive("vgPosterImage", [ "VG_STATES", function(VG_STATES) {
    return {
        restrict: "E",
        require: "^videogular",
        scope: {
            vgUrl: "="
        },
        template: '<img ng-src="{{vgUrl}}">',
        link: function(scope, elem, attr, API) {
            function onUpdateState(newState) {
                switch (newState) {
                  case VG_STATES.PLAY:
                    elem.css("display", "none");
                    break;

                  case VG_STATES.STOP:
                    elem.css("display", "block");
                    break;
                }
            }
            scope.$watch(function() {
                return API.currentState;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    onUpdateState(newVal);
                }
            });
        }
    };
} ]);

angular.module("qti").directive("objectives", function() {
    return {
        restrict: "E",
        link: function(scope, el, attr) {
            scope.objectives[attr.ident] = el[0].querySelector("mattext").innerHTML;
            el[0].outerHTML = null;
            scope.$on("item::ready", function() {});
        },
        controller: [ "$scope", function($scope) {
            $scope.objectives = $scope.objectives || {};
        } ]
    };
});

angular.module("qti").directive("presentation", [ "ATTR_MAP", function(ATTR_MAP) {
    return {
        restrict: "E",
        link: function(scope, el, attr) {
            var px = "px";
            var questionStem = el[0].querySelector("mattext");
            if (questionStem) {
                scope.item.question = questionStem.innerHTML;
            }
            for (var e in attr) {
                if (ATTR_MAP[e]) {
                    el.css(ATTR_MAP[e], isNaN(attr[e]) ? attr[e] : attr[e] + px);
                }
            }
            scope.$on("item::ready", function() {});
        },
        controller: [ "$scope", function($scope) {} ]
    };
} ]);

angular.module("qti").directive("renderChoice", function() {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {},
        controller: [ "$scope", function($scope) {} ]
    };
});

angular.module("qti").directive("responseLid", function() {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {},
        controller: [ "$scope", function($scope) {} ]
    };
});

angular.module("qti").run([ "$templateCache", function($templateCache) {
    "use strict";
    $templateCache.put("templates/assessment.html", '<div class=qti-assessment><div class=qti-title>{{assessment.title}}</div><div class=qti-content><div ng-transclude=""></div></div></div>');
    $templateCache.put("templates/mataudio.html", "<div class=qti-audio><videogular vg-player-ready=onPlayerReady vg-complete=onCompleteVideo vg-update-time=onUpdateTime vg-update-volume=onUpdateVolume vg-update-state=onUpdateState vg-theme=config.theme.url vg-autoplay=config.autoPlay><vg-audio vg-src=config.sources vg-tracks=config.tracks vg-loop=config.loop vg-preload=config.preload vg-native-controls=config.controls></vg-audio><vg-controls vg-autohide=config.autoHide vg-autohide-time=config.autoHideTime><vg-play-pause-button ng-if=\"config.playAvailable && config.pauseAvailable\"></vg-play-pause-button><vg-timedisplay ng-if=config.progressAvailable>{{ currentTime | date:'mm:ss' }}</vg-timedisplay><vg-scrubbar ng-if=config.progressAvailable><vg-scrubbarcurrenttime></vg-scrubbarcurrenttime></vg-scrubbar><div ng-if=!config.progressAvailable style=\"width: 100%;display: table-cell;cursor: default\"></div><vg-timedisplay ng-if=config.progressAvailable>{{ timeLeft | date:'mm:ss' }}</vg-timedisplay><vg-volume ng-if=config.volumeAvailable><vg-mutebutton></vg-mutebutton><vg-volumebar></vg-volumebar></vg-volume><vg-fullscreenbutton ng-if=config.fullscreenAvailable></vg-fullscreenbutton></vg-controls></videogular></div>");
    $templateCache.put("templates/matvideo.html", "<div class=qti-video><videogular vg-player-ready=onPlayerReady vg-complete=onCompleteVideo vg-update-time=onUpdateTime vg-update-volume=onUpdateVolume vg-update-state=onUpdateState vg-theme=config.theme.url vg-autoplay=config.autoPlay><vg-video vg-src=config.sources vg-tracks=config.tracks vg-loop=config.loop vg-preload=config.preload vg-native-controls=config.controls></vg-video><vg-controls vg-autohide=config.autoHide vg-autohide-time=config.autoHideTime><vg-play-pause-button ng-if=\"config.playAvailable && config.pauseAvailable\"></vg-play-pause-button><vg-timedisplay ng-if=config.progressAvailable>{{ currentTime | date:'mm:ss' }}</vg-timedisplay><vg-scrubbar ng-if=config.progressAvailable><vg-scrubbarcurrenttime></vg-scrubbarcurrenttime></vg-scrubbar><div ng-if=!config.progressAvailable style=\"width: 100%;display: table-cell;cursor: default\"></div><vg-timedisplay ng-if=config.progressAvailable>{{ timeLeft | date:'mm:ss' }}</vg-timedisplay><vg-volume ng-if=config.volumeAvailable><vg-mutebutton></vg-mutebutton><vg-volumebar></vg-volumebar></vg-volume><vg-fullscreenbutton ng-if=config.fullscreenAvailable></vg-fullscreenbutton></vg-controls><vg-poster-image vg-url=config.plugins.poster.url></vg-poster-image><vg-buffering></vg-buffering><vg-overlay-play vg-play-icon=config.theme.playIcon></vg-overlay-play></videogular></div>");
    $templateCache.put("templates/presentation.html", '<div><div ng-transclude=""></div></div>');
} ]);