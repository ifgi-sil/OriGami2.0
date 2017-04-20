angular.module('starter').controller('aidController', ['$scope', '$ionicModal',
    function (
        $scope,
        $ionicModal
      ) {
        $scope.map = {

            center: {
                autoDiscover: true,
                zoom: 16
            },

            defaults: {
                tileLayer: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                maxZoom: 18,
                zoomControlPosition: 'topleft',
                lat: 57,
                lng: 8

            },
            layers: {
                baselayers: {
                    osm: {
                        name: 'Satelite View',
                        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                        type: 'xyz',
                        top: true,
                        layerOptions: {
                            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                            continuousWorld: false
                        }
                    },
                    streets: {
                        name: 'Streets View',
                        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz',
                        top: false,
                    },
                    topographic: {
                        name: 'Topographic View',
                        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
                        type: 'xyz',
                        top: false,
                        layerOptions: {
                            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
                            continuousWorld: false
                        }
                    }
                }
            },

            geojson: {},
            markers: {},
            events: {
                map: {
                    enable: ['context'],
                    logic: 'emit'
                }
            },
        };


        $scope.map.markers = new Array();

        /**
         * Add Waypoint with modal
         */
        $scope.$on('leafletDirectiveMap.contextmenu', function (event, locationEvent) {
            var Waypoint = function () {
                this.lat = "";
                this.lng = "";
                this.name = "";
            };

            $scope.newWaypoint = new Waypoint();
            $scope.newWaypoint.lat = locationEvent.leafletEvent.latlng.lat;
            $scope.newWaypoint.lng = locationEvent.leafletEvent.latlng.lng;;
        });


        $ionicModal.fromTemplateUrl('templates/map/waypoint.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });


        $scope.saveWayPoint = function () {
            $scope.map.markers.push($scope.newWaypoint);
            $scope.modal.remove();
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.removeMarkers = function () {
            $scope.modal.remove();
        };


    }]);