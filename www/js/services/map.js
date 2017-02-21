(function () {
	'use strict';

	angular
		.module('starter.services')
		.factory('MapService', MapService);

	MapService.$inject = [];

	function MapService () {
		/* Map Routine ------------------- */
		let mainMap = {
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

		    markers: [],
		    events: {
		        /* map: {
		             enable: ['context'],
		             logic: 'emit'
		         }*/
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

		return mainMap;
	}
})();