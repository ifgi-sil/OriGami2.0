(function () {
    'use strict';

    angular
        .module('starter')
        .controller('FriendCtrl', FriendCtrl);

    FriendCtrl.$inject = ['$rootScope', '$scope', '$ionicPopup', '$location', 'meanData', 'userService', '$stateParams', 'API']

    function FriendCtrl ($rootScope, $scope, $ionicPopup, $location, meanData, userService, $stateParams, API) {

        var vm = this;
        vm.user = {};

        //////////////////////////////

        $scope.friend = $stateParams.friend;
        meanData.getProfile2($scope.friend)
            .then(function (data) {
                vm.user = data.data;
                console.log(vm.user);
                API.getAll().success(function (data, status, headers, config) {
                    $scope.listprivate = [];
                    $scope.error_msg = null;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].name != null && data[i].private == true) {
                            for (var k = 0; k < data[i].players.length; k++) {
                                if (data[i].players[k] == vm.user.userName) {
                                    $scope.listprivate.push(data[i]);
                                }
                            }
                        }
                    }
                })
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