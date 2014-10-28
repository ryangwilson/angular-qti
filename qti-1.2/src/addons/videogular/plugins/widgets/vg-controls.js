angular.module('videogular').directive('vgControls', function ($timeout) {
        return {
            restrict: 'E',
            require: '^videogular',
            transclude: true,
            template: '<div id="controls-container" ng-class="animationClass" ng-transclude></div>',
            scope: {
                autoHide: '=vgAutohide',
                autoHideTime: '=vgAutohideTime'
            },
            link: function (scope, elem, attr, API) {
                var w = 0;
                var h = 0;
                var autoHideTime = 2000;
                var hideInterval;

                function onMouseMove() {
                    if (scope.autoHide) {
                        showControls();
                        scope.$apply();
                    }
                }

                function hideControls() {
                    scope.animationClass = 'hide-animation';
                }

                function showControls() {
                    scope.animationClass = 'show-animation';
                    $timeout.cancel(hideInterval);
                    if (scope.autoHide) hideInterval = $timeout(hideControls, autoHideTime);
                }

                // If vg-autohide has been set
                if (scope.autoHide !== undefined) {
                    scope.$watch('autoHide', function (value) {
                        if (value) {
                            scope.animationClass = 'hide-animation';
                            API.videogularElement.bind('mousemove', onMouseMove);
                        }
                        else {
                            scope.animationClass = '';
                            $timeout.cancel(hideInterval);
                            API.videogularElement.unbind('mousemove', onMouseMove);
                            showControls();
                        }
                    });
                }

                // If vg-autohide-time has been set
                if (scope.autoHideTime != undefined) {
                    scope.$watch("autoHideTime", function (value) {
                        autoHideTime = value;
                    });
                }
            }
        };
    }
);