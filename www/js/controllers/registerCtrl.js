(function () {
    'use strict';

    angular
        .module('starter')
        .controller('RegisterCtrl', RegisterCtrl);

    RegisterCtrl.$inject = ['$scope', '$rootScope', '$ionicPopup', '$location', 'authentication']

    function RegisterCtrl ($scope, $rootScope, $ionicPopup, $location, authentication) {
        var vm = this;

        // Register the new user
        vm.credentials = {
            firstName: "",
            lastName: "",
            email: "",
            userName: "",
            password: "",
            password2: "",
            birthday: "",
            info: "",
            registrDate: ""
        };

        //////////////////////////

        vm.onSubmit = function () {
            if (vm.credentials.password !== vm.credentials.password2) {
                $ionicPopup.alert({
                    title: 'Passwords do not match!'
                });
            } else {
                authentication
                    .register(vm.credentials)
                    .error(function (err) {
                        $ionicPopup.alert({
                            title: 'Register failed!',
                            template: 'e-mail or Username already in use!'
                        });
                    })
                    .success(function () {
                        $rootScope.loginvar = true;
                        $location.path('/tab/home');
                    });
            }
        };
    }
})();