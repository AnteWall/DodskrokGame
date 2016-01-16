angular.module('dodskrok.directives')
    .directive('dkLobbyCreation', function($interval, $http) {
        var CREATION_URL = '/lobby/create';

        return {
            restrict: 'E',
            templateUrl: '/common/directives/dkLobbyCreation/dkLobbyCreation.html',
            scope: {

            },
            link: function(scope, element, attr) {
                scope.model = {
                    newPlayer: '',
                    lobbyName: 'test'
                };
                scope.players = ['Player1', 'Player2', 'Player3'];

                scope.addPlayer = function() {
                    if (scope.model.newPlayer.length > 0) {
                        scope.players.push(scope.model.newPlayer);
                        scope.model.newPlayer = '';
                    }
                };

                scope.removePlayer = function(player) {
                    scope.players.splice(scope.players.indexOf(player), 1);
                };

                scope.createLobby = function() {
                    var data = {
                        'name': scope.model.lobbyName,
                        'players': scope.players
                    }

                    $http.post(CREATION_URL, data).success(function(result) {
                        console.log(result);
                    }).error(function(err) {
                        console.error('ERROR CREATION LOBBY');
                        console.error(err);
                    });
                };
            }
        };
    });