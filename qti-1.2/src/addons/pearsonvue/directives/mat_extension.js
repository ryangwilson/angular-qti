angular.module('qti').directive('pearsonvueMatExtension', function ($compile, helpers) {

    var strToValue = function (type, value) {
        switch (type) {
            case 'numeric':
                return Number((value + '').replace(/(\D+)/gim, ''));
        }
        return value;
    };

    return {
        restrict: 'E',
        link: function (scope, el, attr) {

            // :: internal model :: //
            scope.head = {};
            scope.body = [];
            scope.sort = {
                column: 'col_0.value',
                reverse: false
            };

            // :: functions for handling sort :: //
            scope.selectedCls = function (column) {
                if (column === scope.sort.column) {
                    if (scope.sort.reverse) {
                        return 'fa fa-chevron-down';
                    } else {
                        return 'fa fa-chevron-up';
                    }
                }
            };

            scope.changeSorting = function (column) {
                var sort = scope.sort;
                if (sort.column === column) {
                    sort.reverse = !sort.reverse;
                } else {
                    sort.column = column;
                    sort.reverse = false;
                }
            };

            var str, xml, i, colgroups, tbody, tds, tr, th, td, node, tableCells, col, row, linkFn, content;

            str = el[0].innerHTML;

            xml = helpers.strToXML(str).firstChild;

            colgroups = xml.querySelectorAll('colgroup');

            th = xml.querySelectorAll('th');

            // setup data
            td = xml.querySelectorAll('td');
            tableCells = [];
            for (i = 0; i < td.length; i++) {
                tableCells.push(td[i].textContent);
                col = i % th.length;
                if (col === 0) {
                    row = {};
                    scope.body.push(row);
                }
                row['col_' + col] = {
                    width: colgroups[col].getAttribute('width'),
                    label: td[i].textContent,
                    value: strToValue(colgroups[col].getAttribute('sort_rule'), td[i].textContent)
                };
            }

            // setup template
            for (i = 0; i < th.length; i++) {
                th[i].setAttribute('ng-click', 'changeSorting(\'col_' + i + '.value\')');
                th[i].insertAdjacentHTML('afterBegin', '<span style="float:right" ng-class="selectedCls(\'col_' + i + '.value\')" class=""></span>');
            }

            tbody = xml.querySelector('tbody');

            tr = xml.querySelector('tbody tr');
            tr.setAttribute('ng-repeat', 'row in body | orderBy:sort.column:sort.reverse');

            tds = xml.querySelectorAll('tbody > tr > td');
            for (i = 0; i < th.length; i += 1) {
                node = tds[i];
                while (node.firstChild) {
                    node = node.firstChild;
                }
                node.nodeValue = '{{row.col_' + i + '.label}}';
            }
            tbody.innerHTML = tr.outerHTML;

            linkFn = $compile(xml.outerHTML);
            content = linkFn(scope);
            el.empty();
            el.append(content);

        }
    };
});