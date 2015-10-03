angular.module('dodskrok.directives')
    .directive('dkCarouselWheel', function($interval) {
        return {
            restrict: 'E',
            templateUrl: '/common/directives/dkCarouselWheel/dkCarouselWheel.html',
            scope: {
                spin: '=',
                xTranslate: '=',
                players: '=',
                index: '=',
                mission: '=',
                stopIndex: '='
            },
            link: function(scope, element, attr) {

                var theta = 0;
                scope.radius = 0;
                var panelHeight = 80;
                var panelWidth = 200;
                var interval = 100;
                scope.spinPromise = null;
                scope.rotation = 0;
                scope.list = [];


                function initialize() {
                    theta = 360 / scope.list.length;
                    scope.radius = Math.round((panelHeight / 2) / Math.tan(Math.PI / scope.list.length));

                    scope.rotation = Math.round(scope.rotation / theta) * theta;
                }

                scope.figureStyle = function(index) {
                    var angle = theta * index;
                    var values = {
                        'transform': 'rotateX(' + angle + 'deg) translateZ(' + scope.radius + 'px)'
                    };
                    return values;
                };

                scope.marginOffset = function() {
                    var values = {
                        'margin-top': ((scope.radius + 50) * Math.floor(scope.index / 4)) + 'px'
                    };
                    return values;
                };

                scope.wheelStyle = function() {
                    var values = {
                        'margin': ((scope.list.length / 4) * (panelHeight / 2)) + 'px 0',
                        'transform': 'translateX(' + scope.xTranslate + 'px) translateZ(-' + scope.radius + 'px) rotateX(' + scope.rotation + 'deg)'
                    };
                    return values;
                };

                function spinit() {
                    if (scope.spin) {
                        scope.spinPromise = $interval(function() {
                            scope.rotation = (scope.rotation + (theta * -1));
                        }, interval);
                    }
                }

                function getRotationFromIndex(index) {
                    return 0 - (theta * (index + 1));
                }

                /*************************
                        Watchers
                *************************/

                scope.$watchCollection('players', function(value) {
                    if (!!value) {
                        scope.list = value;
                        initialize();
                    }
                });

                scope.$watch('spin', function(value) {
                    if (!!value) {
                        spinit();
                    } else if (value === false) {
                        $interval.cancel(scope.spinPromise);
                    }
                });

                scope.$watch('stopIndex', function(value) {
                    if (!!value) {
                        $interval.cancel(scope.spinPromise);
                        scope.rotation = getRotationFromIndex(value);
                    }
                });

            }
        };
    });
