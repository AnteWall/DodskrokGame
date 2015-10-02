angular.module('dodskrok.directives')
    .directive('dkGameSettings', function($interval, $mdSidenav) {
        return {
            restrict: 'E',
            templateUrl: '/common/directives/dkGameSettings/dkGameSettings.html',
            scope: {
                players: '=',
                missions: '=',
                maxTime: '=',
                minTime: '='
            },
            link: function(scope, element, attr) {
                scope.model = {
                    newMission: '',
                };

                scope.addPlayer = function(chip) {
                    var player = {
                        name: chip
                    };
                    return player;

                };

                scope.addMission = function(chip) {
                    var mission = {
                        name: chip,
                        spin: false
                    }
                    return mission;
                };

                scope.toggleSettings = function() {
                    $mdSidenav('left')
                        .toggle()
                        .then(function() {});
                };

            }
        };
    });
