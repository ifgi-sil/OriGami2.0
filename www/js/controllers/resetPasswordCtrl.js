(function () {
    'use strict';

    angular
        .module('starter')
        .controller('ResetPasswordCtrl', ResetPasswordCtrl);

    ResetPasswordCtrl.$inject = ['$ionicPopup','$location', 'userService']

    function ResetPasswordCtrl ($ionicPopup, $location, userService) {
        var vm = this;

        vm.credentials = {
            email : ""
        };

        ////////////////////////////

        vm.onSubmit = function () {
            userService.forgotPassword(vm.credentials.email)
                .error(function(err){
                    $ionicPopup.alert({
                        title: 'Wrong e-mail',
                        template: 'e-mail does not fit to any account!'
                    });
                })
                .success(function(){
                    console.log("success")
                    $location.path('/tab/login');
                });
        };
    }
})();