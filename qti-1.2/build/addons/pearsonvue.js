/*
* qti-1.2-engine 0.1.0
*/
angular.module("qti").constant("PV_CONFIG", {});

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

angular.module("qti").directive("pearsonvueMatExtension", [ "$compile", "helpers", function($compile, helpers) {
    var css = function(el, prop, value) {
        var styles = el.getAttribute("style") || "";
        styles += ";" + prop + ":" + value;
        el.setAttribute("style", styles);
    };
    var strToValue = function(type, value) {
        switch (type) {
          case "numeric":
            return Number((value + "").replace(/(\D+)/gim, ""));
        }
        return value;
    };
    return {
        restrict: "E",
        link: function(scope, el, attr) {
            scope.head = {};
            scope.body = [];
            scope.sort = {
                column: "col_0.value",
                reverse: false
            };
            scope.selectedCls = function(column) {
                if (column === scope.sort.column) {
                    if (scope.sort.reverse) {
                        return "fa fa-chevron-down";
                    } else {
                        return "fa fa-chevron-up";
                    }
                }
            };
            scope.changeSorting = function(column) {
                var sort = scope.sort;
                if (sort.column === column) {
                    sort.reverse = !sort.reverse;
                } else {
                    sort.column = column;
                    sort.reverse = false;
                }
            };
            var str, table, i, colgroups, tbody, tds, tr, th, td, node, tableCells, col, row, linkFn, content, borderColor;
            str = el[0].innerHTML;
            table = helpers.strToXML(str).firstChild;
            borderColor = table.querySelector("thead tr").getAttribute("bgcolor") || "red";
            console.log("WHOIS", borderColor);
            if (table.hasAttribute("border")) {
                css(table, "border-width", table.getAttribute("border") + "px");
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
                    value: strToValue(colgroups[col].getAttribute("sort_rule"), td[i].textContent)
                };
            }
            var cellPadding = (table.getAttribute("cellpadding") || 0) + "px";
            for (i = 0; i < th.length; i++) {
                css(th[i], "padding", cellPadding);
                th[i].setAttribute("ng-click", "changeSorting('col_" + i + ".value')");
                th[i].insertAdjacentHTML("afterBegin", '<span class="sort-indicator" ng-class="selectedCls(\'col_' + i + ".value')\"></span>");
            }
            tbody = table.querySelector("tbody");
            tr = table.querySelector("tbody tr");
            tr.setAttribute("ng-repeat", "row in body | orderBy:sort.column:sort.reverse");
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

angular.module("qti").directive("pearsonvueObjectivesref", function() {
    return {
        restrict: "E",
        link: function(scope, el, attr) {}
    };
});

angular.module("qti").directive("pearsonvueScalefactor", function() {
    return {
        restrict: "E",
        link: function(scope, el, attr) {}
    };
});