/* global angular, ActiveXObject */
angular.module('qti').directive('qti', function ($http, $compile, helpers) {

    function stripCDATA(str) {
        return str.split('<![CDATA[').join('').split(']]>').join('');
    }

    function fixNamespace(str) {
        return str;
        //return str.replace(/(<\/?\w+)(:)/gi, '$1_');
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
                scope.template = stripCDATA(scope.src);
                scope.template = fixNamespace(scope.template);
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
