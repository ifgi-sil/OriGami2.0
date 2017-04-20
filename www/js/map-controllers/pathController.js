angular.module('starter').controller('pathController', ['$scope', '$ionicModal',
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

            geojson: {},

            paths: {
                userPos: {
                    type: 'circleMarker',
                    color: '#2E64FE',
                    weight: 2,
                    radius: 1,
                    opacity: 0.0,
                    clickable: false,
                    latlngs: {
                        lat: 52,
                        lng: 7
                    }
                },
                userPosCenter: {
                    type: 'circleMarker',
                    color: '#2E64FE',
                    fill: true,
                    radius: 3,
                    opacity: 0.0,
                    fillOpacity: 1.0,
                    clickable: false,
                    updateTrigger: true,
                    latlngs: {
                        lat: 52,
                        lng: 7
                    }
                }
            },

            markers: {},
            events: {
                map: {
                    enable: ['context'],
                    logic: 'emit'
                }
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
            }
        };


        $scope.map.markers = new Array();


        var Waypoint = function () {
            if (!(this instanceof Waypoint)) return new Waypoint();
            this.lat = "";
            this.lng = "";
            this.name = "";
        };

        $ionicModal.fromTemplateUrl('templates/map/waypoint.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        /**
         * Add Waypoint with modal
         */
        $scope.$on('leafletDirectiveMap.contextmenu', function (event, locationEvent) {
            $scope.newWaypoint = new Waypoint();
            $scope.newWaypoint.lat = locationEvent.leafletEvent.latlng.lat;
            $scope.newWaypoint.lng = locationEvent.leafletEvent.latlng.lng;;
            $scope.modal.show();
        });

        $scope.saveWaypoint = function () {
            console.log("name: " + $scope.newWaypoint.name);
            console.log("esc: " + $scope.newWaypoint.description);

            if (($scope.newWaypoint.name == "" || $scope.newWaypoint.name == undefined) || ($scope.newWaypoint.description == undefined || $scope.newWaypoint.description == "")) {

                if ($scope.newWaypoint.name == "" || $scope.newWaypoint.name == undefined) {
                    $scope.name_border = "red";
                } else {
                    $scope.name_border = "";
                }

                if ($scope.newWaypoint.description == undefined || $scope.newWaypoint.description == "") {
                    $scope.description_border = "red";
                } else {
                    $scope.description_border = "";
                }
            } else {
                $scope.name_border = "";
                $scope.description_border = "";

                $scope.map.markers.push($scope.newWaypoint);
                $scope.modal.hide();
            }
        };

        $scope.savePoint = function () {
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