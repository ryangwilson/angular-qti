angular.module('videogular').directive('vgFullscreenbutton', function () {
    return {
        restrict: 'AE',
        require: '^videogular',
        scope: {
            vgEnterFullScreenIcon: '=',
            vgExitFullScreenIcon: '='
        },
        template: '<button class="iconButton" ng-click="onClickFullScreen()" ng-class="fullscreenIcon" aria-label="Toggle full screen"></button>',
        link: function (scope, elem, attr, API) {
            function onChangeFullScreen(isFullScreen) {
                scope.fullscreenIcon = {enter: !isFullScreen, exit: isFullScreen};
            }

            scope.onClickFullScreen = function onClickFullScreen() {
                API.toggleFullScreen();
            };

            scope.fullscreenIcon = {exit: false};
            scope.fullscreenIcon = {enter: true};

            scope.$watch(
                function () {
                    return API.isFullScreen;
                },
                function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        onChangeFullScreen(newVal);
                    }
                }
            );
        }
    };
});