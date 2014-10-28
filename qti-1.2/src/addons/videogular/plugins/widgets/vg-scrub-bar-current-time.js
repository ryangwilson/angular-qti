angular.module('videogular').directive('vgScrubbarcurrenttime', function () {
    return {
        restrict: 'E',
        require: '^videogular',
        link: function (scope, elem, attr, API) {
            var percentTime = 0;

            function onUpdateTime(newCurrentTime) {
                if (newCurrentTime && API.totalTime) {
                    percentTime = (newCurrentTime.getTime() * -1 / 1000) * 100 / (API.totalTime.getTime() * -1 / 1000);
                    elem.css('width', percentTime + '%');
                }
            }

            function onComplete() {
                percentTime = 0;
                elem.css('width', percentTime + '%');
            }

            scope.$watch(
                function () {
                    return API.currentTime;
                },
                function (newVal, oldVal) {
                    onUpdateTime(newVal);
                }
            );

            scope.$watch(
                function () {
                    return API.isCompleted;
                },
                function (newVal, oldVal) {
                    onComplete(newVal);
                }
            );
        }
    };
});