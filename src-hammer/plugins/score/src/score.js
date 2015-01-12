/* global define, internal */

internal('score', ['framework'], function (framework) {
    framework.fire('score::init');
    var abc = 123;
    return function () {
        var consoleLabel = '[score]';
        var css = 'color: #999';
        console.log('%c' + consoleLabel, css, abc);
    };
});

