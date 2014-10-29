/* global angular */
angular.module('app', ['qti', 'qti.plugins.pearsonvue']);
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