(function () {
    'use strict';

    angular
        .module('starter')
        .controller('AccountCtrl', AccountCtrl);

    AccountCtrl.$inject = ['$rootScope', '$scope', '$ionicPopup','$location', 'meanData', 'userService', 'API']

    function AccountCtrl ($rootScope, $scope, $ionicPopup, $location, meanData, userService, API) {
        var vm = this;
        vm.user = {};

        meanData.getProfile()
            .success(function(data) {
                vm.user = data;
                $rootScope.userFriends = vm.user.friends;
                $scope.currentUser = data.userName
            })
            .error(function (e) {
                $location.path('/tab/home');
            });

        ////////////////////////////

        API.getAll().success(function (data, status, headers, config) {
            $scope.listprivate = [];
            $scope.error_msg = null;
            for (var i = 0; i < data.length; i++) {
                if (data[i].name != null && data[i].private == true) {
                    for (var k = 0; k < data[i].players.length; k++) {
                        if (data[i].players[k] == $scope.currentUser) {
                            $scope.listprivate.push(data[i]);
                        }
                    }
                }
            }
        })

        $scope.showGame = function(id){
            var param = "/tab/showgame/" + id;
            $location.path(param);
        }

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
                                    vm.user.friends.push(data.data.userName);
                                    data.data.friends.push(vm.user.userName);
                                    userService.update(vm.user)
                                        .then(function(){
                                            userService.updateFriendPush(data.data)
                                                .then(function(){
                                                    $ionicPopup.alert({
                                                        title: mail + ' added to your friends list!'
                                                    });
                                                })
                                        })
                                })
                        }
                        else{
                            $ionicPopup.alert({
                                title: 'This user is already in your list!'
                            });
                        }
                    },200);
                })
        }
        $scope.friendAccount = function (friend) {
            var param = "/tab/friendaccount/" + friend;
            $location.path(param);
        };

        $scope.openNavFriend = function() {
            document.getElementById("SidenavFriend").style.width = "250px";
        }

        $scope.closeNavFriend = function() {
            document.getElementById("SidenavFriend").style.width = "0";
        }

        $scope.openNavGame = function() {
            document.getElementById("SidenavGame").style.width = "250px";
        }

        $scope.closeNavGame = function() {
            document.getElementById("SidenavGame").style.width = "0";
        }
    }
})();