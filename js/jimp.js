'use strict';

var jimp = angular.module('jimp', ['ui.bootstrap', 'ngRoute']);

jimp.config(['$routeProvider', '$locationProvider', '$sceProvider', function ($routeProvider, $locationProvider, $sceProvider) {
        $routeProvider
                .when('/', {controller: 'DemoCtrl'})
                .when('/abc', {controller: 'DemoCtrl'})
                .when('/123', {controller: 'DemoCtrl'})
                .otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
    }]);

jimp.controller('file_manage_ctl', function ($scope, $location) {
    $scope.isActive = function (route) {
        if ($location.path().indexOf('/dropdown') == 0) {
            return  route === '/dropdown';
        }
        return route === $location.path();
    };

    $scope.file_open = function () {
        alert("asdfasd");
        fileDialog.CancelError = true;
        try {
            fileDialog.Filter = "HTM   Files   (*.htm)|*.htm|Text   Files   (*.txt)|*.txt";
            fileDialog.ShowOpen();
            var fso = new ActiveXObject("Scripting.FileSystemObject");
            var reading = 1;
            var f = fso.OpenTextFile(fileDialog.filename, reading);
            //window.confirm(f);   
            var r = f.ReadAll();
            f.close();
            TxtBody.value = r;
        } catch (e) {
        }
    };


});

jimp.controller('gray_img_ctl', function ($scope, $location) {
    $scope.img_to_gray = function () {
        var iCanvas = document.getElementById("grayImage");
        var imgToGray = new imageToGray(iCanvas, "images/1.jpg");
        imgToGray.render();
    };

});

jimp.controller('img_to_gray', function () {

});