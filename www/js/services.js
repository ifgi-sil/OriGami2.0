angular.module('starter.services', [])

.value('Server', 'ORIGAMI_API_URL')

.factory('Edit', function() {
    var editedGame = {};
    var game = {};

    editedGame.pushGame = function(value){
        game = value;
    };

    editedGame.getGame = function(){
      return game;
    };

    editedGame.resetGame = function(){
        game = null;
    };

    editedGame.resetActivities = function(){
        editedGame.activities = [];
    }
    return editedGame;
})
.factory('PathData',function(){
    var pathObj = {};
    var pathdata = [];

    pathObj.addCoord = function(lat,lng){
        pathdata.push({
            'lat' : lat,
            'lng' : lng,
            'timestamp' : (new Date()).toISOString()
        })
    };

    pathObj.getPath = function(){
        return pathdata;
    };

    return pathObj;

})
.factory('Data', function () {

    var actService = {};
    var allGames = [];

    actService.pushGame = function (value) {
        allGames.push(value);
    };
    actService.getGames = function () {
        return allGames;
    };


    var activities = [];
    var tasks = [];
    var gameType = ""; // Path planning / Aided Wayfinding
    var taskType = ""; // Question - Answer / Georeference


    actService.newAct = function (value) {
        activities.push(value);
    };
    actService.addType = function (type) {
        gameType = type;
    };

    // Get all the current activities, game type (Path plan / Aid wayf)
    actService.getAct = function () {
        return activities;
    };
    actService.getType = function () {
        return gameType;
    };

    // Clean current activities, game types (Path plan / Aid wayf)
    actService.clearAct = function () {
        activities.splice(0, activities.length);
        activities = [];
        allGames = [];
    };
    actService.clearType = function () {
        gameType = "";
    };
    return actService;
})

.factory('Task', function ($rootScope, $http, $ionicLoading, $window) {
    var taskService = {};
    var task = {}; // Question - Answer / Georeference

    // Index of a choosen ACTIVITY and POINT. Important, because we have to know where to add a certain task
    var currentActIndex = null;
    var currentPointIndex = null;

    // Add relevant information to the PHOTO TASK
    taskService.addType = function (taskType) {
        task.type = taskType;
    };

      // Add relevant information to the PHOTO TASK
    taskService.addPhoto = function (taskPhoto) {
        task.photo = taskPhoto;
    };
    taskService.addCoordinates = function (lat, lng) {
        task.lat = lat;
        task.lng = lng;
    };
     // Add relevant information to the QUESTION - ANSWER TASK
    taskService.addQA = function (qaGame){
        task.question = qaGame.question;
        task.answers = qaGame.answers;
    }


    taskService.addIndexes = function (actIndex, pointIndex) {
        currentActIndex = actIndex;
        currentPointIndex = pointIndex;
    };

    // Get and Clear TASK
    taskService.getTask = function () {
        return task;
    };
    taskService.clearTask = function () {
        task = {};
    };

    taskService.getActIndex = function () {
        return currentActIndex;
    };
    taskService.getPointIndex = function () {
        return currentPointIndex;
    };


    return taskService;
})

// API for getting data from the remote server (REST interface to Mongodb)
.factory('API', function ($rootScope, $http, $ionicLoading, $window, Server, Upload, authentication) {
    var base = Server;
    /*$rootScope.show = function (text) {
        $rootScope.loading = $ionicLoading.show({
            content: text ? text : 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    };*/
    $rootScope.hide = function () {
        $ionicLoading.hide();
    };

    /*$rootScope.notify = function (text) {
        $rootScope.show(text);
        $window.setTimeout(function () {
            $rootScope.hide();
        }, 1999);
    };*/

    $rootScope.doRefresh = function (tab) {
        if (tab == 1)
            $rootScope.$broadcast('fetchAll');
        else
            $rootScope.$broadcast('fetchCompleted');

        $rootScope.$broadcast('scroll.refreshComplete');
    };

    $rootScope.setToken = function (token) {
        return $window.localStorage.token = token;
    }

    $rootScope.getToken = function () {
        return $window.localStorage.token;
    };

    $rootScope.isSessionActive = function () {
        return $window.localStorage.token ? true : false;
    };

    return {
        getAll: function () {
            return $http.get(base + '/games', {
                method: 'GET',
            });
        },
        getOne: function (name) {
            return $http.get(base + '/games/item/' + name, {
                method: 'GET',
            });
        },
        getMetadata: function () {
            return $http.get(base + '/games/metadata', {
                method: 'GET',
            });
        },
        addPlayer: function (mail, gamename, user) {
            return $http.post(base + '/games/addplayer/' + mail + '/' + gamename, user, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        },
        saveItem: function (form) {
            return $http.post(base + '/games/item', form, {
                method: 'POST',
            });
        },
        updateGame: function (game, player) {
            return $http.post(base + '/games/update/' + game, player);
        },
        /* putItem: function (id, form, email) {
         return $http.put(base+'/api/v1/bucketList/data/item/' + id, form, {
         method: 'PUT',
         params: {
         token: email
         }
         });
         },*/
        deleteItem: function (name) {
            return $http.delete(base + '/games/item/' + name, {
                method: 'DELETE',
            });
        },
        getImageURL: function(name) {
            if (name == undefined) {
                return null
            }
            return base + '/data/img/' + name;
        },
        uploadImage: function(file) {
            return Upload.upload({
                url: base + '/data/img/upload',
                data: {
                    imgfile: file
                }
            });
        },
        addPlayerInfo : function(info) {
            return $http.post(base + '/games/player', info, {
                method: 'POST',
            });
        }
    };
})

/* loads existing games from database */
.factory('GameData', function ($rootScope, $http, $filter, $q, Server) {
    var data = {};
    var game = {};
    var loaded = false;
    var config = {};
    /* Specify default configuration settings. Can be overridden by game specific configs*/
    var default_config = {
        // Defaults for leaflet map
        map: {
            maxZoom: 19,
            maxNativeZoom: 18,
            zoomControlPosition: 'bottomleft',
            defaultZoom: 18,
            enableZoom: true,
            defaultLayer : 'satellite' // choose from : satellite / streets / topographic
        },
        geolocationAlwaysOn : false, // always use GPS. If true, also hide map button to toggle geolocation
        thresholdDistance: 30, // distance (in metres) to target waypoint below which target is treated as reached
        thresholdDistanceGeolocOn: 10, // same when geolocation is on
        georefThresholdDistance : 25, // threshold distance for georeference game to treat answer as correct and gain points
        // scores and penalties for various scenarios
        score: {
            waypointCorrect: 10, // points gained when waypoint reached
            answerCorrect : 10, // points gained when question answered correctly
            answerIncorrect : 0, // points lost when question answered incorrectly
            georefCorrect : 10, // points gained when georeference is below 'georefThresholdDistance'
            georefIncorrect : 0 // points lost when georeference is more than 'georefThresholdDistance'
        },
        qaTimeLimit : 60, // time limit (in seconds) to choose answer in question-answer game
        playerLocationHintTimeout : 5, // time limit (in seconds) to show player's position marker when button is pressed
        language : "en" // recommmended interface language for game (alternatives - de / es / pt / en)

    };
    data.isLoaded = function () {
        return loaded;
    };
    data.getId = function() {
        if (loaded) {
            return game._id;
        }
        return null;
    };
    data.getName = function() {
        if (loaded) {
            return game.name;
        }
        return null;
    };
    data.getNumActivities = function () {
        if (loaded) {
            if ('activities' in game) {
                return game.activities.length;
            }
            return 0;
        }
        return -1;
    };
    data.getNumWaypoints = function (activityIndex) {
        if (loaded) {
            if (typeof game.activities[activityIndex] === 'undefined') {
                return 0;
            }
            if ('points' in game.activities[activityIndex]) {
                return game.activities[activityIndex].points.length;
            }
            return 0;
        }
        return -1;
    };
    data.getNumTasks = function (activityIndex, waypointIndex) {
        if (loaded) {
            if ('tasks' in game.activities[activityIndex].points[waypointIndex]) {
                return game.activities[activityIndex].points[waypointIndex].tasks.length;
            }
            return 0;
        }
        return -1;
    };
    data.getActivity = function (index) {
        if (loaded) {
            return game.activities[index];
        }
        return -1;
    };
    data.getWaypoint = function (actIndex, pointIndex) {
        if (loaded) {
            return game.activities[actIndex].points[pointIndex];
        }
        return -1;
    };
    data.getTask = function (actIndex, pointIndex, taskIndex) {
        if (loaded) {
            return game.activities[actIndex].points[pointIndex].tasks[taskIndex];
        }
        return -1;
    };
    data.getAllConfigs = function() {
        if (loaded) {
            return config;
        }
        return null;
    };
    data.getConfig = function (prop) {
        /*
            Check if object has nested keys. Angular don't provide inbuilt functions for the same
            e.g. objHasProp (myObj, 'foo.bar.xyz')
            checks if myObj has 'foo', then 'bar', then 'xyz' as it's properties
            Second argument is a string
        */
        var objHasProp = function (obj, keys) {
            keys = keys.split('.');
            var next = keys.shift();
            return (typeof obj[next] != 'undefined') && (!keys.length || objHasProp(obj[next], keys.join('.')));
        };
        /*
             Get nested key from obj - e.g.. getProp (myObj, 'foo.bar.xyz') gives myObj.foo.bar.xyz
             As with previous function, second argument is a string
        */
        var getProp = function (obj, keys) {
            for (var i = 0, keys = keys.split('.'), len = keys.length; i < len; i++) {
                obj = obj[keys[i]];
            };
            return obj;
        };
        if (loaded) {
            if (objHasProp(config, prop)) {
                return getProp(config, prop);
            }
            console.log("Warning! No property found in config for - ", prop);
            return null;
        }
        return null;
    };
    data.loadGame = function (name) {
        var defer = $q.defer();
        //var games = $http.get('test_data/games.json')
        var games = $http.get(Server + '/games/item/' + name)
            .then(
                function (response) { // On success
                    game = response.data[0];
                    loaded = true;
                    if (game.hasOwnProperty('config') == false) {
                        game.config = {};
                    }
                    /* config will now contain default + customized configs */
                    angular.merge (config, default_config, game.config);
                    $rootScope.$broadcast('gameLoadedEvent');
                    defer.resolve();
                },
                function (response) { //On failure
                    console.log("Fetching game data. HTTP GET request failed");
                    console.log(response);
                    defer.reject("Unable to fetch game data. HTTP GET request failed");
                });
        return defer.promise;
    };
    return data;
})

/* holds current state of the game being played */
.factory('GameState', function (GameData, $rootScope, LocalDB) {
    var gameName = "";
    var startTime = (new Date()).toISOString();
    var endTime = "";
    var gameFinished = false;
    var activityFinished = false;
    var allWaypointsCleared = false;
    var tasksFinished = false;
    var activityIndex = -1; // Index of current activity in game
    var waypointIndex = -1; // Index of current waypoint in current activity
    var taskIndex = -1; // Index of current task in current activity + waypoint

    var resetTasks = function () {
        taskIndex = -1;
        tasksFinished = false;
    };
    var resetWaypoints = function () {
        waypointIndex = -1;
        allWaypointsCleared = false;
    };
    var resetActivities = function () {
        activityIndex = -1;
        activityFinished = false;
    };

    var state = {};

    state.ERR_NO_ACTIVITIES = -2;

    state.resetAll = function () {
        resetTasks();
        resetWaypoints();
        resetActivities();
        gameFinished = false;
        gameName = "";
        startTime = (new Date()).toISOString();
        endTime = "";
    };
    state.gameOver = function () {
        return gameFinished;
    };
    state.setGameOver = function () {
        gameFinished = true;
    };
    state.getStartTime = function () {
        return startTime
    };
    state.getEndTime = function () {
        return endTime
    };
    state.setEndTime = function (time) {
        endTime = time
    };
    state.currentActivityCleared = function () {
        return activityFinished;
    };
    state.allTasksCleared = function () {
        return tasksFinished;
    };
    state.setTasksCleared = function () {
        tasksFinished = true
    };
    state.allWaypointsCleared = function () {
        return allWaypointsCleared;
    };
    state.getCurrentActivity = function () {
        return activityIndex
    };
    state.getCurrentWaypoint = function () {
        return waypointIndex
    };
    state.getCurrentTask = function () {
        return taskIndex
    };


    /* Return index of next playable Activity.
     * If current activity is unfinished, return index of current activity
     */
    state.todoActivityIndex = function () {
        if (GameData.getNumActivities() == 0) {
            gameFinished = true;
            return state.ERR_NO_ACTIVITIES;
        }
        if (activityFinished == true) {
            if (activityIndex == GameData.getNumActivities() - 1) {
                // all activities are complete, hence game over
                gameFinished = true;
                // broadcast $rootScope signal maybe ???
                $rootScope.$broadcast('gameover');
            } else {
                // update vars to reflect we're in a new activity
                activityIndex++;
                // reset flags for new activity
                activityFinished = false;
                resetWaypoints();
            }
        } else {
            if (activityIndex == -1 || allWaypointsCleared == true) {
                activityIndex++;
            }
        }
        return activityIndex;
    };

    /* Return index of next waypoint.
     * If current waypoint is not cleared, return index of current waypoint
     */
    state.todoWaypointIndex = function () {
        if (allWaypointsCleared == true) {
            //$rootScope.$broadcast('waypointscleared');
            //waypointIndex = -2; // invalid index
        } else {
            if (waypointIndex == GameData.getNumWaypoints(activityIndex) - 1) {
                allWaypointsCleared = true;
                tasksFinished = false;
                taskIndex = -1;
                activityFinished = true;
            } else {
                if (waypointIndex == -1 || tasksFinished) { // increment waypoint if all tasks are finished
                    waypointIndex++;
                    if (tasksFinished) {
                        resetTasks();
                    }
                }
            }
        }
        return waypointIndex;
    };
    /* Return index of next task.
     * If current task is not finished, return index of current task
     */
    state.todoTaskIndex = function () {
        if (tasksFinished == true) {
            //$rootScope.$broadcast('allTasksClearedEvent');
        } else {
            if (taskIndex == GameData.getNumTasks(activityIndex, waypointIndex) - 1) {
                tasksFinished = true;
            } else {
                taskIndex++;
            }
        }
        return taskIndex;
    };
    /* Save game state to browser's indexedDB' */
    state.saveState = function(playerName) {
        var stateObj = {
            gameId: GameData.getId(),
            gameName : GameData.getName(),
            playerName: playerName,
            state: {
                gameFinished: gameFinished,
                activityFinished: activityFinished,
                allWaypointsCleared: allWaypointsCleared,
                tasksFinished: tasksFinished,
                activityIndex: activityIndex,
                waypointIndex: waypointIndex,
                taskIndex: taskIndex
            }
        }
        console.log("Saving State", stateObj);
        LocalDB.saveState(stateObj);
    };

    /* Get saved game state from browser's indexedDB' */
    state.loadState = function(playerName) {
        LocalDB.getState().then(
            function(stateData) {
                console.log("Got State", stateData)
                if (stateData.playerName == playerName) {
                    var state = stateData.state;
                    gameFinished = state.gameFinished;
                    activityFinished = state.activityFinished;
                    allWaypointsCleared = state.allWaypointsCleared;
                    tasksFinished = state.tasksFinished;
                    activityIndex = state.activityIndex;
                    waypointIndex = state.waypointIndex;
                    taskIndex = state.taskIndex;
                }
            },
            function(err) {
                console.log("Couldn't get state", err);
            });
    };
    return state;
})

/* Keep track of gameplay for analytics */
.factory('PlayerStats', ['$rootScope', '$http', '$filter', 'GameData', 'GameState', 'PathData', 'LocalDB',
                            function ($rootScope, $http, $filter, GameData, GameState, PathData, LocalDB) {
    var playerStats = {};
    var data = {}
    var tasks = [];
    var waypoints = [];
    var activities = [];

    var getTimeStamp = function() {return (new Date()).toISOString()};
    playerStats.init = function(name) {
        data = {
            playerName: name,
            machineID : null,
            startTime : (new Date()).toISOString(),
            endTime : null,
            gameCompleted : false,
            activities : [],
            totalScore : 0
        }
        activities = [];

    };
    playerStats.getMachineID = function() {
        machineID = "someuniqueid";
    };
    playerStats.startTask = function(task) {
        curTask = {};
        curTask.startTime = getTimeStamp();
        curTask.endTime = null;
        //var task = GameData.getTask(GameState.getCurrentActivity(), GameState.getCurrentWaypoint(), GameState.getCurrentTask())
        curTask.type = task.type;
        if (task.type == "QA") {
            curTask.question = task.question;
        } else if (task.type == "GeoReference") {
            curTask.lat = task.lat;
            curTask.lng = task.lng;
        }
    };
    playerStats.endTask = function(result) {
        curTask.result = result;
        curTask.endTime = getTimeStamp();
        tasks.push(curTask);
    };
    playerStats.startWaypoint = function(waypoint) {
        curWaypoint = {};
        tasks = [];
        curWaypoint.name = waypoint.name;
        curWaypoint.lat = waypoint.lat;
        curWaypoint.lng = waypoint.lng;
        curWaypoint.startTime = getTimeStamp();
    };
    playerStats.endWaypoint = function() {
        curWaypoint.endTime = getTimeStamp();
        curWaypoint.tasks = tasks;
        waypoints.push(curWaypoint);
    };
    playerStats.startActivity = function(activity) {
        curActivity = {};
        curActivity.startTime = getTimeStamp();
        curActivity.type =  activity.type;
    };
    playerStats.endActivity = function() {
        curActivity.waypoints =  waypoints;
        curActivity.endTime = getTimeStamp();
        activities.push(curActivity);
    };
    playerStats.endGame = function(score) {
        data.gameCompleted = true;
        data.endTime = getTimeStamp();
        data.totalScore = score;
        data.activities = activities;
        data.trajectory = PathData.getPath();
        LocalDB.saveItem(data);
        /*
        origami_stats = localStorage.getItem('origami_stats')
        if (!origami_stats) {
            origami_stats = [];
        }
        origami_stats.push(data);
        localStorage.setItem('origami_stats', origami_stats);
        */
    };
    playerStats.debug = function(msg) {
        console.log(msg, data);
    };

    return playerStats;
}])

/* Store gamedata offline using Indexed DB */
.factory('LocalDB', ['$localForage', function ($localForage) {
    // Database has been intialized $localForageProvider.config in app.js
    db = {};
    var trackerDB = $localForage.createInstance({
        name: 'origami_tracker',
        storeName: 'playerdata',
        description: 'track gameplay, movement, answers and the whole nine yards'
    });
    var stateDB = $localForage.createInstance({
        name: 'origami_state',
        storeName: 'gameState',
        description: 'save current state of game for later resumption'
    });
    db.saveItem = function (item) {
        timestamp = (new Date()).toISOString();
        trackerDB.setItem(timestamp, item)
            .then(function () {
                trackerDB.getItem(timestamp).then(function (data) {
                    //console.log(data);
                    //console.log($localForage.driver());
                });
            });
    };
    db.saveState = function (stateObj) {
        stateDB.setItem('gameState', stateObj).then(
            function (data) { // On success
                    // console.log("GameState - ", data)
            },
            function(err) {
                console.log("Saving State Failed", err);
            });
    };
    db.getState = function () {
        return stateDB.getItem('gameState');
    };
    return db;
}]);
