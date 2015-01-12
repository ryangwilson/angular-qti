/* global define */
//! import framework.plugin
//! import framework.registry
define('application', ['framework'], function (framework) {
    console.log('### application ###', framework);
    var application = {};

    //dispatcher(framework);
    //var virtual = {};
    //
    //framework.on('virtual::init', function (evt, name) {
    //    console.log('init', name);
    //});
    //
    //framework.on('virtual::ready', function (evt, name) {
    //    console.log('ready', name);
    //});

    return application;
});