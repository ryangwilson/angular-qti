/* global angular */
angular.module('certiport.plugin', []);
var application = angular.module('certiport', ['certiport.plugin'], function ($compileProvider, $controllerProvider) {
    application.api.consts.$compileProvider = $compileProvider;
    application.api.consts.$controllerProvider = $controllerProvider;
});

// TODO: Working here on creating application api
// The reason why it is good to do it this way is I will no longer need to build the array of
// reservedTags as found in application.js

// TODO: Turn this into a class
application.api = {};
application.api.consts = {};
application.api.directives = {};
application.api.directive = function (name, fn) {
    application.api.directives[name] = fn;
};
application.api.applyDirectives = function () {
    angular.forEach(application.api.directives, function (fn, name) {
        application.directive(name, fn);
    });
};
