/* global define, internal */
internal('reportCard', ['framework', 'reportCard.dummy'], function (framework, dummy) {
    framework.fire('reportCard::init');
    console.log('### reportCard ###', dummy());
});

