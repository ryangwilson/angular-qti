angular.module('simulation').directive('simButton', function () {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {
            el.text(attrs.label);
        }
    };
});