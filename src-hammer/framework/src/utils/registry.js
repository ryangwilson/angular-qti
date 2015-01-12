/* global define */
internal('framework.registry', ['framework', 'http'], function (framework, http) {

    var url = 'registry.json';
    var registry;

    framework.fire('registry::init');

    http.get({
        url: url,
        success: function (response) {
            registry = response.data;
            framework.fire('registry::ready', registry);
        }
    });

    //function Registry(url) {
    //
    //    var scope = this;
    //    scope.url = url;
    //    scope.data = null;
    //
    //    framework.dispatch('virtual::init', 'registry', scope);
    //
    //    http.get({
    //        url: url,
    //        success: function (response) {
    //            scope.data = response.data;
    //            framework.dispatch('registry::ready', scope);
    //            //scope.$parse(scope.data);
    //        }
    //    });
    //}
    //
    //var proto = Registry.prototype;
    //proto.view = function (name) {
    //    return this.data.views[name];
    //};
    //
    //proto.plugin = function (name) {
    //    return this.data.plugins[name];
    //};
    //
    //proto.$parse = function (config) {
    //    var scope = this;
    //    var count = 0;
    //    var name;
    //
    //    for (name in config.views) {
    //        count++;
    //        scope.$load(name, 'view', config.views[name], function (name, config, data) {
    //            console.log('###DONE###', name, data);
    //            count--;
    //
    //            if (count === 0) {
    //                framework.dispatch('virtual::ready', 'registry', scope);
    //            }
    //        });
    //    }
    //
    //    for (name in config.plugins) {
    //        count++;
    //        scope.$load(name, 'plugin', config.plugins[name], function (name, config, data) {
    //            console.log('###DONE###', name, config.url);
    //            count--;
    //
    //            if (count === 0) {
    //                framework.dispatch('virtual::ready', 'registry', scope);
    //            }
    //        });
    //    }
    //};
    //
    //proto.$load = function (name, type, config, callback) {
    //    config.success = function (response) {
    //        callback(name, config, response.data);
    //        //count--;
    //        //console.log('count is', count, e, view);
    //        //if (count === 0) {
    //        //    // check ready state
    //        //    framework.dispatch('virtual::ready', 'registry', scope);
    //        //}
    //    };
    //    http.get(config);
    //};
    //
    //return new Registry('registry.json');
});