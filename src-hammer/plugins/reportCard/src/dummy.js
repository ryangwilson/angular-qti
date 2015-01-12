/**
 * This is a dependency of reportCard. Files can be broken out to separate tasks internally
 */
internal('reportCard.dummy', ['framework'], function (framework) {
    framework.fire('dummy::init');
    return function () {
        return 'dummy';
    };
});