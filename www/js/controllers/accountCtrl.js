(function () {
    'use strict';

    angular
        .module('starter')
        .controller('AccountCtrl', AccountCtrl);

    AccountCtrl.$inject = ['$rootScope', '$scope', '$ionicPopup','$location', 'meanData', 'userService']

    function AccountCtrl ($rootScope, $scope, $ionicPopup, $location, meanData, userService) {
        var vm = this;
        vm.user = {};

        meanData.getProfile()
            .success(function(data) {
                vm.user = data;
                $rootScope.userFriends = vm.user.friends;
            })
            .error(function (e) {
                $location.path('/tab/home');
            });

        ////////////////////////////

        // Save the new user data
        vm.changeUser = function () {
            if (vm.user.password !== vm.user.password2) {
                $ionicPopup.alert({
                    title: 'Account-update failed!',
                    template: 'Passwords does not match!'
                });
            } else {
                userService.update(vm.user)
                    .error(function(err){
                        $ionicPopup.alert({
                            title: 'Account-update failed!',
                            template: 'e-mail or Username is already in use!'
                        });
                    })
                    .then(function () {
                        location.reload();
                        $location.path('/tab/account');
                    })
                    .catch(function (e) {
                        console.log(e);
                    });
            }
        }
        // Delete the user
        vm.deleteUser = function() {
            userService.deleteUsers(vm.user)
                .then(function(){
                    location.reload();
                    $location.path('/tab/home');
                })
                .catch(function (e) {
                    console.log(e);
                });
        }

        // Invite user as friend
        $scope.inviteUser = function () {
            var mail = angular.element('#newmail').val();
            var inFriendList = false;
            userService.getEmailUsers(mail)
                .then(function (data) {
                    for(var i=0; i<$rootScope.userFriends.length; i++){
                        var inFriends = $rootScope.userFriends.indexOf(data.data.userName)
                        if(inFriends > -1){
                            inFriendList = true;
                        }
                    }
                    setTimeout(function () {
                        if(inFriendList == false){
                            userService.inviteUser(mail)
                                .then(function (data) {
                                    vm.user.friends.push(data.data.userName)
                                    userService.update(vm.user)
                                        .then(function(){
                                            $ionicPopup.alert({
                                                title: mail + ' added to your friends list!'
                                            });
                                        })
                                })
                        }
                        else{
                            $ionicPopup.alert({
                                title: 'This user is already in your list!'
                            });
                        }
                    },90);
                })
        }
        $scope.friendAccount = function (friend) {
            var param = "/tab/friendaccount/" + friend;
            $location.path(param);
        };
    }
})();