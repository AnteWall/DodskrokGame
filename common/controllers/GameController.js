angular.module('dodskrok.controllers')
    .controller('GameController', ['$scope', '$mdSidenav', '$timeout', 'ngAudio',
        function($scope, $mdSidenav, $timeout, ngAudio) {

            var SpinnerWidth = 960;
            var XTranslateWheelMargin = 186;
            var SPINNERS_STOP_MARGIN = 4000; //Milliseconds from audio end when spinners should start stopping

            $scope.started = false;
            $scope.roundActive = false;

            $scope.audio = ngAudio.load('/dkSprit.wav');
            $scope.minTime = 1;
            $scope.maxTime = 4;
            $scope.lobby = {
                name: 'Cool Lobbyname 123'
            };

            $scope.players = [{
                name: 'Generalen'
            }, {
                name: 'Bokning'
            }, {
                name: 'Werk'
            }, {
                name: 'Kassör'
            }, {
                name: 'Mat'
            }, {
                name: 'Öl & Bar'
            }, {
                name: 'What'
            }, {
                name: 'Lat'
            }, {
                name: 'Matt'
            }, {
                name: 'Tjoflatt'
            }, {
                name: 'Megaman'
            }, {
                name: 'Sovsir'
            }];

            $scope.missions = [{
                name: 'Ta 5 klunkar',
                spin: false,
                stopIndex: null
            }, {
                name: 'Ge 5 klunkar',
                spin: false,
                stopIndex: null
            }, {
                name: 'Ta 1 Shot',
                spin: false,
                stopIndex: null
            }, {
                name: 'Ta av 1 klädesplagg',
                spin: false,
                stopIndex: null
            }, {
                name: 'Spring 1 varv runt huset',
                spin: false,
                stopIndex: null
            }];

            $scope.getXTranslateForWheel = function(index) {
                return 0;
            };

            $scope.startGame = function() {
                $scope.started = true;

                startRound();
            };

            function resetData() {
                $scope.roundIndexes = [];
            }

            function startRound() {
                resetData();
                $scope.audio.play();
                $scope.roundActive = true;
                startSpinning();
            }

            function getRandomPlayerIndex() {
                var random = Math.floor(Math.random() * $scope.players.length);
                if ($scope.missions.length <= $scope.players.length && $scope.roundIndexes.contains(random)) {
                    return getRandomPlayerIndex();
                }
                return random;
            }

            function setStoptimersForMission(mission, time) {
                $timeout(function() {
                    mission.spin = false;
                    var randIndex = getRandomPlayerIndex();
                    $scope.roundIndexes.push(randIndex);
                    mission.stopIndex = randIndex;
                }, time);
            }

            function calculateSpinnersTimeLength() {
                var arr = [];
                var duration = $scope.audio.duration * 1000;
                var splitTime = SPINNERS_STOP_MARGIN / $scope.missions.length;
                $scope.missions.forEach(function(mission, index) {
                    arr.push(duration - (splitTime * index));
                });
                return arr.reverse();
            }

            function startSpinning() {
                var spinnersTimeLength = calculateSpinnersTimeLength();
                for (var i = 0; i < $scope.missions.length; i++) {
                    var mission = $scope.missions[i];
                    mission.spin = true;
                    mission.stopIndex = null;
                    setStoptimersForMission(mission, spinnersTimeLength[i]);
                }
                startNextRoundTimer();
            }

            function startNextRoundTimer() {
                var time = calculateNextRoundTime();
                //var time = ($scope.audio.duration * 1000) + 5000; //DEBUG
                $timeout(function() {
                    $scope.roundActive = false;
                    startRound();
                }, time);
            }

            function calculateNextRoundTime() {
                var songduration = $scope.audio.duration * 1000;
                return songduration + randomTime($scope.minTime * 60, $scope.maxTime * 60);
            }
            /* Gets a random time between min and max in seconds */
            function randomTime(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
            }

        }
    ]);
