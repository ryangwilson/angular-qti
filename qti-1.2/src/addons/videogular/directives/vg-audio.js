angular.module('videogular').directive("vgAudio", function ($compile, VG_UTILS) {
    return {
        restrict: 'E',
        require: '^videogular',
        scope: {
            vgSrc: '=',
            vgLoop: '=',
            vgPreload: '=',
            vgNativeControls: '=',
            vgTracks: '='
        },
        link: function (scope, elem, attr, API) {
            var audioTagText = '<audio vg-source="vgSrc" ';

            audioTagText += '></audio>';

            API.mediaElement = angular.element(audioTagText);
            var compiled = $compile(API.mediaElement)(scope);

            API.mediaElement[0].addEventListener('loadedmetadata', API.onVideoReady, false);
            API.mediaElement[0].addEventListener('waiting', API.onStartBuffering, false);
            API.mediaElement[0].addEventListener('ended', API.onComplete, false);
            API.mediaElement[0].addEventListener('playing', API.onStartPlaying, false);
            API.mediaElement[0].addEventListener('timeupdate', API.onUpdateTime, false);

            elem.append(compiled);

            if (VG_UTILS.isMobileDevice()) {
                API.mediaElement[0].removeEventListener('loadedmetadata', API.onVideoReady, false);
                API.onMobileVideoReady();
            }
        }
    };
});