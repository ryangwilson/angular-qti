/* global define, internal */

internal('score', ['framework'], function (framework) {
    var consoleLabel = '[score]';
    var css = 'color: red';
    console.log('%c' + consoleLabel, css, framework);
    var abc = 123;
    return function () {
        console.log('%c' + consoleLabel, css, abc);
    };
});

