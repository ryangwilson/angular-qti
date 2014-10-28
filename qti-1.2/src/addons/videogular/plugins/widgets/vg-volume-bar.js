angular.module('videogular').directive('vgVolumebar', function (VG_UTILS) {
    return {
        restrict: 'E',
        require: '^videogular',
        template: '<div class="verticalVolumeBar">\
            <div class="volumeBackground" ng-click="onClickVolume($event)" ng-mousedown="onMouseDownVolume()" ng-mouseup="onMouseUpVolume()" ng-mousemove="onMouseMoveVolume($event)" ng-mouseleave="onMouseLeaveVolume()">\
            <div class="volumeValue"></div>\
            <div class="volumeClickArea"></div>\
            </div>\
            </div>',
        link: function (scope, elem, attr, API) {
            var isChangingVolume = false;
            var volumeBackElem = angular.element(elem[0].getElementsByClassName('volumeBackground'));
            var volumeValueElem = angular.element(elem[0].getElementsByClassName('volumeValue'));

            scope.onClickVolume = function onClickVolume(event) {
                event = VG_UTILS.fixEventOffset(event);
                var volumeHeight = parseInt(volumeBackElem.prop('offsetHeight'));
                var value = event.offsetY * 100 / volumeHeight;
                var volValue = 1 - (value / 100);

                API.setVolume(volValue);
            };

            scope.onMouseDownVolume = function onMouseDownVolume() {
                isChangingVolume = true;
            };

            scope.onMouseUpVolume = function onMouseUpVolume() {
                isChangingVolume = false;
            };

            scope.onMouseLeaveVolume = function onMouseLeaveVolume() {
                isChangingVolume = false;
            };

            scope.onMouseMoveVolume = function onMouseMoveVolume(event) {
                if (isChangingVolume) {
                    event = VG_UTILS.fixEventOffset(event);
                    var volumeHeight = parseInt(volumeBackElem.prop('offsetHeight'));
                    var value = event.offsetY * 100 / volumeHeight;
                    var volValue = 1 - (value / 100);

                    API.setVolume(volValue);
                }
            };

            function updateVolumeView(value) {
                value = value * 100;
                volumeValueElem.css('height', value + '%');
                volumeValueElem.css('top', (100 - value) + '%');
            }

            function onChangeVisibility(value) {
                elem.css('visibility', value);
            }

            elem.css('visibility', scope.volumeVisibility);

            scope.$watch('volumeVisibility', onChangeVisibility);

            scope.$watch(
                function () {
                    return API.volume;
                },
                function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        updateVolumeView(newVal);
                    }
                }
            );
        }
    };
});