/* global angular, ActiveXObject */
angular.module('qti').directive('qtiEngine', function ($http, $compile, helpers) {

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

    function _formatWhitespace(str) {
        return str.replace(/(\w+)(.*?)>([\w\s\.\[\]\d\t]+)<\/(\1)/gim, function (match, r0, r1, r2) {
            return r0 + r1 + '>' + r2.split(' ').join('&nbsp;&#8203;') + '</' + r0;
        });
    }

    // http://stackoverflow.com/questions/13711797/how-are-multiple-spaces-showing-in-html-without-pre-nbsp-or-white-space-pre
    function formatWhitespace(str) {
        var matches = str.match(/<mattext([^>]?)+>((.|\n)*?)<\/mattext>/gim);
        var formattedStr;
        var match;
        if (matches) {
            for (var i = 0; i < matches.length; i += 1) {
                match = matches[i];
                formattedStr = _formatWhitespace(match);
                str = str.split(matches[i]).join(formattedStr);
            }
        }
        return str;
    }

    function replaceDyn(str) {
        return str.replace(/<dyn type="text\/groovy">(\s?)+return(\s?)+((.|\n)*?)(;?)<\/dyn>/gim, "{{ $3 }}");
    }

    function replaceShorthand(str) {
        return str.replace(/\${(\s?)+((.|\n)*?)\}/gim, "{{ system.$2 }}");
    }

    return {
        restrict: 'E',
        scope: true,
        link: function (scope, el, attr) {
            $http.get(attr.src).then(function (response) {
                var template = response.data;
                var xml = helpers.strToXML(template);
                template = fixMattext(template);
                template = stripCDATA(template);
                template = replaceDyn(template);
                template = replaceShorthand(template);
                var linkFn = $compile(template);
                var content = linkFn(scope);
                el.append(content);
            });
        }
    };

});
