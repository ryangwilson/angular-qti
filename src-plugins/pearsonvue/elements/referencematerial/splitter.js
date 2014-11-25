/* global angular */
angular.module('qti').directive('splitter', function () {
    return {
        template: '<div class="splitter-handle"></div>',
        link: function ($scope, $el, $attr) {

            var px = 'px';
            var parentContainer = $el[0].parentNode;
            var presentationContainer = parentContainer.parentNode;
            var dragInit = false;

            var onDragMove = function (instance, event, pointer) {
                dragInit = true;
                parentContainer.style.width = instance.position.x + px;
            };

            var onResize = function () {
                if (!dragInit) {
                    $el.css('left', $el[0].parentNode.clientWidth + px);
                }
            };

            var draggie = new Draggabilly($el[0], {
                axis: 'x',
                containment: presentationContainer
            });

            draggie.on('dragMove', onDragMove);

            setTimeout(function () {
                $el.css('left', $el[0].parentNode.clientWidth + px);
            });

            window.addEventListener('resize', onResize);
        }
    };
});