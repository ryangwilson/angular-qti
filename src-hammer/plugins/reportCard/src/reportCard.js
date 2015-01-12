/* global define, internal */
/**
 * reportCard.dummy is a dependency of reportcard
 */
internal('reportCard', ['framework', 'reportCard.dummy'], function (framework, dummy) {
    framework.fire('reportCard::init');
    console.log('%c[reportCard] calling dummy()', 'color: #999', dummy());
});

