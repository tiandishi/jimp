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
    var imgCanvas = document.getElementById("img_canvas");
    var imgCtx = imgCanvas.getContext("2d");
    var buffer = document.createElement("canvas");
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
            name: "gray_img",
            label: "生成灰度图",
            filterClass: "filter-blur",
            controlId: "黑白变换"
        },
        {
            name: "bitplane",
            label: "取位平面",
            filterClass: "filter-blur",
            controlId: "黑白变换"
        },
        
        {
            name: "yuzhitu",
            label: "阈值二值图",
            filterClass: "filter-blur",
            controlId: "黑白变换"
        },
       
        {
            name: "blur",
            label: "模糊",
            filterClass: "filter-blur",
            controlId: "彩色变换"
        },
        {
            name: "edges",
            label: "边缘检测",
            filterClass: "filter-edges",
            controlId: "黑白变换"
        },
        {
            name: "grayscale",
            label: "灰度拉伸",
            filterClass: "filter-grayscale",
            controlId: "黑白变换"
        },
        {
            name: "mosaic",
            label: "马赛克",
            filterClass: "filter-mosaic",
            controlId: "彩色变换"
        },
        {
            name: "noise",
            label: "噪声",
            filterClass: "filter-noise",
            controlId: "彩色变换"
        },
       
        {
            name: "sharpen",
            label: "锐化",
            filterClass: "filter-sharpen",
            controlId: "彩色变换"
        }
    ];
    $scope.gray_img_change = function (gray_value) {
        var value= parseInt(gray_value);
        var dstMat = color2gray(init_matrix,value);
        mat2imgshow(dstMat, imgCanvas, imgCtx);
        var zdtdata=get_zft_data256(dstMat);
        sczft(zdtdata.data1,zdtdata.data2);
    };
    $scope.bitplane_change=function (bit_value){
        var value= parseInt(bit_value);
        var dstMat = gray2bitplane(gray_matrix,value);
        mat2imgshow(dstMat, imgCanvas, imgCtx);
        var zdtdata=get_zft_data2(dstMat);
       sczft(zdtdata.data1,zdtdata.data2);
    };
    
    $scope.yuzhi_change=function(yuzhi_value){
        var value= parseInt(yuzhi_value);
        var dstMat = gray2yuzhitu(gray_matrix,value);
        mat2imgshow(dstMat, imgCanvas, imgCtx);
        var zdtdata=get_zft_data2(dstMat);
       sczft(zdtdata.data1,zdtdata.data2);
    };
});
