angular.module('videogular').directive('vgPlayPauseButton', function (VG_STATES) {
    return {
        restrict: 'E',
        require: '^videogular',
        template: '<button class="iconButton" ng-click="onClickPlayPause()" ng-class="playPauseIcon" aria-label="Play/Pause"></button>',
        link: function (scope, elem, attr, API) {
            function setState(newState) {
                switch (newState) {
                    case VG_STATES.PLAY:
                        scope.playPauseIcon = {pause: true};
                        break;

                    case VG_STATES.PAUSE:
                        scope.playPauseIcon = {play: true};
                        break;

                    case VG_STATES.STOP:
                        scope.playPauseIcon = {play: true};
                        break;
                }
            }

            scope.onClickPlayPause = function onClickPlayPause() {
                API.playPause();
            };

            scope.playPauseIcon = {play: true};

            scope.$watch(
                function () {
                    return API.currentState;
                },
                function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        setState(newVal);
                    }
                }
            );
        }
    };
});