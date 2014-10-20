angular.module('qti').directive('pearsonvueMatExtension', function ($compile, helpers) {

    var css = function (el, prop, value) {
        var styles = el.getAttribute('style') || '';
        styles += ';' + prop + ':' + value;
        el.setAttribute('style', styles);
    };

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

            var str, table, tableBorderWidth, i, colgroups, tbody, tds, tr, th, td, node, tableCells, col, row, linkFn, content, borderColor;

            // :: internal model :: //
            scope.head = {};
            scope.body = [];
            scope.sort = {
//                column: 'col_0.value',
//                reverse: false
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

            scope.changeSorting = function (column, rule) {
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

            scope.order = function () {

            };


            // :: get the XML template ::
            str = el[0].innerHTML;
            var nthChild = str.match(/<nth-child(.|\n)*?nth-child>/gim);
            if (nthChild) {
                nthChild = helpers.strToXML(nthChild[0]).firstChild;
            }
            str = str.replace(/<nth-child(.|\n)*?nth-child>/gim, '');

            table = helpers.strToXML(str).firstChild;
            if (table.hasAttribute('border')) {
                tableBorderWidth = table.getAttribute('border') || '1';
            }
            borderColor = table.querySelector('thead tr').getAttribute('bgcolor') || 'red';

            if (tableBorderWidth) {
                css(table, 'border-width', tableBorderWidth + 'px');
                table.removeAttribute('border');
                table.setAttribute('data-border', tableBorderWidth);
            }

            if (table.hasAttribute('cellspacing')) {
                var cellSpacing = (table.getAttribute('cellspacing') || 0) + 'px';
                css(table, 'border-spacing', cellSpacing);
            }

            if (table.hasAttribute('bgcolor')) {
                var bgColor = table.getAttribute('bgcolor');
                css(table, 'background-color', bgColor);
            }

            css(table, 'border-color', borderColor);

            // :: parse XML looking for stuff ::
            colgroups = table.querySelectorAll('colgroup');

            th = table.querySelectorAll('th');
            td = table.querySelectorAll('td');
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
                    value: strToValue(colgroups[col].getAttribute('sort_rule'), td[i].textContent),
                    rule: colgroups[col].getAttribute('sort_rule')
                };

            }

            var cellPadding = (table.getAttribute('cellpadding') || 0) + 'px';

            // :: setup template ::
            for (i = 0; i < th.length; i++) {
                css(th[i], 'padding', cellPadding);
                var rule = colgroups[i].getAttribute('sort_rule') || '';
                if (rule) {
                    th[i].setAttribute('ng-click', 'changeSorting(\'col_' + i + '.value\', \'' + rule + '\')');
                    th[i].insertAdjacentHTML('afterBegin', '<span class="sort-indicator" ng-class="selectedCls(\'col_' + i + '.value\')"></span>');
                }
            }

            tbody = table.querySelector('tbody');

            tr = table.querySelector('tbody tr');
            tr.setAttribute('ng-repeat', 'row in body | orderBy:sort.column:sort.reverse');

            if (nthChild) {
                tr.setAttribute('ng-class-odd', '\'odd\'');
                tr.setAttribute('ng-class-even', '\'even\'');
                console.log('nthChild', nthChild.getAttribute('count'));
            }

            tds = table.querySelectorAll('tbody > tr > td');
            for (i = 0; i < th.length; i += 1) {
                css(tds[i], 'padding', cellPadding);
                node = tds[i];
                while (node.firstChild) {
                    node = node.firstChild;
                }
                node.nodeValue = '{{row.col_' + i + '.label}}';
            }
            tbody.innerHTML = tr.outerHTML;

            linkFn = $compile(table.outerHTML);
            content = linkFn(scope);
            el.empty();
            el.append(content);

        }
    };
});