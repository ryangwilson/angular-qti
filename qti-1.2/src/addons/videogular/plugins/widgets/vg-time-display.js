angular.module('videogular').directive("vgTimedisplay", function () {
    return {
        require: '^videogular',
        restrict: "E",
        link: function (scope, elem, attr, API) {
            scope.$watch(
                function () {
                    return API.currentTime;
                },
                function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        scope.currentTime = newVal;
                    }
                }
            );

            scope.$watch(
                function () {
                    return API.timeLeft;
                },
                function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        scope.timeLeft = newVal;
                    }
                }
            );

            scope.$watch(
                function () {
                    return API.totalTime;
                },
                function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        scope.totalTime = newVal;
                    }
                }
            );
        }
    };
});