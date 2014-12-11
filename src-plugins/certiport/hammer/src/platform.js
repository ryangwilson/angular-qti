(function () {

    /* global angular, dispatcher, extend */

    var _platforms = {};

    /**
     * Platform manages views, plugins and other resources.
     * @param name - name of the platform
     * @constructor
     */
    function Platform(name) {

        this.name = name;
        this.views = {};
        this.plugins = {};

        dispatcher(this);

    }

    /**
     * Registers a configuration to be used to render the view.
     * @param name - name of the view
     * @param options - configuration for view
     */
    Platform.prototype.registerView = function (name, options) {
        this.views[name] = options;
    };

    /**
     * Registers a configuration to be used to add plugins either to a view or to the platform.
     * @param name - name of the plugin
     * @param options - configuration for plugin
     */
    Platform.prototype.registerPlugin = function (name, options) {
        this.plugins[name] = options;
    };


    /**
     * Gets a registered view configuration.
     * @param name - name of the view
     * @returns configuration for view
     */
    Platform.prototype.getView = function (name) {
        var view = this.views[name];

        if (!view) {
            throw new Error('View not registered with name: {name}.').supplant({name: name});
        }

        return view;
    };

    /**
     * Gets a registered plugin configuration.
     * @param name - name of the plugin
     * @returns configuration for plugin
     */
    Platform.prototype.getPlugin = function (name) {
        var plugin = this.plugins[name];

        if (!plugin) {
            throw new Error('Plugin not registered with name: {name}.').supplant({name: name});
        }

        return plugin;
    };

    /**
     * Gets a rendered DOM element based on the view configuration.
     * @param name - name of the view
     * @param options - adds or overrides default options
     * @returns DOM element
     */
    Platform.prototype.getViewElement = function(name, options) {

        var scope = this;

        var view = scope.getView(name);

        options = extend({}, view, options);

        var viewEl = scope.renderElement(view.name, options);

        var plugin, pluginEl;
        angular.forEach(options.plugins, function (name) {
            plugin = scope.getPlugin(name);
            pluginEl = scope.renderElement(plugin.name, options);
            viewEl.append(pluginEl);
        });

        return viewEl;
    };

    /**
     * Renders an element based on the configuration
     * @param tag_name - tag name of DOM element
     * @param options - configuration for DOM
     * @returns DOM element
     */
    Platform.prototype.renderElement = function(tag_name, options) {

        var template = '<{tag_name}></{tag_name}>';
        var html = template.supplant({tag_name: tag_name});
        var el = angular.element(html);

        angular.forEach(options.attrs, function (value, name) {
            el.attr(name, value);
        });

        return el;
    };


    /**
     * Global reference to platform
     * @param name
     * @returns Platform instance
     */
    window.platform = function (name) {
        if (!_platforms[name]) {
            _platforms[name] = new Platform(name);
        }
        return _platforms[name];
    };

})();
