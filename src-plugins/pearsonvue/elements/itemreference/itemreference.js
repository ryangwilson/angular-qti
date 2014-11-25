/* global angular */
angular.module('qti').directive('pearsonvueItemreference', function ($compile, helpers) {

    return {
        link: function ($scope, $el, $attr) {
            var itemEl = document.querySelector('[ident="' + $attr.ident + '"');
            var contentHTML = itemEl.innerHTML;

            itemEl.parentNode.removeChild(itemEl);

            //console.log('attr', $attr.ident);

            //console.log('xml', helpers.xmlToStr(xml));

            var el = angular.element(contentHTML);
            //
            //compile the view into a function.
            var compiled = $compile(el);

            //append our view to the element of the directive.
            //$el.append(el);
            //$el[0].parentNode.insertAdjacentHTML('afterend', el);
            angular.element($el[0].parentNode.parentNode).append(el);

            //bind our view to the scope!
            //(try commenting out this line to see what happens!)
            compiled($scope);
        }
    };
});