angular.module('starter').controller('statController', ['$scope', '$rootScope', '$cordovaGeolocation', '$stateParams', '$ionicModal', '$ionicLoading', '$timeout', 'leafletData', '$translate', 'PathData',function ($scope, $rootScope, $cordovaGeolocation, $stateParams, $ionicModal, $ionicLoading, $timeout, leafletData, $translate, PathData) {

      
       /* Initialize view of map */
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
                  // PATH DATA VISUALIZED 
                p1: {
                    color: '#008000',
                    weight: 5,
                    latlngs: PathData.getPath()
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

   }]);