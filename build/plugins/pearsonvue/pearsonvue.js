angular.module("qti.plugins.pearsonvue", []);

angular.module("qti.plugins.pearsonvue").constant("PV_CONFIG", {});

angular.module("qti.plugins.pearsonvue").directive("font", function() {
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

angular.module("qti.plugins.pearsonvue").directive("pearsonvueMatExtension", [ "$compile", "helpers", function($compile, helpers) {
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
                        return "fa fa-chevron-down";
                    } else {
                        return "fa fa-chevron-up";
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

angular.module("qti.plugins.pearsonvue").directive("pearsonvueObjectivesref", function() {
    return {
        restrict: "E",
        link: function(scope, el, attr) {}
    };
});

angular.module("qti.plugins.pearsonvue").directive("pearsonvueScalefactor", function() {
    return {
        restrict: "E",
        link: function(scope, el, attr) {}
    };
});

angular.module("qti.plugins.pearsonvue").run([ "$templateCache", function($templateCache) {
    "use strict";
    $templateCache.put("templates/assessment.html", '<div class=qti-assessment><div class=qti-title>{{assessment.title}}</div><div class=qti-content><div ng-transclude=""></div></div></div>');
    $templateCache.put("templates/presentation.html", '<div><div ng-transclude=""></div></div>');
    $templateCache.put("templates/question-header.html", "<div class=qti-question-header>Question Id: {{item.questionId}}</div>");
    $templateCache.put("templates/question-options.html", '<div><div class=qti-title>Options:</div><div ng-transclude=""></div></div>');
    $templateCache.put("templates/question-stem.html", '<div style="border: 1px solid #ecf0f1"><div class=qti-title>Question Stem:</div><div class=qti-content ng-bind-html=trustHtml(item.question)></div></div>');
    $templateCache.put("templates/question-type.html", '<div><div class=qti-title>Type: {{item.type | type}}</div><div ng-transclude=""></div></div>');
    $templateCache.put("templates/radio.html", "<input type=radio>");
} ]);