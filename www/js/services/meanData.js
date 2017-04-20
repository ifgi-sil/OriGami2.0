(function () {
    'use strict';

    angular
        .module('starter.services')
        .factory('meanData', meanData)
        .value('Server', 'http://localhost:5000');

    meanData.$inject = ['$http', 'authentication','Server'];

    function meanData ($http, authentication, Server) {
        var base = Server;
        var getProfile = function () {
            return $http.get(base + '/profile', {
                headers: {
                    Authorization: 'Bearer '+ authentication.getToken()
                }
            });
        };

        var getProfile2 = function(username) {
            return $http.get(base + '/profile/' + username);
        };


        return {
            getProfile : getProfile,
            getProfile2: getProfile2,
        };
    }
})();