angular.module('qti').directive('pearsonvueReferencematerial', function () {

    //var splitter = '<flow orientation="horizontal" class="cloud">\
    //    <flow width="50%" class="orange"></flow>\
    //<flow width="50%" class="silver" orientation="horizontal"></flow>\
    //</flow>';

    var flow = '<flow></flow>';

    return {
        link: function($scope, $el, $attr){
            var flowContainerEl = angular.element(flow);
            flowContainerEl.innerHTML = 'Hello, world';
            $el.append(flowContainerEl);
        }
    };
});