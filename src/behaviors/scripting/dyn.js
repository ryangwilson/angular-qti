/* global angular */
angular.module('qti.plugins').service('scripting', function ($rootScope) {

    var replaceDyn = function (str) {
        return str.replace(/<dyn type="text\/groovy">(\s?)+return(\s?)+((.|\n)*?)(;?)<\/dyn>/gim, "{{ $3 }}");
    };

    var replaceShorthand = function (str) {
        return str.replace(/\${(\s?)+((.|\n)*?)\}/gim, "{{ system.$2 }}");
    };

    $rootScope.$on('qti::setup', function (evt) {
        evt.targetScope.template = replaceDyn(evt.targetScope.template);
        evt.targetScope.template = replaceShorthand(evt.targetScope.template);
    });

}).run(function (scripting) {
});