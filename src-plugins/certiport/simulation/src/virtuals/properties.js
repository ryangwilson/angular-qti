/* global angular */
angular.module('simulation').directive('simProperties', function (helpers) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {
            var content = '<props>' + el.html() + '</props>';
            var xml = helpers.strToXML(content);
            var json = helpers.xmlToJson(xml);
            angular.extend(scope.properties, json.props);

            el.remove();
        }
    };
});