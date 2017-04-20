(function () {
    'use strict';

    angular
        .module('starter')
        .controller('PlayPrivateCtrl', PlayPrivateCtrl);

    PlayPrivateCtrl.$inject = ['$scope', '$stateParams', '$ionicModal', '$ionicPopup', '$location', '$cordovaSocialSharing',
        '$translate', '$timeout', 'GameData', 'GameState', 'API', 'PlayerStats', 'MapService', 'meanData']

    function PlayPrivateCtrl ($scope, $stateParams, $ionicModal, $ionicPopup, $location,  $cordovaSocialSharing,
                              $translate, $timeout, GameData, GameState, API, PlayerStats, MapService, meanData) {

        $scope.gameName = $stateParams.gameName;
        $scope.gameLoaded = false;
        var congratsMessages = ['Good job!', 'Well done!', 'Great!', 'Cool!', 'Perfect!', 'So Fast! :)'];

        $scope.score = 0;
        $scope.GameData = GameData; // ugly hack to make GameData visible in directives

        $scope.geoMap = MapService;
        $scope.georef = {};

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
        };

        var initGame = function () {
            $scope.player = {};
            GameState.resetAll();
            $translate.use(GameData.getConfig('language'));
            $scope.TIME_LIMIT = GameData.getConfig('qaTimeLimit'); // time limit to answer question (in seconds)
            $scope.gameLoaded = true;
            meanData.getProfile()
                .success(function(data) {
                    $scope.player.name = data.userName;
                    PlayerStats.init($scope.player.name);
                    createModal('gameinfo-modal.html', 'info');
                })
        };

        var abortGame = function (message) {
            $scope.errorMsg = message;
            createModal('error-modal.html', 'error');
        };

        var handleNextActivity = function () {
            var index = GameState.todoActivityIndex(); // Get next pending activity
            if (index == GameState.ERR_NO_ACTIVITIES) {
                abortGame($translate.instant('selected_game'));
            } else if (GameState.gameOver()) {
                endGame();
            } else {
                PlayerStats.startActivity(GameData.getActivity(index))
                handleNextWaypoint();
            }
        };

        $scope.showWaypointInfoModal = function() {
            createModal('waypointinfo-modal.html', 'wpinfo');
        };

        var handleNextWaypoint = function () {
            GameState.todoWaypointIndex(); // Get pending waypoint
            if (GameState.allWaypointsCleared()) {
                PlayerStats.endActivity();
                handleNextActivity();
            } else {
                var actIndex = GameState.getCurrentActivity();
                var pointIndex = GameState.getCurrentWaypoint();
                $scope.waypointImgURL = null;
                $scope.waypoint = GameData.getWaypoint(actIndex, pointIndex);
                if ($scope.waypoint.pic != undefined) {
                    $scope.waypointImgURL = API.getImageURL($scope.waypoint.pic);
                }
                $scope.$broadcast('waypointLoadedEvent', $scope.waypoint);

                $scope.score += GameData.getConfig('score.waypointCorrect');
            }
        };

        var handleTask = function () {
            GameState.todoTaskIndex();
            if (GameState.allTasksCleared()) {
                handleNextWaypoint();
            } else {
                $scope.task = GameData.getTask(GameState.getCurrentActivity(), GameState.getCurrentWaypoint(), GameState.getCurrentTask());
                PlayerStats.startTask($scope.task);
                if ($scope.task.type == 'GeoReference') {
                    $scope.performGeoReferencingTask($scope.task);
                } else if ($scope.task.type == 'QA') {
                    performQATask($scope.task);
                } else {
                    // perform other kinds of tasks here
                    console.log("Handling other tasks, but of what kind?");
                    handleTask();
                }
            }
        };

        $scope.performGeoReferencingTask = function () {
            $scope.geoRefPhoto = $scope.task.img;
            $scope.georef.lat = $scope.task.lat;
            $scope.georef.lng = $scope.task.lng;
            createModal('georef-modal.html', 'georef');
        };

        var performQATask = function (task) {
            //$scope.showInfo = true;
            createModal('qa-modal.html', 'qa');

            //$scope.nonTextAnswer = false; // True if images are used as answers
            $scope.timeLeft = $scope.TIME_LIMIT;
            $scope.answerPicked = false;

            if (typeof $scope.task.answers == 'undefined') {
                console.log("No answers for this activity");
            }

            $scope.rightAnswer = $scope.task.answers[0]; // Correct answer is always at position 0
            $scope.chosenAnswer = "";
            $scope.clicked = [false, false, false, false];
            $scope.ansChoosen = false;
            $scope.answer = null; // true - right; false - wrong;

            //Shuffle the array to fill the answer boxes randomly
            var currentIndex = 4,
                temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);

                currentIndex -= 1;
                // And swap it with the current element.
                temporaryValue = $scope.task.answers[currentIndex];
                $scope.task.answers[currentIndex] = $scope.task.answers[randomIndex];
                $scope.task.answers[randomIndex] = temporaryValue;
            }

            $scope.imgAnsURL_0 = API.getImageURL($scope.task.answers[0].img);
            $scope.imgAnsURL_1 = API.getImageURL($scope.task.answers[1].img);
            $scope.imgAnsURL_2 = API.getImageURL($scope.task.answers[2].img);
            $scope.imgAnsURL_3 = API.getImageURL($scope.task.answers[3].img);
            $scope.imgRightAnswerURL = API.getImageURL($scope.rightAnswer.img);
            // console.log($scope.imgAnsURL_0, $scope.imgAnsURL_1, $scope.imgAnsURL_2, $scope.imgAnsURL_3);
            $scope.answers = ['','','',''];
            $scope.chooseAnswer = function (answer, index) {
                if (!$scope.ansChoosen) {
                    $scope.chosenAnswer = answer;
                    $scope.ansChoosen = true;
                    $scope.answerPicked = true;
                    $scope.clicked = [false, false, false, false];
                    $scope.clicked[index] = true;

                    clearInterval(intervalId);

                    for (var i = 0; i < $scope.task.answers.length; i++) {
                        if ($scope.rightAnswer === $scope.task.answers[i]) {
                            $scope.answers[i] = 'balanced';
                        } else {
                            $scope.answers[i] = 'assertive';
                        }
                    }

                    if ($scope.chosenAnswer == $scope.rightAnswer) {
                        $scope.answerResult = $translate.instant('right_answer');
                        $scope.answer = true;
                        $scope.icon = "ion-android-happy";

                        $timeout(function () {
                            $scope.icon = "ion-android-happy";
                        }, 1200);
                        $scope.score += GameData.getConfig('score.answerCorrect');
                    } else {
                        $scope.answer = false;
                        $scope.answerResult = $translate.instant("wrong_ans_1");
                        $scope.rightAnswer = $scope.rightAnswer;
                        $scope.icon = "ion-sad-outline";
                        $scope.score -= GameData.getConfig('score.answerIncorrect');
                    }
                    PlayerStats.endTask({
                        'answer_correct' : $scope.answer,
                        'answer_chosen' : $scope.chosenAnswer
                    });
                }
            };

            var intervalId = setInterval(function () {
                $scope.timeLeft--;
                if ($scope.timeLeft <= 0) {
                    $scope.answerResult = $translate.instant("wrong_ans_1");
                    $scope.rightAnswer = $scope.rightAnswer;
                    $scope.icon = "ion-sad-outline";
                    $scope.score -= 10;
                    $scope.showOutput();
                    $scope.modal.remove();

                    clearInterval(intervalId);
                }
            }, 1000);

            $scope.showOutput = function () {
                $scope.$broadcast('qaTaskCompleted', $scope.task);
                $scope.answerPicked = false;
            };
        };

        $scope.$on('qaTaskCompleted', function (event) {
            $scope.congratsMessage = congratsMessages[Math.floor(Math.random() * congratsMessages.length)]; // show random congrats message
            createModal('qa-result-modal.html', 'qaResult');
        });

        /* Show message, then execute proc is supplied as argument */
        var showPopup = function (title, msg, proc) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: msg
            });
            alertPopup.then(function (res) {
                if (typeof proc !== "undefined") {
                    proc();
                }
            });
        };

        var gameLoadFailure = function (errString) {
            // Game did not load for some reason at this point
            console.log(errString);
        };

        $scope.$on('waypointReachedEvent', function (event) {
            $scope.congratsMessage = congratsMessages[Math.floor(Math.random() * congratsMessages.length)]; // show random congrats message
            PlayerStats.endWaypoint();
            createModal('waypoint-reached-modal.html', 'waypoint');
        });

        $scope.$on('modal.hidden', function (event, modal) {
            // Start playing once the game info dialog is dismissed
            if (modal.id === 'info') {
                handleNextActivity();
            } else if (modal.id === 'endgame') {
                $location.path('/');
            } else if (modal.id === 'error') {
                $location.path('/');
            } else if (modal.id === 'georef') {
                $scope.$broadcast('georefEvent', $scope.task);
            } else if (modal.id === 'qa') {
                $scope.$broadcast('qaEvent', $scope.task);
            } else if (modal.id === 'georefResult') {
                handleTask();
            } else if (modal.id === 'qaResult') {
                handleTask();
            } else if (modal.id === 'waypoint') {
                handleTask();
            }
        });

        $scope.$on('$destroy', function () {
            if (typeof $scope.modal != 'undefined') {
                $scope.modal.remove();
            }
        });

        $scope.$on('geoRefMarkedEvent', function (event, distance) {
            $scope.geoResult = false;
            $scope.georefDistance = distance;

            if (distance < 25) {
                $scope.georefSmiley = 'ion-happy-outline';
                $scope.geoResult = true;

                $scope.score += GameData.getConfig('score.georefCorrect');
            } else {
                $scope.georefSmiley = 'ion-sad-outline';
                $scope.score -= GameData.getConfig('score.georefIncorrect');
            }
            createModal('georef-result-modal.html', 'georefResult');
        });

        /* Game Results */
        var endGame = function () {
            PlayerStats.endGame($scope.score);
            $scope.player.points = $scope.score;
            var info = {
                id: GameData.getId(),
                playerInfo : $scope.player
            };

            createModal('gameover-modal.html', 'endgame');

            $scope.shareButtons = false;
            $timeout(function () {
                $scope.shareButtons = true;
            }, 1200);
            showResults();

            // API.addPlayerInfo(info); // Add score to player array for this game
            $scope.$broadcast('gameOverEvent');

            $scope.shareViaFacebook = function (message, image, link) {
                $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function (result) {
                    $cordovaSocialSharing.shareViaFacebook(message, image, link);
                }, function (error) {
                    alert("Cannot share on Twitter");
                });
            };
        };

        $scope.playerscores = [];

        var showResults = function () {
            API.getOne($scope.gameName)
                .success(function (data, status, headers, config) {
                    console.log(data[0]);
                    console.log($scope.player)
                    $scope.playerscores = data[0].playerscores || [];

                    var addLeader = function () {
                        $scope.playerscores.push($scope.player);
                        /* Comparison function in order to get three best players */
                        function compare(a, b) {
                            if (a.points > b.points)
                                return -1;
                            else if (a.points < b.points)
                                return 1;
                            else
                                return 0;
                        };
                        $scope.playerscores.sort(compare);
                    };

                    $scope.bestPlayers = function () {
                        addLeader();
                        var maxResults = 10;
                        if ($scope.playerscores.length < maxResults) {
                            API.updateGame(data[0]._id, $scope.player);
                            return $scope.playerscores;
                        } else {
                            console.log(data[0].playerscores)
                            API.updateGame(data[0]._id, $scope.player);
                            return $scope.playerscores.slice(0, maxResults);
                        }
                    }();

                }).error(function (data, status, headers, config) {
                $rootScope.notify(
                    $translate.instant('oops_wrong'));
            });
        };

        var GeoRefPoint = function () {
            if (!(this instanceof GeoRefPoint)) return new GeoRefPoint();
            this.lat = "";
            this.lng = "";
            this.name = "";
        };
        $scope.locationPicked = false;
        // Click handler for gameMap during georeferencing task
        $scope.$on('leafletDirectiveMap.geoRefMap.click', function (event, locationEvent) {
            if ($scope.geoMap.markers.length > 0) {
                return;
            }
            $scope.newGeoRefPoint = new GeoRefPoint();
            $scope.newGeoRefPoint.lat = locationEvent.leafletEvent.latlng.lat;
            $scope.newGeoRefPoint.lng = locationEvent.leafletEvent.latlng.lng;

            var marker = {
                lat: $scope.newGeoRefPoint.lat,
                lng: $scope.newGeoRefPoint.lng,
                message: "Marked photograph location",
                focus: true,
                icon: {
                    iconUrl: '../img/icons/PhotoMarker2.png',
                    iconSize: [24, 38],
                    iconAnchor: [12, 38]
                }
            };
            var marker2 = {
                lat: $scope.georef.lat,
                lng: $scope.georef.lng,
                message: "Original photograph location",
                focus: true,
                icon: {
                    iconUrl: '../img/icons/PhotoMarker1.png',
                    iconSize: [24, 38],
                    iconAnchor: [12, 38]
                }
            };
            $scope.geoMap.markers.push(marker);
            $scope.geoMap.markers.push(marker2);

            var origLocation = L.latLng($scope.georef.lat, $scope.georef.lng);
            var markedLocation = L.latLng($scope.newGeoRefPoint.lat, $scope.newGeoRefPoint.lng);
            $scope.distance = parseInt(origLocation.distanceTo(markedLocation));

            /* Georef task - Path from where the photograph was originally taken to where the player marked */
            var path = {
                type: "polyline",
                color: 'red',
                weight: 5,
                latlngs: [origLocation, markedLocation]
            };

            $scope.geoMap.paths = {
                'georefTaskPath': path
            };

            $scope.geoMap.center = {
                lat: $scope.georef.lat,
                lng: $scope.georef.lng,
                zoom: $scope.geoMap.center.zoom
            };

            $scope.locationPicked = true;
        });

        $scope.leaveGeoRef = function () {
            $scope.locationPicked = false;
            delete $scope.geoMap.paths.georefTaskPath;
            $scope.geoMap.markers = [];
            PlayerStats.endTask ({
                "marked_lat" : $scope.newGeoRefPoint.lat,
                "marked_lng" : $scope.newGeoRefPoint.lng,
                "distance_in_m" : $scope.distance
            });
            $scope.$emit('geoRefMarkedEvent', $scope.distance);
        }

        GameData.loadGame($scope.gameName).then(initGame, gameLoadFailure);
    }
})();