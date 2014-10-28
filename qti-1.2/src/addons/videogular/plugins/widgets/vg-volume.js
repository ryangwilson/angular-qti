angular.module('videogular').directive('vgVolume', function (VG_UTILS) {
    return {
        restrict: 'E',
        link: function (scope, elem, attr) {
            function onMouseOverVolume() {
                scope.volumeVisibility = 'visible';
                scope.$apply();
            }

            function onMouseLeaveVolume() {
                scope.volumeVisibility = 'hidden';
                scope.$apply();
            }

            // We hide volume controls on mobile devices
            if (VG_UTILS.isMobileDevice()) {
                elem.css('display', 'none');
            }
            else {
                scope.volumeVisibility = 'hidden';

                elem.bind('mouseover', onMouseOverVolume);
                elem.bind('mouseleave', onMouseLeaveVolume);
            }
        }
    };
});