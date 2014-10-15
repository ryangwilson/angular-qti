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
                return column === scope.sort.column && "sort-" + scope.sort.descending;
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
            var tableHeaders = [];
            for (i = 0; i < th.length; i++) {
                tableHeaders.push({
                    label: th[i].textContent,
                    name: th[i].textContent.toLowerCase().replace(/(\s+|-+)/gim, "_")
                });
                scope.head["col_" + i + ".value"] = th[i].textContent.toLowerCase().replace(/(\s+|-+)/gim, "_");
            }
            var td = xml.querySelectorAll("td");
            var tableCells = [];
            var col, row, rule;
            for (i = 0; i < td.length; i++) {
                tableCells.push(td[i].textContent);
                col = i % tableHeaders.length;
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
            var colGroupStrings = "";
            var tableCellsStrings = "";
            for (i = 0; i < colgroups.length; i += 1) {
                colGroupStrings += colgroups[i].outerHTML;
                tableCellsStrings += "<td>{{row.col_" + i + ".label}}</td>";
            }
            var tpl = "" + "<table>" + "   ##colgroups##" + "   <thead>" + "       <tr>" + '           <th ng-repeat="(i,th) in head" ng-class="selectedCls(i)" ng-click="changeSorting(i)">{{th}}</th>' + "       </tr>" + "   </thead>" + "   <tbody>" + '       <tr ng-repeat="row in body | orderBy:sort.column:sort.reverse">' + "       ##td##" + "       </tr>" + "   </tbody>" + "</table>";
            tpl = tpl.split("##colgroups##").join(colGroupStrings);
            tpl = tpl.split("##td##").join(tableCellsStrings);
            var linkFn = $compile(tpl);
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