angular.module('dodskrok.directives')
    .directive('dkLobbyCreation', function($interval) {
        return {
            restrict: 'E',
            templateUrl: '/common/directives/dkLobbyCreation/dkLobbyCreation.html',
            scope: {

            },
            link: function(scope, element, attr) {
                scope.model = {
                    newPlayer: '',
                    lobbyName: ''
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
            }
        };
    });
