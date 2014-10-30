/* global angular */
angular.module('app', ['qti', 'qti.plugins.pearsonvue',
    'qti.plugins.videogular',
    //'com.2fdevs.videogular',
    //'com.2fdevs.videogular.plugins.controls',
    //'com.2fdevs.videogular.plugins.overlayplay',
    //'com.2fdevs.videogular.plugins.buffering',
    //'com.2fdevs.videogular.plugins.poster'
]);
angular.module('app').controller('SystemCtrl', function ($scope) {
    function User(data) {

        var getFullName = function () {
            return data.firstName + ' ' + data.lastName;
        };

        this.getFullName = getFullName;

        this.FullName = getFullName();
    }

    this.User = new User({
        firstName: 'Rob',
        lastName: 'Taylor'
    });


    this.getUser = function () {
        return this.User;
    };
});