(function () {
    'use strict';

    angular
        .module('starter.services')
        .factory('authentication', authentication)
        .value('Server', 'API_URL');

    authentication.$inject = ['$http', '$window','Server'];

    function authentication ($http, $window, Server) {
        var base = Server;
        var saveToken = function (token) {
            $window.localStorage['mean-token'] = token;
        };

        var getToken = function () {
            return $window.localStorage['mean-token'];
        };

        var isLoggedIn = function() {
            var token = getToken();
            var payload;

            if(token){
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        var currentUser = function() {
            if(isLoggedIn()){
                var token = getToken();
                var payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return {
                    firstName : payload.firstName,
                    lastName : payload.lastName,
                    email : payload.email,
                    userName : payload.userName
                };
            }
        };

        var register = function(user) {
            return $http.post(base + '/register', user)
                .success(function(data){
                    console.log("success");
                    saveToken(data.token);
            });
        };

        var login = function(user) {
            return $http.post(base + '/login', user)
                .success(function(data) {
                    console.log("loginsuccess")
                    saveToken(data.token);
            });
        };

        var logout = function() {
            $window.localStorage.removeItem('mean-token');
        };

        return {
            currentUser : currentUser,
            saveToken : saveToken,
            getToken : getToken,
            isLoggedIn : isLoggedIn,
            register : register,
            login : login,
            logout : logout
        };

    }
})();