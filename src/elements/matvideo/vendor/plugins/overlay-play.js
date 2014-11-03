/**
 * @license Videogular v0.6.2 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
"use strict";
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.overlayplay:vgOverlayPlay
 * @restrict E
 * @description
 * Shows a big play button centered when player is paused or stopped.
 *
 * ```html
 * <videogular vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-overlay-play></vg-overlay-play>
 * </videogular>
 * ```
 *
 */
angular.module("com.2fdevs.videogular.plugins.overlayplay", [])
    .directive("vgOverlayPlay", ["VG_STATES", function (VG_STATES) {
        return {
            restrict: "E",
            require: "^videogular",
            template: "<div class='overlayPlayContainer' ng-click='onClickOverlayPlay()'>" +
            "<div class='iconButton' ng-class='overlayPlayIcon'></div>" +
            "</div>",
            link: function (scope, elem, attr, API) {

                function onComplete(target, params) {
                    scope.overlayPlayIcon = {play: true};
                }

                function onPlay(target, params) {
                    scope.overlayPlayIcon = {};
                }

                function onChangeState(newState) {
                    console.log('newstate', newState);
                    switch (newState) {
                        case VG_STATES.PLAY:
                            scope.overlayPlayIcon = {};
                            break;

                        case VG_STATES.PAUSE:
                            scope.overlayPlayIcon = {play: true};
                            break;

                        case VG_STATES.STOP:
                            scope.overlayPlayIcon = {play: true};
                            break;
                    }
                }

                scope.onClickOverlayPlay = function onClickOverlayPlay(event) {
                    if (API.currentState === 'play' && scope.config.pauseAvailable) {
                        API.pause();
                    } else if (scope.config.playAvailable) {
                        API.play();
                    }
                };

                scope.overlayPlayIcon = {play: true};

                scope.$watch(
                    function () {
                        return API.currentState;
                    },
                    function (newVal, oldVal) {
                        if (newVal != oldVal) {
                            onChangeState(newVal);
                        }
                    }
                );
            }
        };
    }
    ]);

