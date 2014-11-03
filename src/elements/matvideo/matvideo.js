/* global angular */
angular.module('qti.plugins').directive('matvideo', function ($sce) {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'templates/matvideo.html',
        link: function(scope, el, attrs) {
            console.log('attrs', attrs);
            scope.currentTime = 0;
            scope.totalTime = 0;
            scope.state = null;
            scope.volume = 1;
            scope.isCompleted = false;
            scope.API = null;

            scope.onPlayerReady = function (API) {
                scope.API = API;
            };

            scope.onCompleteVideo = function () {
                scope.isCompleted = true;
            };

            scope.onUpdateState = function (state) {
                scope.state = state;
            };

            scope.onUpdateTime = function (currentTime, totalTime) {
                scope.currentTime = currentTime;
                scope.totalTime = totalTime;
            };

            scope.onUpdateVolume = function (newVol) {
                scope.volume = newVol;
            };

            scope.onUpdateSize = function (width, height) {
                scope.config.width = width;
                scope.config.height = height;
            };

            var config = {};
            config.autoHide = false;
            config.autoHideTime = 3000;
            config.autoPlay = attrs.autoPlay === 'true';
            config.playAvailable = attrs.playAvailable !== 'false';
            config.pauseAvailable = attrs.pauseAvailable !== 'false';
            config.stopAvailable = attrs.stopAvailable !== 'false';
            config.progressAvailable = attrs.progressAvailable !== 'false';
            config.seekAvailable = attrs.seekAvailable !== 'false';
            config.volumeAvailable = attrs.volumeAvailable !== 'false';
            config.sources = [ { src: $sce.trustAsResourceUrl(attrs.uri) + '', type: "video/mp4" } ];
            config.loop = attrs.autoLoop === 'true';
            config.preload = "auto";
            config.transclude = false;
            config.controls = undefined;
            config.theme = {
                url: attrs.themeuri
            };
            config.plugins = {
                poster: {
                    url: attrs.posteruri
                }
            };

            scope.config = config;
            console.log(scope.config);
        }
    };
});
