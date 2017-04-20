(function () {
    'use strict';

    angular
        .module('starter')
        .controller('choosecreategameCtrl', choosecreategameCtrl);

    choosecreategameCtrl.$inject = ['$scope', '$location', '$ionicPopup', 'meanData']

    function choosecreategameCtrl ($scope, $location, $ionicPopup, meanData) {
        var vm = this;
        vm.user = {};
        
        $scope.choosePrivate = function(){
            meanData.getProfile()
                .success(function(data) {
                    $location.path('/tab/createprivategame');
                })
                .error(function (e) {
                    $ionicPopup.alert({
                        title: 'Login needed!',
                        template: 'You need to register or login to create a private game!'
                    });
                });
        }
    }
})();