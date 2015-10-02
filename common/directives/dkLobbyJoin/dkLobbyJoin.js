angular.module('dodskrok.directives')
    .directive('dkLobbyJoin', function($interval) {
        return {
            restrict: 'E',
            templateUrl: '/common/directives/dkLobbyJoin/dkLobbyJoin.html',
            scope: {

            },
            link: function(scope, element, attr) {
                scope.model = {
                    search: ''
                };
                scope.lobbys = [{
                    id: 2,
                    name: 'Coolest Lobby',
                    players: 9,
                    webcam: true,
                    playerList: ['Ante', 'Klante', 'Wall'],
                    status: "Private"
                }, {
                    id: 1,
                    name: 'What Lobby',
                    players: 9,
                    webcam: false,
                    playerList: ['Ante', 'Klante', 'Wall'],
                    status: "Private"
                }, {
                    id: 12,
                    name: 'The Fuck?!',
                    players: 9,
                    webcam: false,
                    playerList: ['Ante', 'Klante', 'Wall'],
                    status: "Private"
                }];
            }
        };
    });
