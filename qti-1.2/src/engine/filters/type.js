/* global angular */
angular.module('qti').filter('type', function () {
    return function (value) {
        switch (value) {
            case 'multiple':
                return 'Matching';
        }

        return 'One Correct Option';
    };
});