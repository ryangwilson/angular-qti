(function () {

    /* global angular, dispatcher, extend */

    var _platforms = {};

    /**
     * Creates a bridge between JS and Angular directive
     * @param name
     * @constructor
     */
    function Platform(name) {

        this.name = name;
        this.views = {};
        this.plugins = {};

        dispatcher(this);

    }

    Platform.prototype.registerView = function (name, options) {
        this.views[name] = options;
    };

    Platform.prototype.registerPlugin = function (name, options) {
        this.plugins[name] = options;
    };

    Platform.prototype.getView = function (name) {
        var view = this.views[name];

        if (!view) {
            throw new Error('View not registered with name: {name}.').supplant({name: name});
        }

        return view;
    };

    Platform.prototype.getPlugin = function (name) {
        var plugin = this.plugins[name];

        if (!plugin) {
            throw new Error('Plugin not registered with name: {name}.').supplant({name: name});
        }

        return plugin;
    };

    Platform.prototype.getViewElement = function(name, options) {

        var scope = this;

        var view = scope.getView(name);

        options = extend({}, view, options);

        var viewEl = scope.getElement(view.name, options);

        var plugin, pluginEl;
        angular.forEach(options.plugins, function (name) {
            plugin = scope.getPlugin(name);
            pluginEl = scope.getElement(plugin.name, options);
            viewEl.append(pluginEl);
        });

        return viewEl;
    };

    Platform.prototype.getElement = function(name, options) {

        var template = '<{name}></{name}>';
        var html = template.supplant({name: name});
        var el = angular.element(html);

        angular.forEach(options.attrs, function (value, name) {
            el.attr(name, value);
        });

        return el;
    };


    window.platform = function (name) {
        if (!_platforms[name]) {
            _platforms[name] = new Platform(name);
        }
        return _platforms[name];
    };

})();
