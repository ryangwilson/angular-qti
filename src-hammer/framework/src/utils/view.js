/* global internal */
//! import string.supplant
internal('framework.view', ['framework', 'interpolate', 'extend', 'http'], function (framework, interpolate, extend, http) {

    var registry, config;
    var views = {};

    var init = function () {
        framework.fire('view::init');

        var view, count = 0;
        for (var name in views) {
            view = views[name];
            if (view.url) {
                count++;
                http.get({
                    url: view.url,
                    success: function (response) {
                        count--;
                        //console.log(response.data);
                        interpolate(window, response.data);
                        if (count === 0) {
                            framework.fire('view::ready', views);
                        }
                    }
                });
            }
            console.log('%c[view]', 'color: purple',  name, views[name].url);
        }
    };

    framework.on('registry::ready', function (evt, data) {
        registry = data;
        var view;
        for (e in data.views) {
            if (data.views.hasOwnProperty(e)) {
                view = data.views[e];
                views[view.name] = view;
            }
        }
    });

    /**
     * When we get the config extend the default view options that came from the registry
     */
    framework.on('config::ready', function (evt, data) {
        config = data;

        var view;
        for (var e in data.views) {
            if (data.views.hasOwnProperty(e)) {
                view = data.views[e];
                views[view.name] = extend({}, views[view.name], view);
            }
        }
        init();
    });

});