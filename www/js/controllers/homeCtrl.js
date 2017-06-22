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
                console.log("----------------------");
                console.log("data");
                console.log(data);
                console.log("----------------------");
                console.log("vm.user");
                console.log(vm.user);
                $rootScope.loginvar = true;
            })
            .error(function (e) {
                $location.path('/tab/home');
                $rootScope.loginvar = false;
            });
        console.log("---------------------");
        console.log("$rootScope.loginvar");
        console.log($rootScope.loginvar);

        $scope.logout = function () {
            authentication.logout();
            $rootScope.loginvar = false;
            $location.path('/tab/home');

        }
    }
})();