angular.module('videogular').directive('vgScrubbar', function (VG_STATES, VG_UTILS) {
    return {
        restrict: 'AE',
        require: '^videogular',
        transclude: true,
        template: '<div role="slider" aria-valuemax="{{ariaTime(API.totalTime)}}" \
                aria-valuenow="{{ariaTime(API.currentTime)}}" \
                aria-valuemin="0" aria-label="Time scrub bar" tabindex="0" \
                ng-transclude ng-keydown="onScrubBarKeyDown($event)"></div>',
        link: function (scope, elem, attr, API) {
            var isSeeking = false;
            var isPlaying = false;
            var isPlayingWhenSeeking = false;
            var touchStartX = 0;
            var LEFT = 37;
            var RIGHT = 39;
            var NUM_PERCENT = 1;

            scope.API = API;
            scope.ariaTime = function (time) {
                return (time === 0) ? '0' : Math.round(time.getTime() / 1000);
            };

            function onScrubBarTouchStart(event) {
                var touches = event.touches;
                var touchX;

                if (VG_UTILS.isiOSDevice()) {
                    touchStartX = (touches[0].clientX - event.layerX) * -1;
                }
                else {
                    touchStartX = event.layerX;
                }

                touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;

                isSeeking = true;
                if (isPlaying) {
                    isPlayingWhenSeeking = true;
                }
                API.pause();
                seekTime(touchX * API.mediaElement[0].duration / elem[0].scrollWidth);

                scope.$apply();
            }

            function onScrubBarTouchEnd(event) {
                if (isPlayingWhenSeeking) {
                    isPlayingWhenSeeking = false;
                    API.play();
                }
                isSeeking = false;

                scope.$apply();
            }

            function onScrubBarTouchMove(event) {
                var touches = event.touches;
                var touchX;

                if (isSeeking) {
                    touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;
                    seekTime(touchX * API.mediaElement[0].duration / elem[0].scrollWidth);
                }

                scope.$apply();
            }

            function onScrubBarTouchLeave(event) {
                isSeeking = false;

                scope.$apply();
            }

            function onScrubBarMouseDown(event) {
                event = VG_UTILS.fixEventOffset(event);

                isSeeking = true;
                if (isPlaying) isPlayingWhenSeeking = true;
                API.pause();
                seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);

                scope.$apply();
            }

            function onScrubBarMouseUp(event) {
                event = VG_UTILS.fixEventOffset(event);

                if (isPlayingWhenSeeking) {
                    isPlayingWhenSeeking = false;
                    API.play();
                }
                isSeeking = false;
                seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);

                scope.$apply();
            }

            function onScrubBarMouseMove(event) {
                if (isSeeking) {
                    event = VG_UTILS.fixEventOffset(event);
                    seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);
                }

                scope.$apply();
            }

            function onScrubBarMouseLeave(event) {
                isSeeking = false;

                scope.$apply();
            }

            scope.onScrubBarKeyDown = function (event) {
                var currentPercent = API.currentTime.getTime() / API.totalTime.getTime() * 100;

                if (event.which === LEFT || event.keyCode === LEFT) {
                    API.seekTime(currentPercent - NUM_PERCENT, true);
                    event.preventDefault();
                }
                else if (event.which === RIGHT || event.keyCode === RIGHT) {
                    API.seekTime(currentPercent + NUM_PERCENT, true);
                    event.preventDefault();
                }
            };

            function seekTime(time) {
                API.seekTime(time, false);
            }

            function setState(newState) {
                if (!isSeeking) {
                    switch (newState) {
                        case VG_STATES.PLAY:
                            isPlaying = true;
                            break;

                        case VG_STATES.PAUSE:
                            isPlaying = false;
                            break;

                        case VG_STATES.STOP:
                            isPlaying = false;
                            break;
                    }
                }
            }

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

            // Touch move is really buggy in Chrome for Android, maybe we could use mouse move that works ok
            if (VG_UTILS.isMobileDevice()) {
                elem.bind('touchstart', onScrubBarTouchStart);
                elem.bind('touchend', onScrubBarTouchEnd);
                elem.bind('touchmove', onScrubBarTouchMove);
                elem.bind('touchleave', onScrubBarTouchLeave);
            }
            else {
                elem.bind('mousedown', onScrubBarMouseDown);
                elem.bind('mouseup', onScrubBarMouseUp);
                elem.bind('mousemove', onScrubBarMouseMove);
                elem.bind('mouseleave', onScrubBarMouseLeave);
            }
        }
    };
});