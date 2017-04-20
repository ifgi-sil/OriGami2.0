(function () {
    'use strict';

    angular
        .module('starter')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$rootScope', '$scope', '$ionicPopup', '$ionicHistory', '$state', '$location', 'authentication']

    function LoginCtrl ($rootScope, $scope, $ionicPopup, $ionicHistory, $state, $location, authentication) {
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