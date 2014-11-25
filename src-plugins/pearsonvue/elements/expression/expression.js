angular.module("qti.plugins").service('expression', function () {
    if (window.hasOwnProperty('MathJax')) {
        MathJax.Hub.Config({
            "HTML-CSS": {
                preferredFont: "STIX"
            }
        });

        setTimeout(function () {
            MathJax.Hub.Configured();
        }, 1000);
    }
}).run(function (expression) {
});