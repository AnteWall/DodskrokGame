angular.module('dodskrok.directives')
    .directive('dkLobbyListItem', function($interval) {
        return {
            restrict: 'E',
            templateUrl: '/common/directives/dkLobbyListItem/dkLobbyListItem.html',
            scope: {
                item: '='
            },
            link: function(scope, element, attr) {
                scope.expanded = false;

                scope.toggleExpanded = function() {
                    scope.expanded = !scope.expanded;
                };
            }
        };
    });
