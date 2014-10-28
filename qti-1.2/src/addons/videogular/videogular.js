/* global angular */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.videogular
 * @restrict E
 * @description
 * Main directive that must wrap a &lt;vg-video&gt; or &lt;vg-audio&gt; tag and all plugins.
 *
 * &lt;video&gt; tag usually will be above plugin tags, that's because plugins should be in a layer over the &lt;video&gt;.
 *
 * You can customize `videogular` with these attributes:
 *
 * @param {string} vgTheme String with a scope name variable. This directive will inject a CSS link in the header of your page.
 * **This parameter is required.**
 *
 * @param {boolean} [vgAutoplay=false] vgAutoplay Boolean value or a String with a scope name variable to auto start playing video when it is initialized.
 *
 * **This parameter is disabled in mobile devices** because user must click on content to prevent consuming mobile data plans.
 *
 * @param {function} vgComplete Function name in controller's scope to call when video have been completed.
 * @param {function} vgUpdateVolume Function name in controller's scope to call when volume changes. Receives a param with the new volume.
 * @param {function} vgUpdateTime Function name in controller's scope to call when video playback time is updated. Receives two params with current time and duration in milliseconds.
 * @param {function} vgUpdateState Function name in controller's scope to call when video state changes. Receives a param with the new state. Possible values are "play", "stop" or "pause".
 * @param {function} vgPlayerReady Function name in controller's scope to call when video have been initialized. Receives a param with the videogular API.
 * @param {function} vgChangeSource Function name in controller's scope to change current video source. Receives a param with the new video.
 * This is a free parameter and it could be values like "new.mp4", "320" or "sd". This will allow you to use this to change a video or video quality.
 * This callback will not change the video, you should do that by updating your sources scope variable.
 *
 */
angular.module('videogular').directive('videogular', function ($window, VG_STATES, VG_UTILS) {
    return {
        restrict: 'E',
        scope: {
            theme: '=vgTheme',
            autoPlay: '=vgAutoplay',
            vgComplete: '&',
            vgUpdateVolume: '&',
            vgUpdateTime: '&',
            vgUpdateState: '&',
            vgPlayerReady: '&',
            vgChangeSource: '&'
        },
        controller: function ($scope, $timeout) {
            var currentTheme = null;
            var isFullScreenPressed = false;
            var isMetaDataLoaded = false;

            var vgCompleteCallBack = $scope.vgComplete();
            var vgUpdateVolumeCallBack = $scope.vgUpdateVolume();
            var vgUpdateTimeCallBack = $scope.vgUpdateTime();
            var vgUpdateStateCallBack = $scope.vgUpdateState();
            var vgPlayerReadyCallBack = $scope.vgPlayerReady();
            var vgChangeSourceCallBack = $scope.vgChangeSource();

            // PUBLIC $API
            this.videogularElement = null;

            this.clearMedia = function () {
                $scope.API.mediaElement[0].src = '';
            };

            this.onMobileVideoReady = function (evt, target) {
                this.onVideoReady(evt, target, true);
            };

            this.onVideoReady = function (evt, target, avoidDigest) {
                // Here we're in the video scope, we can't use 'this.'
                $scope.API.isReady = true;
                $scope.API.currentState = VG_STATES.STOP;
                if (!avoidDigest) {
                    $scope.$apply();
                }

                isMetaDataLoaded = true;

                if ($scope.vgPlayerReady()) {
                    vgPlayerReadyCallBack = $scope.vgPlayerReady();
                    vgPlayerReadyCallBack($scope.API);
                }

                if ($scope.autoPlay && !VG_UTILS.isMobileDevice() || $scope.API.currentState === VG_STATES.PLAY) {
                    $timeout(function () {
                        $scope.API.play();
                    });
                }
            };

            this.onUpdateTime = function (event) {
                $scope.API.currentTime = VG_UTILS.secondsToDate(event.target.currentTime);
                $scope.API.totalTime = VG_UTILS.secondsToDate(event.target.duration);
                $scope.API.timeLeft = VG_UTILS.secondsToDate(event.target.duration - event.target.currentTime);

                if ($scope.vgUpdateTime()) {
                    vgUpdateTimeCallBack = $scope.vgUpdateTime();
                    vgUpdateTimeCallBack(event.target.currentTime, event.target.duration);
                }

                $scope.$apply();
            };

            this.$on = function () {
                $scope.$on.apply($scope, arguments);
            };

            this.seekTime = function (value, byPercent) {
                var second;
                if (byPercent) {
                    second = value * $scope.API.mediaElement[0].duration / 100;
                    $scope.API.mediaElement[0].currentTime = second;
                }
                else {
                    second = value;
                    $scope.API.mediaElement[0].currentTime = second;
                }

                $scope.API.currentTime = VG_UTILS.secondsToDate(second);
            };

            this.playPause = function () {
                if ($scope.API.mediaElement[0].paused) {
                    this.play();
                }
                else {
                    this.pause();
                }
            };

            this.setState = function (newState) {
                if (newState && newState !== $scope.API.currentState) {
                    if ($scope.vgUpdateState()) {
                        vgUpdateStateCallBack = $scope.vgUpdateState();
                        vgUpdateStateCallBack(newState);
                    }

                    $scope.API.currentState = newState;
                }

                return $scope.API.currentState;
            };

            this.play = function () {
                $scope.API.mediaElement[0].play();
                this.setState(VG_STATES.PLAY);
            };

            this.pause = function () {
                $scope.API.mediaElement[0].pause();
                this.setState(VG_STATES.PAUSE);
            };

            this.stop = function () {
                $scope.API.mediaElement[0].pause();
                $scope.API.mediaElement[0].currentTime = 0;
                this.setState(VG_STATES.STOP);
            };

            this.toggleFullScreen = function () {
                // There is no native full screen support
                if (!angular.element($window)[0].fullScreenAPI) {
                    if ($scope.API.isFullScreen) {
                        $scope.API.videogularElement.removeClass('fullscreen');
                        $scope.API.videogularElement.css('z-index', 0);
                    }
                    else {
                        $scope.API.videogularElement.addClass('fullscreen');
                        $scope.API.videogularElement.css('z-index', VG_UTILS.getZIndex());
                    }

                    $scope.API.isFullScreen = !$scope.API.isFullScreen;
                }
                // Perform native full screen support
                else {
                    if (angular.element($window)[0].fullScreenAPI.isFullScreen()) {
                        if (!VG_UTILS.isMobileDevice()) {
                            document[angular.element($window)[0].fullScreenAPI.exit]();
                        }
                    }
                    else {
                        // On mobile devices we should make fullscreen only the video object
                        if (VG_UTILS.isMobileDevice()) {
                            // On iOS we should check if user pressed before fullscreen button
                            // and also if metadata is loaded
                            if (VG_UTILS.isiOSDevice()) {
                                if (isMetaDataLoaded) {
                                    this.enterElementInFullScreen($scope.API.mediaElement[0]);
                                }
                                else {
                                    isFullScreenPressed = true;
                                    this.play();
                                }
                            }
                            else {
                                this.enterElementInFullScreen($scope.API.mediaElement[0]);
                            }
                        }
                        else {
                            this.enterElementInFullScreen($scope.API.videogularElement[0]);
                        }
                    }
                }
            };

            this.enterElementInFullScreen = function (element) {
                element[angular.element($window)[0].fullScreenAPI.request]();
            };

            this.changeSource = function (newValue) {
                if ($scope.vgChangeSource()) {
                    vgChangeSourceCallBack = $scope.vgChangeSource();
                    vgChangeSourceCallBack(newValue);
                }
            };

            this.setVolume = function (newVolume) {
                if ($scope.vgUpdateVolume()) {
                    vgUpdateVolumeCallBack = $scope.vgUpdateVolume();
                    vgUpdateVolumeCallBack(newVolume);
                }

                $scope.API.mediaElement[0].volume = newVolume;
                $scope.API.volume = newVolume;
            };

            this.updateTheme = function (value) {
                if (currentTheme) {
                    // Remove previous theme
                    var links = document.getElementsByTagName('link');
                    for (var i = 0, l = links.length; i < l; i++) {
                        if (links[i].outerHTML.indexOf(currentTheme) >= 0) {
                            links[i].parentNode.removeChild(links[i]);
                        }
                    }
                }

                if (value) {
                    var headElem = angular.element(document).find('head');
                    headElem.append('<link rel="stylesheet" href="' + value + '">');

                    currentTheme = value;
                }
            };

            this.onStartBuffering = function (event) {
                $scope.API.isBuffering = true;
            };

            this.onStartPlaying = function (event) {
                // Chrome fix: Chrome needs to update the video tag size or it will show a white screen
                event.target.width++;
                event.target.width--;

                $scope.API.isBuffering = false;
            };

            this.onComplete = function (event) {
                if ($scope.vgComplete()) {
                    vgCompleteCallBack = $scope.vgComplete();
                    vgCompleteCallBack();
                }

                $scope.API.setState(VG_STATES.STOP);
                $scope.API.isCompleted = true;
                $scope.$apply();
            };

            // FUNCTIONS NOT AVAILABLE THROUGH API
            $scope.API = this;

            $scope.init = function () {
                $scope.API.isReady = false;
                $scope.API.isCompleted = false;
                $scope.API.currentTime = 0;
                $scope.API.totalTime = 0;
                $scope.API.timeLeft = 0;

                $scope.API.updateTheme($scope.theme);
                $scope.addBindings();

                if (angular.element($window)[0].fullScreenAPI) {
                    document.addEventListener(angular.element($window)[0].fullScreenAPI.onchange, $scope.onFullScreenChange);
                }
            };

            $scope.addBindings = function () {
                $scope.$watch("theme", function (newValue, oldValue) {
                    if (newValue != oldValue) {
                        $scope.API.updateTheme(newValue);
                    }
                });

                $scope.$watch("autoPlay", function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (newValue) {
                            $scope.API.play();
                        }
                    }
                });
            };

            $scope.onFullScreenChange = function (event) {
                $scope.API.isFullScreen = angular.element($window)[0].fullScreenAPI.isFullScreen();
                $scope.$apply();
            };

            // Empty mediaElement on destroy to avoid that Chrome downloads video even when it's not present
            $scope.$on('$destroy', this.clearMedia);

            // Empty mediaElement when router changes
            $scope.$on('$routeChangeStart', this.clearMedia);

            $scope.init();
        },
        link: {
            pre: function (scope, elem, attr, controller) {
                controller.videogularElement = angular.element(elem);
            }
        }
    };
});