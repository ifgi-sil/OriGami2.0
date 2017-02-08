(function () {
	'use strict';

	angular
		.module('starter')
		.controller('GameCreationController', GameCreationController);

	GameCreationController.$inject = ['$scope', '$ionicHistory', '$ionicSlideBoxDelegate', '$ionicModal', 'MapService'];

	function GameCreationController ($scope, $ionicHistory, $ionicSlideBoxDelegate, $ionicModal, MapService) {
		var vm = this;
		vm.newgame = {}; // General description of the game
		vm.newWaypoint = {}; // Waypoint Object
		vm.abort = abort;
		vm.invalidForm = true;
		vm.invalidWaypointForm = true;
		vm.act_type = 0;
		vm.previousSlide = previousSlide;
		vm.nextSlide = nextSlide;
		vm.slideChanged = slideChanged;
		vm.showSlideButtons = showSlideButtons;
		vm.diff = Array.apply(null, Array(5)).map(function () {
        	return "ion-ios-star-outline"
    	});
    	vm.rateGame = rateGame;
    	vm.initSlideBox = initSlideBox;
		vm.submit = submit;
		vm.currentAct = {}; // Activity that is currently created
		vm.chooseActType = chooseActType;
		vm.finishGame = finishGame;
		vm.slideTitle = 'General Information';
		vm.mainMap = MapService;
		vm.waypoints = [];
		vm.addQAtask = addQAtask;
		vm.addGRtask = addGRtask;
		vm.saveWayPoint = saveWayPoint;

		activate();

		////////////////////////////

		function activate () {
			
		}	

		function initSlideBox () {
			$ionicSlideBoxDelegate.enableSlide(false);
		}

		function submit (form, invalid) {
			if (form === null || form === false || form.$name === 'slide1') {
				vm.invalidForm = invalid;
			} else if (form.$name === 'newWaypoint') {
				vm.invalidWaypointForm = invalid;
			}
		}

		function previousSlide () {
			$ionicSlideBoxDelegate.previous();
		}

		function nextSlide () {
			if ($ionicSlideBoxDelegate.currentIndex() === 1) {
				addActivity();
			}
			$ionicSlideBoxDelegate.next();
		}

		function slideChanged (slideIndex) {
			if (slideIndex === 0) {
				vm.slideTitle = 'General Information';
			}
			if (slideIndex === 1) {
				vm.slideTitle = 'Choose Activity Type';
				if (vm.act_type === 0) {
					submit(null, true);
				} else {
					submit(null, false);
				}
			}
			if (slideIndex === 2) {
				vm.slideTitle = 'Add points to the map';
			}
			if (slideIndex === 3) {
				vm.slideTitle = 'Congratulation!';	
			}
		}

		function showSlideButtons () {
			let currentIndex = $ionicSlideBoxDelegate.currentIndex();
			let slidesCount = $ionicSlideBoxDelegate.slidesCount();
			let showPrevious = false;
			let showNext = true;
			let saveButton = false;

			if (currentIndex === 0) {
				showPrevious = false;
			} else if (currentIndex > 0 && currentIndex < slidesCount - 2) {
				showPrevious = true;
			} else if (currentIndex === slidesCount - 2) {
				showPrevious = true;
				showNext = false;
				saveButton = true;
			} else if (currentIndex === slidesCount - 1) {
				showPrevious = false;
				showNext = false;
				saveButton = false;
			}

			return { 
				showPrevious: showPrevious, 
				showNext: showNext, 
				saveButton: saveButton 
			}
		}

		function rateGame (difficulty) {
			vm.diff = Array.apply(null, Array(5)).map(function () {
			    return "ion-ios-star-outline"
			});
			for (var i = 0; i <= difficulty; i++) {
			    vm.diff[i] = "ion-ios-star";
			}
			vm.newgame.difficulty = difficulty + 1;
		}

		function abort () {
			$ionicHistory.goBack();
		}

		//Choose Activity
		function chooseActType (type) {
		    if (type === vm.act_type) {
		        vm.act_type = 0;
		    	submit(null, true);
		    } else {
		        vm.act_type = type;
		        submit(null, false);
		    }
		}

	    function addActivity () {
	        vm.newgame.activities = [];
	        vm.currentAct.type = vm.act_type == 1 ? "Find destination" : "Follow route";
	        vm.currentAct.points = [];
	    }

	    function finishGame () {
	    	nextSlide();
	        // API.saveItem(vm.newgame)
	        //     .success(function (data, status, headers, config) {
	        //         // $rootScope.hide();
	        //         // $rootScope.doRefresh(1);
	        //         // $ionicHistory.goBack();
	        //         // $scope.newgame = {};
	        //     })
	        //     .error(function (data, status, headers, config) {
	        //         // $rootScope.hide();
	        //         // $rootScope.notify("Oops something went wrong!! Please try again later");
	        //         // $ionicHistory.goBack();
	        //         // $scope.newgame = {};
	        //         // $scope.numberTask = 0;
	        //     });
	    }

	    //Addition of a TASK to an ACTIVITY POINT
	    function addQAtask () {
	        $scope.qaTask = {};
	        $scope.qaTask.answers = [{}, {}, {}, {}]; // Four answers - either text or images
	        $scope.qaTask.question = {};

	        $scope.picFile = [];
	        $scope.picFilename = [];
	        $scope.imgAnsPrvw = [];
	        $scope.imgQuestionPrvw = null;

	        $scope.modal.remove();
	        $scope.qamodal = createModal('templates/tasks/quest_type.html');
	    };
	    function addGRtask () {
	        $scope.geoTask = {};

	        $scope.closeModal();
	        createModal('templates/tasks/georef_type.html');

	        $scope.georP = null;
	        $scope.gameMap.markers = [];
	    };

	    ////////////////////////////

	    //Add Waypoint with modal
	    $scope.$on('leafletDirectiveMap.click', function (event, locationEvent) {
	    	console.log('leaflet click');
	        vm.newWaypoint = new Waypoint();
	        vm.newWaypoint.lat = locationEvent.leafletEvent.latlng.lat;
	        vm.newWaypoint.lng = locationEvent.leafletEvent.latlng.lng;
	        vm.newWaypoint.tasks = [];

	        createModal('templates/map/waypoint.html', 'm1');
	    });

	    var Waypoint = function () {
	        if (!(this instanceof Waypoint)) return new Waypoint();
	        this.lat = "";
	        this.lng = "";
	        this.name = "";
	        this.description = "";
	        this.tasks = [];
	    }

	    // Modal Windows Routine
	    var createModal = function (templateUrl, id) {
	        $ionicModal.fromTemplateUrl(templateUrl, {
	            id: id,
	            scope: $scope,
	            animation: 'slide-in-up',
	            backdropClickToClose: false
	        }).then(function (modal) {
	            $scope.modal = modal;
	            $scope.modal.show();
	        });
	    }

		var waypointIcon = {
			type: 'extraMarker',
			icon: 'fa-number',
			markerColor: 'blue',
			shape: 'circle',
			number: '1'
		}

	    var newMarker = {};
	    $scope.numberTask = 0;
	    function saveWayPoint () {
	        if ((vm.newWaypoint.name == "" || vm.newWaypoint.name == undefined) || (vm.newWaypoint.description == undefined || vm.newWaypoint.description == "")) {

	            if (vm.newWaypoint.name == "" || vm.newWaypoint.name == undefined) {
	                vm.name_border = "red";
	            } else {
	                vm.name_border = "";
	            }

	            if (vm.newWaypoint.description == undefined || vm.newWaypoint.description == "") {
	                vm.description_border = "red";
	            } else {
	                vm.description_border = "";
	            }
	        } else {
	            // $scope.name_border = "";
	            // $scope.description_border = "";

	            newMarker = vm.newWaypoint;
	            newMarker.icon = angular.copy(waypointIcon);
	            newMarker.icon.number = vm.waypoints.length + 1;
	            vm.waypoints.push(vm.newWaypoint);

	            $scope.closeModal();
	            createModal('templates/tasks/task_choose.html', 'm2');
	        }
	    }

		$scope.closeModal = function () {
			$scope.modal.remove();
		}
	}
})();