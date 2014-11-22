/* global angular */

angular.module('qti').directive('matimage', function (helpers) {

    return {
        restrict: 'E',
        scope: true,
//        template: '<img ng-src="{{url}}" />',
        link: function (scope, el, attr) {

            var str, xml;
            xml = helpers.strToXML('<img />').firstChild;

            var valign;
            switch (attr.valign) {
                case 'top':
                    valign = 'top';
                    break;
                case 'bottom':
                    valign = 'bottom';
                    break;
                default:
                    valign = 'middle';
                    break;
            }

            var style = 'vertical-align:' + valign + ';';

            if (attr.hasOwnProperty('width')) {
                style += 'width:' + attr.width + 'px;';
            }

            if (attr.hasOwnProperty('height')) {
                style += 'height:' + attr.height + 'px;';
            }

            if (attr.hasOwnProperty('uri')) {
                xml.setAttribute('src', attr.uri);
            } else if (attr.hasOwnProperty('embedded')) {
                str = 'data:image/jpg;base64,';
                xml.setAttribute('src', str + el.text());
            }

            if(attr.hasOwnProperty('alt')) {
                xml.setAttribute('alt', attr.alt);
            }

            xml.setAttribute('style', style);

            el.html(xml.outerHTML);

        }
    };
});