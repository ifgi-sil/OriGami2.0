(function () {
    'use strict';

    angular
        .module('starter')
        .controller('FriendCtrl', FriendCtrl);

    FriendCtrl.$inject = ['$rootScope', '$scope', '$ionicPopup', '$location', 'meanData', 'userService', '$stateParams']

    function FriendCtrl ($rootScope, $scope, $ionicPopup, $location, meanData, userService, $stateParams) {

        var vm = this;
        vm.user = {};

        //////////////////////////////

        $scope.friend = $stateParams.friend;
        meanData.getProfile2($scope.friend)
            .then(function (data) {
                vm.user = data.data;
                if(vm.user == null){
                    meanData.getProfile()
                        .success(function(data) {
                            vm.user2 = data;
                            $rootScope.loginUser = vm.user2.email;
                            var confirmPopup = $ionicPopup.confirm({
                                title: 'User is deleted',
                                template: 'Do you want to remove this user from your friends list?'
                            });
                            confirmPopup
                                .then(function(res) {
                                    if(res) {
                                        var index = vm.user2.friends.indexOf($scope.friend)
                                        vm.user2.friends.splice(index, 1);
                                        userService
                                            .update(vm.user2)
                                            .then(function(){
                                                location.reload();
                                                $location.path("/tab/account")
                                            })
                                    }
                            });
                        })
                }
            })
        $scope.deleteFriend = function () {
            meanData.getProfile()
                .success(function(data) {
                    vm.user2 = data;
                    $rootScope.loginUser = vm.user2.email;
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Do you really want to delete this user as a friend?',
                    });
                    confirmPopup
                        .then(function(res) {
                            if(res) {
                                var index = vm.user2.friends.indexOf($scope.friend)
                                vm.user2.friends.splice(index, 1)
                                userService
                                    .update(vm.user2)
                                    .then(function(){
                                        location.reload();
                                        $location.path("/tab/account")
                                    })
                            }
                    });
                })
        }
        $scope.friendAccount = function (friend) {
            var param = "/tab/friendaccount/" + friend;
            $location.path(param);
        };
        $scope.openNavFriend = function() {
            console.log("friend")
            document.getElementById("SidenavFriends").style.width = "250px";
        }

        $scope.closeNavFriend = function() {
            document.getElementById("SidenavFriends").style.width = "0";
        }

        $scope.openNavGame = function() {
            console.log("game")
            document.getElementById("SidenavGames").style.width = "250px";
        }

        $scope.closeNavGame = function() {
            document.getElementById("SidenavGames").style.width = "0";
        }
        $scope.showGame = function(id){
            var param = "/tab/showgame/" + id;
            $location.path(param);
        }
    }
})();