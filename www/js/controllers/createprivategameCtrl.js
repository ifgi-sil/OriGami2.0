(function () {
    'use strict';

    angular
        .module('starter')
        .controller('createprivategameCtrl', createprivategameCtrl);

    createprivategameCtrl.$inject = ['$scope','$ionicPopup', '$ionicHistory', '$ionicSlideBoxDelegate', '$ionicModal', 'MapService', 'API', 'meanData', 'userService'];

    function createprivategameCtrl ($scope, $ionicPopup, $ionicHistory,$ionicSlideBoxDelegate, $ionicModal, MapService, API, meanData, userService) {
        var vm = this;
        vm.newgame = {}; // General description of the game
        vm.newgame.private = true;
        vm.newgame.players= [];
        vm.newgame.playerscores = [];
        vm.newWaypoint = {}; // Waypoint Object
        vm.abort = abort;
        vm.invalidForm = true;
        vm.invalidWaypointForm = true;
        vm.act_type = 0;
        vm.previousSlide = previousSlide;
        vm.nextSlide = nextSlide;
        vm.slideChanged = slideChanged;
        vm.showSlideButtons = showSlideButtons;
        vm.maxScore = 0; // Calculated maximal score for a game
        vm.numberTask = 0; // Amount of tasks
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
        vm.gameMap = MapService;
        vm.waypoints = [];
        vm.addQAtask = addQAtask;
        vm.addGRtask = addGRtask;
        vm.saveWayPoint = saveWayPoint;
        vm.noTask = noTask;
        vm.submitQA = submitQA;
        vm.submitGRTask = submitGRTask;
        vm.imgUpload = imgUpload;
        vm.placeholderUpload = '../../img/icons/upload.png';

        activate();

        meanData.getProfile()
            .success(function(data) {
                vm.newgame.owner = data.email;
                vm.newgame.players.push(data.userName);
                $scope.user = data;
                $scope.userfriends = data.friends;
            })
            .error(function (e) {
                $location.path('/tab/home');
            });

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

        //Invite friend as a player
        $scope.invitePlayer = function (mail) {
            var inPlayerList = false;
            for(var i = 0; i < vm.newgame.players.length; i++){
                if(vm.newgame.players[i] == mail){
                    inPlayerList = true;
                }
            }
            setTimeout(function () {
                if(inPlayerList == false){
                    vm.newgame.players.push(mail);
                    API.addPlayer(mail, vm.newgame.name, $scope.user)
                        .then(function () {
                            $ionicPopup.alert({
                                title: mail + ' added to the game!'
                            });
                        });
                }
                else{
                    $ionicPopup.alert({
                        title: 'This user is already in the game!'
                    });
                }
            },300);
        };

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
            $scope.user.games.push(vm.newgame.name);
            userService.update($scope.user);
            for (var i = 0; i < vm.waypoints.length; i++) {
                vm.currentAct.points.push(vm.waypoints[i]);
            }
            vm.newgame.activities.push(vm.currentAct);

            vm.maxScore = vm.numberTask * 50 + vm.waypoints.length * 20;

            API.saveItem(vm.newgame)
                .success(function (data, status, headers, config) {
                    console.log(vm.newgame);
                    console.log(data);
                    nextSlide();
                })
                .error(function (data, status, headers, config) {
                    console.log('error');

                });
        }

        //Addition of a TASK to an ACTIVITY POINT
        function addQAtask () {
            vm.qaTask = {};
            vm.qaTask.answers = [
                {
                    img: '../../img/icons/upload.png'
                }, {
                    img: '../../img/icons/upload.png'
                }, {
                    img: '../../img/icons/upload.png'
                }, {
                    img: '../../img/icons/upload.png'
                }
            ]; // Four answers - either text or images
            vm.qaTask.question = {
                img: '../../img/icons/upload.png'
            };

            vm.picFile = [];
            vm.picFilename = [];
            vm.imgAnsPrvw = [];
            vm.imgQuestionPrvw = null;

            $scope.modal.remove();
            vm.qamodal = createModal('templates/tasks/quest_type.html');
        }

        function addGRtask () {
            vm.geoTask = {
                img: '../../img/icons/upload.png'
            };

            $scope.closeModal();
            createModal('templates/tasks/georef_type.html');

            vm.georP = null;
            vm.gameMap.markers = [];
        }

        ////////////////////////////

        // Click handler for mainMap during creation
        $scope.$on('leafletDirectiveMap.mainMap.click', function (event, locationEvent) {
            vm.newWaypoint = new Waypoint();
            vm.newWaypoint.lat = locationEvent.leafletEvent.latlng.lat;
            vm.newWaypoint.lng = locationEvent.leafletEvent.latlng.lng;
            vm.newWaypoint.tasks = [];

            createModal('templates/map/waypoint.html', 'm1');
        });

        // Click handler for gameMap during georeferencing task
        $scope.$on('leafletDirectiveMap.gameMap.click', function (event, locationEvent) {
            vm.newWaypoint = new Waypoint();
            vm.newWaypoint.lat = locationEvent.leafletEvent.latlng.lat;
            vm.newWaypoint.lng = locationEvent.leafletEvent.latlng.lng;
            vm.newWaypoint.draggable = true;

            if (vm.gameMap.markers.length == 0) {
                vm.gameMap.markers.push(vm.newWaypoint);
            } else {
                vm.gameMap.markers.pop();
                vm.gameMap.markers.push(vm.newWaypoint);
            }
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
                newMarker = vm.newWaypoint;
                newMarker.icon = angular.copy(waypointIcon);
                newMarker.icon.number = vm.waypoints.length + 1;
                vm.waypoints.push(vm.newWaypoint);

                $scope.closeModal();
                createModal('templates/tasks/task_choose.html', 'm2');
            }
        }

        function submitQA (imgAnswers) {
            vm.qaTask.type = "QA";

            vm.numberTask++;

            // Reset placeholder image
            for (var i = 0; i < vm.qaTask.answers.length; i++) {
                if (vm.qaTask.answers[i].img.startsWith('../')) {
                    vm.qaTask.answers[i].img = '';
                }
            }
            if (vm.qaTask.question.img.startsWith('../')) {
                vm.qaTask.question.img = '';
            }
            vm.waypoints[vm.waypoints.length - 1].tasks.push(vm.qaTask);

            $scope.closeModal();
            createModal('templates/tasks/task_choose.html');
        }

        function submitGRTask (uploadedPhoto) {
            /*Creation of game content */
            vm.geoTask.type = "GeoReference";
            //$scope.geoTask.img = "data:image/jpeg;base64," + $scope.georP.base64;
            vm.geoTask.lat = vm.gameMap.markers[0].lat;
            vm.geoTask.lng = vm.gameMap.markers[0].lng;

            vm.waypoints[vm.waypoints.length - 1].tasks.push(vm.geoTask);
            //newMarker.tasks.push($scope.geoTask);

            vm.numberTask++;
            $scope.closeModal();
            createModal('templates/tasks/task_choose.html');
            // $scope.georP = null;
        };

        $scope.closeModal = function () {
            $scope.modal.remove();
        }

        function noTask () {
            $scope.modal.remove();
            createModal('templates/tasks/task_choose.html');
        }

        function imgUpload (file, $event) {
            if (file) {
                var upload = API.uploadImage(file);
                var reader = new FileReader();
                var isQuestion = false;
                var isGeoref = false;
                var picIndex = 0;

                switch($event.target.id) {
                    case 'photoAns1':
                        picIndex = 0;
                        break;
                    case 'photoAns2':
                        picIndex = 1;
                        break;
                    case 'photoAns3':
                        picIndex = 2;
                        break;
                    case 'photoAns4':
                        picIndex = 3;
                        break;
                    case 'photoQuestion':
                        isQuestion = true;
                        break;
                    case 'georefPic':
                        isGeoref = true;
                        break;
                }

                // Previewing the image
                reader.onload = function(event) {
                    if (isGeoref) {
                        vm.georefPicPrvw = event.target.result;
                    } else if (!isQuestion) {
                        vm.imgAnsPrvw[picIndex] = event.target.result;
                    } else {
                        vm.imgQuestionPrvw = event.target.result;
                    }
                    $scope.$apply();
                }

                reader.readAsDataURL(file);

                upload.then(function(res) {
                    //console.log(res);
                    if (res.status == 200) {
                        //$scope.picFilename[picIndex] = res.data.img_file;
                        if (isGeoref) {
                            vm.geoTask.img = 'https://api.ori-gami.org/data/img/'+res.data.img_file;
                        } else if (isQuestion) {
                            vm.qaTask.question.img = 'https://api.ori-gami.org/data/img/'+res.data.img_file;
                        } else {
                            vm.qaTask.answers[picIndex].img = 'https://api.ori-gami.org/data/img/'+res.data.img_file;
                        }
                    } else {
                        console.log('Error! Pic POSTed, but no filename returned')
                    }
                    //console.log($scope.picFilename);
                }), function(res) {
                    console.log("Error uploading image.", res);
                }
            }
        };
    }
})();