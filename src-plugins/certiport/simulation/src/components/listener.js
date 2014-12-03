angular.module('simulation').directive('simListener', function ($interpolate) {
    return {
        restrict: 'AE',
        link: function (scope, el) {
            el.remove();
        },
        controller: function ($scope, $attrs) {
            $scope.$on($attrs.on, function (evt, targetScope, data) {
                var handler = $attrs.handler; // ex. myFunction({message: 'Show event called'})
                var fnName = handler.match(/^\w+/im)[0]; // ex. myFunction
                if ($scope.functions[fnName]) { // does function exist
                    var openParenIndex = handler.indexOf('(');
                    var closeParenIndex = handler.lastIndexOf(')');
                    if (openParenIndex === -1) {
                        handler += '($scope)'; // if no parens add them
                    } else {
                        var str1 = handler.substr(0, openParenIndex + 1);
                        var str2 = handler.substr(openParenIndex + 1);

                        if (handler.substr(openParenIndex, closeParenIndex).match(/\w+/im)) {
                            handler = str1 + '$scope,' + str2; // if callback has args
                        } else {
                            handler = str1 + '$scope' + str2; // if callback has no args
                        }
                    }
                    handler = 'functions.' + handler; // add functions. so it can be found
                    handler = $scope.bindable(handler);
                    var exp = $interpolate(handler); // interpolate any {{}}
                    var interpolatedHandler = exp(data);
                    $scope.$eval(interpolatedHandler); // evaluate expression
                }
            });
        }
    };
});