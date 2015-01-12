/* global internal */
//! import string.supplant
internal('framework.plugin', ['framework', 'interpolate', 'extend', 'http'], function (framework, interpolate, extend, http) {

    var registry, config;
    var views = {};
    var plugins = {};

    var init = function () {
        framework.fire('plugin::init');

        var plugin, count = 0;
        for (var name in plugins) {
            plugin = plugins[name];
            if (plugin.url) {
                count++;
                http.get({
                    url: plugin.url,
                    success: function (response) {
                        count--;
                        //console.log(response.data);
                        interpolate(window, response.data);
                        if (count === 0) {
                            console.log('###EXPORTS####', exports);
                            framework.fire('plugin::ready', plugins);
                        }
                    }
                });
            }
            console.log('plugin', name, plugins[name].url);
        }
    };

    framework.on('registry::ready', function (evt, data) {
        registry = data;

        var view, e;
        for (e in data.views) {
            if (data.plugins.hasOwnProperty(e)) {
                view = data.views[e];
                views[view.name] = view;
            }
        }

        var plugin;
        for (e in data.plugins) {
            if (data.plugins.hasOwnProperty(e)) {
                plugin = data.plugins[e];
                plugins[plugin.name] = plugin;
            }
        }
    });

    /**
     * When we get the config extend the default plugin options that came from the registry
     */
    framework.on('config::ready', function (evt, data) {
        config = data;

        var plugin;
        for (var e in data.plugins) {
            if (data.plugins.hasOwnProperty(e)) {
                plugin = data.plugins[e];
                plugins[plugin.name] = extend({}, plugins[plugin.name], plugin);
            }
        }
        init();
    });

});