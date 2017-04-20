angular.module('starter').controller('leadersController', ['$scope', '$ionicModal', '$timeout', 'API',
   function ($scope, $ionicModal, $timeout, API) {

      
       $scope.onTabSelected = function(){
           console.log("asdga");
       }
       
        $scope.players = [];
       
       
        API.getAll().success(function (data, status, headers, config) {

            for (var i = 0; i < data.length; i++) {
                if (data[i].players != undefined && data[i].players.length > 0) {
                    for (var d = 0; d < data[i].players.length; d++) {

                        var isFound = false;
                        for (var p = 0; p < $scope.players.length; p++) {
                            if($scope.players[p].name == data[i].players[d].name){
                                $scope.players[p].points += data[i].players[d].points;
                                isFound = true;
                                break;
                            } 
                        }
                        
                        if(!isFound){
                            $scope.players.push(data[i].players[d]);
                        }
                        
                    }
                }
            }
        }).error(function (data, status, headers, config) {
            $rootScope.notify(
                $translate.instant('oops_wrong'));
        });

   }]);