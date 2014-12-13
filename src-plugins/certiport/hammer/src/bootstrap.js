/* global angular */

var platformConsts = {};
angular.module('platform', [], function ($compileProvider, $controllerProvider) {
    platformConsts.$compileProvider = $compileProvider;
    platformConsts.$controllerProvider = $controllerProvider;
    //routeConfig.setCompileProvider($compileProvider);
    //routeConfig.setControllerProvider($controllerProvider);
});
