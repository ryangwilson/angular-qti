/* global angular, dispatcher, extend, injector */
(function () {

    var _applications = {};

    /**
     * Application manages views, plugins and other resources.
     * @param name - name of the platform
     * @constructor
     */
    function Application(name) {
        this.name = name;
        this.config = {};
        this.views = {};
        this.plugins = {
            $$cache: {}
        };

        dispatcher(this);
    }

    /**
     * Applies the configuration file for the initialization.
     * @param config
     * @returns {Application}
     */
    Application.prototype.init = function (config) {
        extend(this.config, config);
        return this;
    };

    /**
     * Getter / setter - Registers a configuration to be used to render the view.
     * @param name - name of the view
     * @param options - configuration for view
     * @returns {Application} if setter or view configuration if getter
     */
    Application.prototype.view = function (name, options) {

        if (typeof options === 'undefined') {
            var view = this.views[name];

            if (!view) {
                throw new Error('View not registered with name: {name}.').supplant({name: name});
            }
            return view;
        }

        this.views[name] = options;
        return this;
    };

    /**
     * Registers a configuration to be used to add plugins either to a view or to the platform.
     * @param name - name of the plugin
     * @param functionOrUrl - configuration for plugin
     * @returns {Application} or Plugin Instance
     */
    Application.prototype.registerPlugin = function (name, functionOrUrl) {
        this.plugins[name] = functionOrUrl;
        return this;
    };

    Application.prototype.getPlugin = function (name, options) {

        if (!this.plugins.$$cache[name]) {
            var pluginFn = this.plugins[name];

            if (!pluginFn) {
                throw new Error('Plugin not registered with name: {name}.').supplant({name: name});
            }

            this.plugins.$$cache[name] = pluginFn();
        }

        return this.plugins.$$cache[name];
    };

    /**
     * Gets a rendered DOM element based on the view configuration.
     * @param name - name of the view
     * @param options - adds or overrides default options
     * @returns DOM element
     */
    Application.prototype.getViewElement = function (name, options) {

        var scope = this;

        var view = scope.view(name);

        options = extend({}, view, options);

        var viewEl = scope.renderElement(view.name, options);

        var plugin, pluginEl;
        angular.forEach(options.plugins, function (pluginData) {
            plugin = scope.getPlugin(pluginData.name, pluginData.options);
            console.warn('THIS IS BEING REFACTORED');
            //pluginEl = scope.renderElement(plugin.name, options);
            //viewEl.append(pluginEl);
        });

        return viewEl;
    };

    /**
     * Renders an element based on the configuration
     * @param tag_name - tag name of DOM element
     * @param options - configuration for DOM
     * @returns DOM element
     */
    Application.prototype.renderElement = function (tag_name, options) {

        // create a DOM element
        var template = '<{tag_name}></{tag_name}>';
        var html = template.supplant({tag_name: tag_name});
        var el = angular.element(html);

        // add attributes to the newly created DOM element
        angular.forEach(options.attrs, function (value, name) {
            el.attr(name, value);
        });

        return el;
    };


    /**
     * Global reference to platform
     * @param name
     * @returns Application instance
     */
    window.platform = function (name) {
        if (!_applications[name]) {
            _applications[name] = new Application(name);
        }
        return _applications[name];
    };

})();
