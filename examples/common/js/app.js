/* global angular */
angular.module('app', ['qti']);
angular.module('app').controller('SystemCtrl', function () {
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