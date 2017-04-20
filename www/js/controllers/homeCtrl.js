(function () {
    'use strict';

    angular
        .module('starter')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', '$rootScope', '$location', 'authentication', 'meanData']

    function HomeCtrl ($scope, $rootScope, $location, authentication, meanData) {

        var vm = this;
        vm.user = {};

        meanData.getProfile()
            .success(function(data) {
                vm.user = data;
                $rootScope.loginvar = true;
            })
            .error(function (e) {
                $location.path('/tab/home');
                $rootScope.loginvar = false;
            });

        $scope.logout = function () {
            authentication.logout();
            $rootScope.loginvar = false;
            $location.path('/tab/home');

        }
    }
})();