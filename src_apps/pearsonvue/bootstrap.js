/* global angular, MathJax */
angular.module('pearsonvue', []);

if(window.hasOwnProperty('MathJax')) {
    MathJax.Hub.Config({
        "HTML-CSS": {
            preferredFont: "STIX"
        }
    });

    setTimeout(function(){
        MathJax.Hub.Configured();
    }, 2000);
}

