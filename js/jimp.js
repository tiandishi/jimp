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
jimp.service('imgdata', ['$rootScope', function ($rootScope) {
        var service = {
            data: {img_mat: null, gray_mat: null, grayCanvas: null, grayCtx: null, zftdata: new Array(256), yztdata: new Array(2)}
        };
        return service;
    }]);
jimp.controller('select_op', function ($scope) {
    
    var buffer = document.createElement("canvas");
    var imgCanvas = document.getElementById("img_canvas");
    var imgCtx = imgCanvas.getContext("2d");
// get the canvas context
    var c = buffer.getContext('2d');


    var img = new Image();
    img.onload = function () {
        imgCanvas.height = img.height;
        imgCanvas.width = img.width;
        imgCtx.drawImage(img, 0, 0);
        var imgdata = imgCtx.getImageData(0, 0, imgCanvas.width, imgCanvas.height);
        var data = imgdata.data;
        imgCtx.putImageData(imgdata, 0, 0);
    };

    img.src = "images/1.jpg";
    var matt = null;
    get_img_mat(matt);
    $scope.selected = '';
    $scope.operations = [
        {
            name: "grey_img",
            label: "生成灰度图",
            filterClass: "filter-blur",
            controlId: "controls-blur"
        },
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
    $scope.grey_img_change = function () {
        var img_mat = init_matrix;
        var dstMat = color2grey(init_matrix);
        mat2imgshow(dstMat, imgCanvas, imgCtx);
        var zdtdata=get_zft_data(dstMat);
        sczft(zdtdata);
    };

});
