angular.module('videogular').directive('vgMutebutton', function () {
    return {
        restrict: 'E',
        require: '^videogular',
        template: '<button class="iconButton" ng-class="muteIcon" \
             ng-click="onClickMute()" ng-focus="onMuteButtonFocus()" ng-blur="onMuteButtonLoseFocus()" ng-keydown="onMuteButtonKeyDown($event)" \
             aria-label="Mute"></button>',
        link: function (scope, elem, attr, API) {
            var isMuted = false;
            var UP = 38;
            var DOWN = 40;
            var CHANGE_PER_PRESS = 0.05;

            scope.onClickMute = function onClickMute() {
                if (isMuted) {
                    scope.currentVolume = scope.defaultVolume;
                }
                else {
                    scope.currentVolume = 0;
                    scope.muteIcon = {mute: true};
                }

                isMuted = !isMuted;

                API.setVolume(scope.currentVolume);
            };

            scope.onMuteButtonFocus = function () {
                scope.volumeVisibility = 'visible';
            };

            scope.onMuteButtonLoseFocus = function () {
                scope.volumeVisibility = 'hidden';
            };

            scope.onMuteButtonKeyDown = function (event) {
                var currentVolume = (API.volume !== null) ? API.volume : 1;

                if (event.which === UP || event.keyCode === UP) {
                    API.setVolume(currentVolume + CHANGE_PER_PRESS);
                    event.preventDefault();
                }
                else if (event.which === DOWN || event.keyCode === DOWN) {
                    API.setVolume(currentVolume - CHANGE_PER_PRESS);
                    event.preventDefault();
                }
            };

            function onSetVolume(newVolume) {
                scope.currentVolume = newVolume;

                // TODO: Save volume with LocalStorage
                // if it's not muted we save the default volume
                if (!isMuted) {
                    scope.defaultVolume = newVolume;
                }
                else {
                    // if was muted but the user changed the volume
                    if (newVolume > 0) {
                        scope.defaultVolume = newVolume;
                    }
                }

                var percentValue = Math.round(newVolume * 100);
                if (percentValue === 0) {
                    scope.muteIcon = {mute: true};
                }
                else if (percentValue > 0 && percentValue < 25) {
                    scope.muteIcon = {level0: true};
                }
                else if (percentValue >= 25 && percentValue < 50) {
                    scope.muteIcon = {level1: true};
                }
                else if (percentValue >= 50 && percentValue < 75) {
                    scope.muteIcon = {level2: true};
                }
                else if (percentValue >= 75) {
                    scope.muteIcon = {level3: true};
                }
            }

            scope.defaultVolume = 1;
            scope.currentVolume = scope.defaultVolume;
            scope.muteIcon = {level3: true};

            //TODO: get volume from localStorage

            scope.$watch(
                function () {
                    return API.volume;
                },
                function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        onSetVolume(newVal);
                    }
                }
            );
        }
    };
});