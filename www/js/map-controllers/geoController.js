angular.module('starter').controller("GeoCtrl", function($rootScope,$scope, API, $window, $timeout, $ionicPopup,$ionicHistory){
  $scope.metersToPixels = function(meters) {
    // http://wiki.openstreetmap.org/wiki/Zoom_levels
    // S=C*cos(y)/2^(z+8)
    // circumference of earth in meters
    C = 40075017
    zoom = $scope.map.center.zoom
    y = $scope.position.coords.latitude
    // input for cosine function has to be converted in radians first
    distOnePixelInMeters = C*Math.cos(y*(Math.PI / 180))/Math.pow(2,(zoom+8))
    return (meters/distOnePixelInMeters)
  }
  
  /* Show info popup for the Path planning task
  $scope.showPathInfo = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Path Planning',
     template: 'Navigators have to plan a path to reach the destination. They refer to the survey knowledge they already have available, combine it in new ways and possibly make inferences about missing pieces. Requires more cognitive effort.'
   });
 };
    // Show info popup for the Aided Navigation task
    $scope.showAidInfo = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Aided navigation',
     template: 'Navigators follow a trail to the destination. Less cognitive effort.'
   });
 };*/
    
    /* Get back in the history
    $scope.submitPoint = function(){
        $ionicHistory.goBack();
        console.log($scope.map.markers);
        
            var form = {
                name: $scope.map.markers[0].name,
                Description: $scope.map.markers[0].description,
                lon: $scope.map.markers[0].lon,
                lat: $scope.map.markers[0].lat,
                created: Date.now(),
            };
 
            API.saveItem(form)
                .success(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.doRefresh(1);
                })
                .error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });
    };*/
    
    
});