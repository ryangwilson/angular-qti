angular.module('videogular').directive('vgSource', function () {
    return {
        restrict: 'A',
        link: {
            pre: function (scope, elem, attr) {
                var sources;
                var canPlay;

                function changeSource() {
                    canPlay = '';

                    // It's a cool browser
                    if (elem[0].canPlayType) {
                        for (var i = 0, l = sources.length; i < l; i++) {
                            canPlay = elem[0].canPlayType(sources[i].type);

                            if (canPlay === 'maybe' || canPlay === 'probably') {
                                elem.attr('src', sources[i].src);
                                elem.attr('type', sources[i].type);
                                break;
                            }
                        }
                    }
                    // It's a crappy browser and it doesn't deserve any respect
                    else {
                        // Get H264 or the first one
                        elem.attr('src', sources[0].src);
                        elem.attr('type', sources[0].type);
                    }

                    if (canPlay === '') {
                        // Throw error
                    }
                }

                scope.$watch(attr.vgSource, function (newValue, oldValue) {
                    if ((!sources || newValue !== oldValue) && newValue) {
                        sources = newValue;
                        //API.sources = sources;
                        changeSource();
                    }
                });
            }
        }
    };
});