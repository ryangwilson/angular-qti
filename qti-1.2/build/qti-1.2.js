/*
* qti-1.2-engine 0.1.0
*/
angular.module("qti", [ "ngSanitize" ]);

angular.module("qti").constant("ATTR_MAP", {
    fontsize: "font-size",
    fontface: "font-family",
    backgroundColor: "background-color",
    width: "width",
    height: "height"
});

angular.module("qti").directive("assessment", function() {
    return {
        restrict: "E",
        scope: true,
        transclude: true,
        templateUrl: "templates/assessment.html",
        link: function(scope, el, attr) {
            scope.assessment = {
                id: attr.ident,
                title: attr.title
            };
        }
    };
});

angular.module("qti").directive("qtiEngine", [ "$http", "$compile", function($http, $compile) {
    function stripCDATA(str) {
        return str.split("<![CDATA[").join("").split("]]>").join("");
    }
    function _formatWhitespace(str) {
        return str.replace(/(\w+)(.*?)>([\w\s\.\[\]\d\t]+)<\/(\1)/gim, function(match, r0, r1, r2) {
            return r0 + r1 + ">" + r2.split(" ").join("&nbsp;&#8203;") + "</" + r0;
        });
    }
    function formatWhitespace(str) {
        var matches = str.match(/<mattext([^>]?)+>((.|\n)*?)<\/mattext>/gim);
        var formattedStr;
        var match;
        if (matches) {
            for (var i = 0; i < matches.length; i += 1) {
                match = matches[i];
                formattedStr = _formatWhitespace(match);
                str = str.split(matches[i]).join(formattedStr);
            }
        }
        return str;
    }
    function replaceDyn(str) {
        return str.replace(/<dyn type="text\/groovy">(\s?)+return(\s?)+((.|\n)*?)(;?)<\/dyn>/gim, "{{ $3 }}");
    }
    function replaceShorthand(str) {
        return str.replace(/\${(\s?)+((.|\n)*?)\}/gim, "{{ system.$2 }}");
    }
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            $http.get(attr.src).then(function(response) {
                var template = response.data;
                template = stripCDATA(template);
                template = replaceDyn(template);
                template = replaceShorthand(template);
                template = formatWhitespace(template);
                var linkFn = $compile(template);
                var content = linkFn(scope);
                el.append(content);
            });
        }
    };
} ]);

angular.module("qti").directive("flowMat", [ "ATTR_MAP", function(ATTR_MAP) {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            for (var e in attr) {
                if (ATTR_MAP[e]) {
                    el.css(ATTR_MAP[e], isNaN(attr[e]) ? attr[e] : attr[e] + "px");
                }
            }
        }
    };
} ]);

angular.module("qti").directive("img", [ "$compile", function($compile) {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            if (attr.hasOwnProperty("align")) {
                el.css("vertical-align", attr.align);
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
            $scope.trustHtml = function(html) {
                return $sce.trustAsHtml(html);
            };
        } ]
    };
} ]);

angular.module("qti").directive("matimage", [ "helpers", function(helpers) {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            var str, xml;
            xml = helpers.strToXML("<img />").firstChild;
            var valign;
            switch (attr.valign) {
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
            var style = "vertical-align:" + valign + ";";
            if (attr.hasOwnProperty("width")) {
                style += "width:" + attr.width + "px;";
            }
            if (attr.hasOwnProperty("height")) {
                style += "height:" + attr.height + "px;";
            }
            if (attr.hasOwnProperty("uri")) {
                xml.setAttribute("src", attr.uri);
            } else if (attr.hasOwnProperty("embedded")) {
                str = "data:image/jpg;base64,";
                xml.setAttribute("src", str + el.text());
            }
            if (attr.hasOwnProperty("alt")) {
                xml.setAttribute("alt", attr.alt);
            }
            xml.setAttribute("style", style);
            el.html(xml.outerHTML);
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
            }
            if (attr.hasOwnProperty("height")) {
                el.css("height", attr.height + "px");
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

angular.module("qti").directive("p", [ "$compile", function($compile) {
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
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            var tabStops = parseTabStops(attr.tabStops);
            var html = el.html();
            var linkFn, content;
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
    };
} ]);

angular.module("qti").directive("presentation", [ "ATTR_MAP", function(ATTR_MAP) {
    return {
        restrict: "E",
        transclude: true,
        templateUrl: "templates/presentation.html",
        link: function(scope, el, attr) {
            var questionStem = el[0].querySelector("mattext");
            if (questionStem) {
                scope.item.question = questionStem.innerHTML;
            }
            for (var e in attr) {
                if (ATTR_MAP[e]) {
                    el.css(ATTR_MAP[e], isNaN(attr[e]) ? attr[e] : attr[e] + "px");
                }
            }
            scope.$on("item::ready", function() {});
        },
        controller: [ "$scope", function($scope) {} ]
    };
} ]);

angular.module("qti").directive("responseLid", function() {
    return {
        restrict: "E",
        scope: true,
        transclude: true,
        templateUrl: "templates/question-type.html",
        link: function(scope, el, attr) {
            scope.item.type = attr.rcardinality;
        },
        controller: [ "$scope", function($scope) {} ]
    };
});

angular.module("qti").filter("type", function() {
    return function(value) {
        switch (value) {
          case "multiple":
            return "Matching";
        }
        return "One Correct Option";
    };
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
});