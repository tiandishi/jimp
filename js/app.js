'use strict';

var page2 = angular.module('page2', ['ui.bootstrap', 'ngRoute']);

page2.config(['$routeProvider', '$locationProvider', '$sceProvider', function ($routeProvider, $locationProvider, $sceProvider) {
        $routeProvider
                .when('/', {controller: 'DemoCtrl'})
                .when('/abc', {controller: 'DemoCtrl'})
                .when('/123', {controller: 'DemoCtrl'})
                .otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
    }]);

page2.controller('NavbarCtrl', function ($scope, $location) {
    $scope.isActive = function (route) {
        if ($location.path().indexOf('/dropdown') == 0) {
            return  route === '/dropdown';
        }
        return route === $location.path();
    }
});

page2.controller('DemoCtrl', function () {
    // nothing
});

page2.controller('img_to_gray',function(){
    alert("xxss");
        
});