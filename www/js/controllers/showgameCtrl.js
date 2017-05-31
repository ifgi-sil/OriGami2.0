(function () {
    'use strict';

    angular
        .module('starter')
        .controller('ShowGameCtrl', ShowGameCtrl);

    ShowGameCtrl.$inject = ['$scope', 'userService', '$stateParams']

    function ShowGameCtrl ($scope, userService, $stateParams) {

        var vm = this;
        vm.game = {};

        $scope.gameid = $stateParams.id;
        userService.getGame($scope.gameid)
            .success(function(data){
                console.log(data);
                vm.game = data;

            })
    }
})();