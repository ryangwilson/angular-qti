angular.module('qti').directive('matimageAddon', function () {
    return {
        scope: true,
        link: function ($scope, $el, $attr) {
            var measureWidth = 0;
            var measureHeight = 0;
            var unitWidth = 'px';
            var unitHeight = 'px';
            //var scaleFactor = $scope.currentScaleFactor || 1;
            var loaded = false;

            var updateImageSize = function () {
                if (loaded && $scope.currentScaleFactor) {
                    $el.css('width', (measureWidth * $scope.currentScaleFactor.factor) + unitWidth);
                    $el.css('height', (measureHeight * $scope.currentScaleFactor.factor) + unitHeight);
                }
            };

            $scope.$on('scalefactor::changed', function (evt) {
                updateImageSize();
            });

            $el.bind('load', function (evt) {
                loaded = true;
                var style = window.getComputedStyle($el[0]);

                measureWidth = style.width.replace(/\D+/i, '');
                unitWidth = style.width.replace(/\d+/i, '');

                measureHeight = style.height.replace(/\D+/i, '');
                unitHeight = style.height.replace(/\d+/i, '');

                updateImageSize();
            });
        }
    }
});