angular.module('dodskrok.controllers')
    .controller('LobbyController', ['$scope',
        function($scope) {
            $scope.page = 'Menu';

            $scope.selectPage = function(page) {
                $scope.page = page;
            };

            $scope.isNotPage = function(page) {
                return ($scope.page !== page);
            };

            $scope.isPage = function(page) {
                return ($scope.page === page);
            };
        }
    ]);
