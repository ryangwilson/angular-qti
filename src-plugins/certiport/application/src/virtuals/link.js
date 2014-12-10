/* global angular */
angular.module('certiport').directive('simLink', function ($http) {

    var scripts = {};

    return {
        restrict: 'AE',
        controller: function ($scope, $element, $attrs) {

            var slideClass = '.slide_' + $scope.$id;

            if ($attrs.href) {
                var url = $attrs.href;

                if (!scripts[url]) {

                    scripts[url] = true;

                    var path = '{val}'.supplant({val: url});
                    //console.log('path', path);
                    $http.get(path).success(function (content) {

                        content = content.replace(/([\#\.\D]{1}[A-Za-z]{1}[\w\.\s]+)(,|\{)/g, function (match, p1, p2) {
                            return (slideClass + ' ' + p1.trim() + p2).trim();
                        });
                        //console.log('content', content);
                        //$element.html('<style>\n' + content + '\n</style>');
                        $element[0].outerHTML = ('<style>' + content + '</style>');

                    });

                }
            }
        }
    };
});