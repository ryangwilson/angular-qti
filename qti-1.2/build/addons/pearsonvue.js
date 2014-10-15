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
                        return "fa fa-camera-retro";
                    } else {
                        return "fa fa-camera-retro";
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
            var str = el[0].innerHTML;
            var xml = helpers.strToXML(str).firstChild;
            var i;
            var colgroups = xml.querySelectorAll("colgroup");
            var th = xml.querySelectorAll("th");
            var td = xml.querySelectorAll("td");
            var tableCells = [];
            var col, row, rule;
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
            for (i = 0; i < th.length; i++) {
                th[i].setAttribute("ng-class", "selectedCls('col_" + i + ".value')");
                th[i].setAttribute("ng-click", "changeSorting('col_" + i + ".value')");
            }
            var tbody = xml.querySelector("tbody");
            var tr = xml.querySelector("tbody tr");
            tr.setAttribute("ng-repeat", "row in body | orderBy:sort.column:sort.reverse");
            var tds = xml.querySelectorAll("tbody > tr > td");
            for (var i = 0; i < th.length; i += 1) {
                var node = tds[i];
                var node = tds[i];
                while (node.firstChild) {
                    node = node.firstChild;
                }
                node.nodeValue = "{{row.col_" + i + ".label}}";
            }
            tbody.innerHTML = tr.outerHTML;
            var linkFn = $compile(xml.outerHTML);
            var content = linkFn(scope);
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