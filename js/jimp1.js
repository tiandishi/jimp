/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


'use strict';

var jimp = angular.module('jimp', ['ngRoute']);
jimp.config(['$routeProvider', '$locationProvider', '$sceProvider', function ($routeProvider, $locationProvider, $sceProvider) {
        $routeProvider

                .otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
    }]);

jimp.controller('select', function ($scope) {
    $scope.selected = '';
    $scope.operations = [
        {
            name: "blur",
            label: "模糊",
            filterClass: "filter-blur",
            controlId: "controls-blur"
        },
        {
            name: "edges",
            label: "边缘检测",
            filterClass: "filter-edges",
            controlId: "controls-edges"
        },
        {
            name: "greyscale",
            label: "灰度拉伸",
            filterClass: "filter-greyscale",
            controlId: "controls-greyscale"
        },
        {
            name: "mosaic",
            label: "马赛克",
            filterClass: "filter-mosaic",
            controlId: "controls-mosaic"
        },
        {
            name: "noise",
            label: "噪声",
            filterClass: "filter-noise",
            controlId: "controls-noise"
        },
        {
            name: "posterize",
            label: "Posterize",
            filterClass: "filter-posterize",
            controlId: "controls-posterize"
        },
        {
            name: "sharpen",
            label: "Sharpen",
            filterClass: "filter-sharpen",
            controlId: "controls-sharpen"
        },
        {
            name: "tint",
            label: "Colour Tint",
            filterClass: "filter-tint",
            controlId: "controls-tint"
        }
    ];
});