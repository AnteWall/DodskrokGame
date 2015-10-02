angular.module('dodskrok.controllers', []);
angular.module('dodskrok.directives', []);
angular.module('dodskrok', ['ngMaterial', 'ngAudio', 'dodskrok.directives', 'dodskrok.controllers'])
    .config(function($mdThemingProvider) {

        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('default')
            .primaryPalette('red')
            .dark();
    });


Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};
