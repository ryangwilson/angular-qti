angular.module('qti').directive('firstlineindent', function () {
    return {
        restrict: 'A',
        link: function ($scope, $el, $attr) {
            var mattexts, str, i, len;
            str = '';
            len = parseInt($attr.firstlineindent, 10);
            for (i = 0; i < len; i += 1) {
                str += '&nbsp;';
            }
            mattexts = $el[0].querySelectorAll('mattext:not([fli]');
            len = mattexts.length;
            for (i = 0; i < len; i += 1) {
                if (!mattexts[i].getAttribute('firstlineindent')) {
                    mattexts[i].innerHTML = str + mattexts[i].innerHTML;
                    mattexts[i].setAttribute('fli', '');
                }
            }
        }
    }
});