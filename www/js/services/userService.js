(function () {
    'use strict';

    angular
        .module('starter.services')
        .factory('userService', userService)
        .value('Server', 'ORIGAMI_API_URL');

    userService.$inject = ['$http', 'authentication','Server'];

    function userService ($http, authentication, Server) {
        var base = Server;
        function update(user) {
            return $http.post(base + '/profileUpdate', user, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }})
        };
        function updateFriendPush (user){
            return $http.post(base + '/newFriendUpdate', user)
        }
        function updateFriend(user){
            return $http.post(base + '/friendUpdate', user)
        }

        function deleteUsers(user) {
            return $http.post(base + '/profileDelete', user, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }})
        };

        function inviteUser(email){
            return $http.get(base + '/inviteUser/' + email)
        };

        function friendUser(userName){
            return $http.get(base + '/friendUser/' + userName)
        };

        var friendID;

        function setFriendID(value){
            friendID = value;
        };

        function getFriendID(){
            return friendID;
        };
        function getEmailUsers(email) {
            return $http.get(base + '/profileSearch/' + email, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }});

        };
        function getGame(id){
            return $http.get(base + '/getShowGame/' + id)
        };

        return {
            update : update,
            updateFriendPush : updateFriendPush,
            deleteUsers : deleteUsers,
            setFriendlID: setFriendID,
            getFriendID: getFriendID,
            inviteUser: inviteUser,
            friendUser: friendUser,
            updateFriend: updateFriend,
            getEmailUsers:getEmailUsers,
            getGame:getGame
        };
    }
})();