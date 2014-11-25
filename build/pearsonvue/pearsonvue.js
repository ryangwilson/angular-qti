angular.module("qti.plugins").service("expression", function() {
    if (window.hasOwnProperty("MathJax")) {
        MathJax.Hub.Config({
            "HTML-CSS": {
                preferredFont: "STIX"
            }
        });
        setTimeout(function() {
            MathJax.Hub.Configured();
        }, 1e3);
    }
}).run([ "expression", function(expression) {} ]);

angular.module("qti").directive("item", [ "$sce", function($sce) {
    return {
        restrict: "E",
        require: [ "?item" ],
        link: function(scope, el, attr) {
            var _el = el[0];
            if (_el.querySelector("pearsonvue_referencematerial")) {
                if (_el.querySelector("pearsonvue_splitpresentation")) {
                    console.log("yup there is a splitter");
                }
                var itemrefs = _el.querySelectorAll("pearsonvue_itemreference");
                if (itemrefs.length) {
                    console.log("item refs", itemrefs.length);
                }
            }
        }
    };
} ]);

angular.module("qti.plugins").directive("pearsonvueMatExtension", [ "$compile", "helpers", function($compile, helpers) {
    "use strict";
    var css = function(el, prop, value) {
        var styles = el.getAttribute("style") || "";
        styles += ";" + prop + ":" + value;
        el.setAttribute("style", styles);
    };
    var strToValue = function(type, value) {
        switch (type) {
          case "numeric":
            return Number((value + "").replace(/(\D+)/gim, ""));

          case "dictionary-case-insensitive":
            return value;

          case "asciibetical":
            return value;
        }
        return strToAscii(value + "");
    };
    var strToAscii = function(str) {
        var ascii = "";
        for (var i = 0; i < str.length; i++) {
            var asciiChar = str.charCodeAt(i);
            ascii += "&#" + asciiChar + ";";
        }
        return ascii;
    };
    var isNumber = function(n) {
        return n === parseFloat(n, 10);
    };
    return {
        restrict: "E",
        link: function(scope, el, attr) {
            var str, table, tableBorderWidth, i, colgroups, tbody, tds, tr, th, td, node, tableCells, col, row, linkFn, content, borderColor;
            scope.head = {};
            scope.body = [];
            scope.sort = {};
            scope.selectedCls = function(column) {
                if (column === scope.sort.column) {
                    if (scope.sort.reverse) {
                        return "table-icon-chevron-down";
                    } else {
                        return "table-icon-chevron-up";
                    }
                }
            };
            scope.changeSorting = function(column, rule) {
                if (rule) {
                    var sort = scope.sort;
                    if (sort.column === column) {
                        sort.reverse = !sort.reverse;
                    } else {
                        sort.column = column;
                        sort.reverse = false;
                    }
                }
            };
            scope.isEven = function(n) {
                return isNumber(n) && n % 2 === 0;
            };
            scope.isOdd = function(n) {
                return isNumber(n) && Math.abs(n) % 2 === 1;
            };
            str = el[0].innerHTML;
            var nthChild = str.match(/<nth-child(.|\n)*?nth-child>/gim);
            if (nthChild) {
                nthChild = helpers.strToXML(nthChild[0]).firstChild;
            }
            str = str.replace(/<nth-child(.|\n)*?nth-child>/gim, "");
            table = helpers.strToXML(str).firstChild;
            if (table.hasAttribute("border")) {
                tableBorderWidth = table.getAttribute("border") || "1";
            }
            borderColor = table.querySelector("thead tr").getAttribute("bgcolor") || "red";
            if (tableBorderWidth) {
                css(table, "border-width", tableBorderWidth + "px");
                table.removeAttribute("border");
                table.setAttribute("data-border", tableBorderWidth);
            }
            if (table.hasAttribute("cellspacing")) {
                var cellSpacing = (table.getAttribute("cellspacing") || 0) + "px";
                css(table, "border-spacing", cellSpacing);
            }
            if (table.hasAttribute("bgcolor")) {
                var bgColor = table.getAttribute("bgcolor");
                css(table, "background-color", bgColor);
            }
            css(table, "border-color", borderColor);
            colgroups = table.querySelectorAll("colgroup");
            th = table.querySelectorAll("th");
            td = table.querySelectorAll("td");
            tableCells = [];
            for (i = 0; i < td.length; i++) {
                tableCells.push(td[i].textContent);
                col = i % th.length;
                if (col === 0) {
                    row = {};
                    scope.body.push(row);
                }
                row["col_" + col] = {
                    width: colgroups[col].getAttribute("width"),
                    label: td[i].textContent,
                    value: strToValue(colgroups[col].getAttribute("sort_rule"), td[i].textContent),
                    rule: colgroups[col].getAttribute("sort_rule")
                };
            }
            var cellPadding = (table.getAttribute("cellpadding") || 0) + "px";
            for (i = 0; i < th.length; i++) {
                css(th[i], "padding", cellPadding);
                var rule = colgroups[i].getAttribute("sort_rule") || "";
                if (rule) {
                    th[i].setAttribute("ng-click", "changeSorting('col_" + i + ".value', '" + rule + "')");
                    th[i].insertAdjacentHTML("afterBegin", '<span class="sort-indicator" ng-class="selectedCls(\'col_' + i + ".value')\"></span>");
                }
            }
            tbody = table.querySelector("tbody");
            tr = table.querySelector("tbody tr");
            tr.setAttribute("ng-repeat", "row in body | orderBy:sort.column:sort.reverse");
            if (nthChild) {
                var count = nthChild.getAttribute("count");
                var rowColor = nthChild.getAttribute("bgcolor");
                switch (count) {
                  case "odd":
                    tr.setAttribute("ng-style", "{ background: (isOdd($index) && '" + rowColor + "' || 'none') }");
                    break;

                  case "even":
                    tr.setAttribute("ng-style", "{ background: (isEven($index) && '" + rowColor + "' || 'none') }");
                    break;

                  default:
                    tr.setAttribute("ng-style", "{ background: ($index == " + (count - 1) + " && '" + rowColor + "' || 'none') }");
                }
                console.log("nthChild", nthChild.getAttribute("count"));
            }
            tds = table.querySelectorAll("tbody > tr > td");
            for (i = 0; i < th.length; i += 1) {
                css(tds[i], "padding", cellPadding);
                node = tds[i];
                while (node.firstChild) {
                    node = node.firstChild;
                }
                node.nodeValue = "{{row.col_" + i + ".label}}";
            }
            tbody.innerHTML = tr.outerHTML;
            linkFn = $compile(table.outerHTML);
            content = linkFn(scope);
            el.empty();
            el.append(content);
        }
    };
} ]);

angular.module("qti.plugins").directive("pearsonvueObjectivesref", function() {
    return {
        restrict: "E",
        link: function(scope, el, attr) {}
    };
});

angular.module("qti").directive("matimageAddon", function() {
    return {
        scope: true,
        link: function($scope, $el, $attr) {
            var measureWidth = 0;
            var measureHeight = 0;
            var unitWidth = "px";
            var unitHeight = "px";
            var loaded = false;
            var updateImageSize = function() {
                if (loaded && $scope.currentScaleFactor) {
                    $el.css("width", measureWidth * $scope.currentScaleFactor.factor + unitWidth);
                    $el.css("height", measureHeight * $scope.currentScaleFactor.factor + unitHeight);
                }
            };
            $scope.$on("scalefactor::changed", function(evt) {
                updateImageSize();
            });
            $el.bind("load", function(evt) {
                loaded = true;
                var style = window.getComputedStyle($el[0]);
                measureWidth = style.width.replace(/\D+/i, "");
                unitWidth = style.width.replace(/\d+/i, "");
                measureHeight = style.height.replace(/\D+/i, "");
                unitHeight = style.height.replace(/\d+/i, "");
                updateImageSize();
            });
        }
    };
});

angular.module("qti").directive("mattext", function() {
    return {
        scope: true,
        link: function($scope, $el, $attr) {
            var el = $el[0];
            var style = window.getComputedStyle(el);
            var defaultFontSize = style.fontSize;
            var measure = defaultFontSize.replace(/\D+/i, "");
            var unit = defaultFontSize.replace(/\d+/i, "");
            var scaleFactor = 1;
            var updateFontSize = function() {
                $el.css("fontSize", measure * scaleFactor + unit);
            };
            $scope.$on("scalefactor::changed", function(evt, factor) {
                scaleFactor = factor;
                updateFontSize();
            });
        }
    };
});

angular.module("qti.plugins").directive("pearsonvueScalefactors", [ "$compile", function($compile) {
    return function($scope, $el, $attr) {
        var scaleFactorsEl = $el[0].querySelectorAll("*");
        var scaleFactorEl, scaleFactor;
        var scaleFactors = [];
        var percent = "%";
        for (var i = 0; i < scaleFactorsEl.length; i += 1) {
            scaleFactorEl = scaleFactorsEl[i];
            scaleFactor = {
                isDefault: !!scaleFactorEl.getAttribute("default"),
                factor: Number(scaleFactorEl.getAttribute("factor"))
            };
            scaleFactors.push(scaleFactor);
            if (scaleFactor.isDefault) {
                $scope.currentScaleFactor = scaleFactor;
            }
        }
        $scope.zoomIn = function() {
            var index = scaleFactors.indexOf($scope.currentScaleFactor);
            if (index + 1 < scaleFactors.length) {
                index += 1;
            }
            $scope.currentScaleFactor = scaleFactors[index];
            $scope.$broadcast("scalefactor::changed", $scope.currentScaleFactor.factor);
        };
        $scope.zoomOut = function() {
            var index = scaleFactors.indexOf($scope.currentScaleFactor);
            if (index - 1 >= 0) {
                index -= 1;
            }
            $scope.currentScaleFactor = scaleFactors[index];
            $scope.$broadcast("scalefactor::changed", $scope.currentScaleFactor.factor);
        };
        var zoomInEl = '<a class="btn-zoom-in" href="" ng-click="zoomIn()"></a>';
        var zoomOutEl = '<a class="btn-zoom-out" href="" ng-click="zoomOut()"><a>';
        var el = angular.element('<div style="font-size: 14px;padding: 10px">' + zoomInEl + zoomOutEl + "</div>");
        var compiled = $compile(el);
        $el.append(el);
        compiled($scope);
        $el[0].parentNode.style["font-size"] = 100 * $scope.currentScaleFactor.factor + percent;
    };
} ]);