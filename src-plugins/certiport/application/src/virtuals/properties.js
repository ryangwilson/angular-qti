/* global angular, hb */
angular.module('certiport').directive('simProperties', function () {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {
            var content = '<props>' + el.html() + '</props>';
            var xml = hb.toXML(content);
            var json = hb.fromXML(xml);
            angular.extend(scope.properties, json.props);

            el.remove();
        }
    };
});