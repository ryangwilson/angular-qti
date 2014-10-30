/* global angular, ActiveXObject */
angular.module('qti').directive('qti', function ($http, $compile, helpers) {

    function _replaceSpaces(match, group) {
        return match.split(' ').join('__SPACE__');
    }

    function _replaceTabs(match, group) {
        return match.split(' ').join('__TAB__');
    }

    function fixMattext(xmlStr) {
        var xml = helpers.strToXML(xmlStr);
        var mattexts = xml.querySelectorAll('mattext');
        var mattext, childNodes, childNode, str;
        for (var i = 0; i < mattexts.length; i++) {
            mattext = mattexts[i];
            childNodes = mattext.childNodes;
            for (var n = 0; n < childNodes.length; n++) {
                childNode = childNodes[n];
                if (childNode.nodeType === 3) { // text node
                    str = childNode.nodeValue.replace(/\s{2,}/gim, _replaceSpaces);
                    str = str.replace(/\t{2,}/gim, _replaceTabs);
                    childNode.nodeValue = str;
                }
            }
        }
        var oSerializer = new XMLSerializer();
        xmlStr = oSerializer.serializeToString(xml);
        xmlStr = xmlStr.split('__SPACE__').join('&nbsp;&#8203;');
        xmlStr = xmlStr.split('__TAB__').join('&nbsp;&nbsp;&nbsp;&#8203;');
        return xmlStr;
    }

    function stripCDATA(str) {
        return str.split('<![CDATA[').join('').split(']]>').join('');
    }

    return {
        restrict: 'E',
        scope: true,
        link: function (scope, el, attr) {

            scope.src = null;
            scope.template = null;
            scope.content = null;

            $http.get(attr.src).then(function (response) {

                // keep original src
                scope.src = response.data;

                // keep template
                scope.template = fixMattext(scope.src);
                scope.template = stripCDATA(scope.template);

                // dispatch setup so other services can respond and fix up template
                // order should not matter
                scope.$emit('qti::setup');

                // compile the template to be digested by angular
                var linkFn = $compile(scope.template);
                scope.content = linkFn(scope);
                el.append(scope.content);

                // dispatch ready event
                scope.$emit('qti::ready');

            });

        }
    };

});
