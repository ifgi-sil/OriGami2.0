angular.module('starter').controller('languageController', ['$scope', '$ionicModal', '$translate', '$timeout',
    function ($scope, $ionicModal, $translate, $timeout) {
        var languageMap = {
            "de": "Deutsch",
            "en": "English",
            "es": "Español",
            "pt": "Português"
        };
        $scope.currentLanguage = languageMap[$translate.use()];
        $scope.icon = 'question_answer';

        $scope.changeLanguage = function (language) {
            $translate.use(language);
            $scope.currentLanguage = languageMap[language];
            $scope.icon = 'thumb_up';
            $timeout(function () {
                $scope.icon = 'question_answer';
            }, 1200);
        };
    }])