(function () {
    'use strict';

    angular
        .module('starter')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$rootScope', '$ionicPopup', '$location', 'authentication']

    function LoginCtrl ($rootScope, $ionicPopup, $location, authentication) {
        var vm = this;

        vm.credentials = {
            email : "",
            password : ""
        };

        ////////////////////////////

        vm.onSubmit = function () {
            authentication
                .login(vm.credentials)
                .error(function(err){
                    $ionicPopup.alert({
                        title: 'Login failed!',
                        template: 'e-mail or Username false!'
                    });
                })
                .success(function(){
                    $rootScope.loginvar = true;
                    $location.path('/tab/home');
                });
        };
    }
})();