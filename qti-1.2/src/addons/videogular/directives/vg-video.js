/* global angular */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.vgVideo
 * @restrict E
 * @description
 * Directive to add a source of videos. This directive will create a &lt;video&gt; tag and usually will be above plugin tags.
 *
 * You can customize `vgVideo` with these attributes:
 *
 * @param {array} vgSrc Bindable array with a list of video sources. A video source is an object with two properties `src` and `type`. The `src` property must contains a trusful url resource.
 * {src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"}
 * **This parameter is required.**
 *
 * @param {boolean} [vgLoop=false] vgLoop Boolean value or scope variable name to auto start playing video when it is initialized.
 * @param {string} [vgPreload=false] vgPreload String value or scope variable name to set how to preload the video. **This parameter is disabled in mobile devices** because user must click on content to start data preload.
 * @param {boolean} [vgNativeControls=false] vgNativeControls String value or scope variable name to set native controls visible.
 * @param {array} [vgTracks=false] vgTracks Bindable array with a list of subtitles sources. A track source is an object with five properties: `src`, `kind`, `srclang`, `label` and `default`.
 * {src: "assets/subs/pale-blue-dot.vtt", kind: "subtitles", srclang: "en", label: "English", default: "true/false"}
 *
 */
angular.module('videogular').directive('vgVideo', function ($compile, VG_UTILS) {
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
            var videoTagText = '<video vg-source="vgSrc" ';

            videoTagText += '></video>';

            API.mediaElement = angular.element(videoTagText);
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