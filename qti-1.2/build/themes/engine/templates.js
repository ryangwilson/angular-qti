angular.module('qti').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/video.html',
    "<div class=qti-video><videogular vg-player-ready=onPlayerReady vg-complete=onCompleteVideo vg-update-time=onUpdateTime vg-update-volume=onUpdateVolume vg-update-state=onUpdateState vg-theme=config.theme.url vg-autoplay=config.autoPlay><vg-video vg-src=config.sources vg-tracks=config.tracks vg-loop=config.loop vg-preload=config.preload vg-native-controls=config.controls></vg-video><vg-controls vg-autohide=config.autoHide vg-autohide-time=config.autoHideTime><vg-play-pause-button></vg-play-pause-button><vg-timedisplay>{{ currentTime | date:'mm:ss' }}</vg-timedisplay><vg-scrubbar><vg-scrubbarcurrenttime></vg-scrubbarcurrenttime></vg-scrubbar><vg-timedisplay>{{ timeLeft | date:'mm:ss' }}</vg-timedisplay><vg-volume><vg-mutebutton></vg-mutebutton><vg-volumebar></vg-volumebar></vg-volume><vg-fullscreenbutton></vg-fullscreenbutton></vg-controls><vg-poster-image vg-url=config.plugins.poster.url></vg-poster-image><vg-buffering></vg-buffering><vg-overlay-play vg-play-icon=config.theme.playIcon></vg-overlay-play></videogular></div>"
  );

}]);
