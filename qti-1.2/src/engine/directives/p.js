/* global angular */
angular.module('qti').directive('p', function ($compile) {

    function parseTabStops(attributes) {
        var tabStops = {};
        if (attributes) {
            var props = attributes.split(';');
            var prop, key, value;
            for (var i = 0; i < props.length; i += 1) {
                prop = props[i].split(':');
                key = (prop[0] + '').trim();
                value = (prop[1] + '').trim();
                if (key === 'interval') {
                    tabStops[key] = Number(value);
                } else if (key === 'tabset') {
                    tabStops[key] = JSON.parse('{"list": [' + value + ']}').list;
                } else if (key === 'alignment') {
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
        restrict: 'E',
        scope: true,
        link: function (scope, el, attr) {
            var tabStops = parseTabStops(attr.tabStops);
            var html = el.html();
            var linkFn, content;
            html = html.split('\t').join('<span style="padding-right:' + tabStops.interval + 'in"></span>');

            html = '<div>' + html + '</div>';
            linkFn = $compile(html);
            content = linkFn(scope);
            el.empty();
            el.append(content);
        }
    };
});
