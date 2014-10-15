/* global angular, ActiveXObject */
angular.module('qti').directive('qtiEngine', function ($http, $compile) {

    function stripCDATA(str) {
        return str.split('<![CDATA[').join('').split(']]>').join('');
    }

    function _formatWhitespace(str) {
        return str.replace(/(\w+)(.*?)>([\w\s\.\[\]\d\t]+)<\/(\1)/gim, function(match, r0, r1, r2) {
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
                template = stripCDATA(template);
                template = replaceDyn(template);
                template = replaceShorthand(template);
                template = formatWhitespace(template);
//                template = formatTabs(template);
//                console.log('template', template);
                var linkFn = $compile(template);
                var content = linkFn(scope);
                el.append(content);
            });
        }
    };

});
