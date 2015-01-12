/* global define */
//! import framework.plugin
//! import framework.registry
//! import framework.config
define('framework', ['dispatcher', 'toArray'], function (dispatcher, toArray) {

    var framework = {};
    dispatcher(framework);

    framework.fire = function (eventName, data) {
        var css = 'color: blue';
        console.log('%c[event]', css, eventName, data || '');
        framework.dispatch.apply(framework, toArray(arguments));
    };

    return framework;
});