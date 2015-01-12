/* global define */
internal('framework.config', ['framework', 'http'], function (framework, http) {

    var url = 'config.json';
    var config;

    /**
     * Config will wait for registry to be loaded before loading.
     */
    framework.on('registry::ready', function (evt, registry) {
        framework.fire('config::init');

        http.get({
            url: url,
            success: function (response) {
                config = response.data;
                framework.fire('config::ready', config);
            }
        });
    });

});