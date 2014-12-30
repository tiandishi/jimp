/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


'use strict';

var jimp = angular.module('jimp', ['ngRoute']);
jimp.config(['$routeProvider', '$locationProvider', '$sceProvider', function ($routeProvider, $locationProvider, $sceProvider) {
        $routeProvider

                .otherwise({
                    redirectTo: '/'
                });
        $locationProvider.html5Mode(true);
    }]);
jimp.service('imgdata', ['$rootScope', function ($rootScope) {
        var service = {
            data: {
                img_mat: null,
                gray_mat: null,
                grayCanvas: null,
                grayCtx: null,
                zftdata: new Array(256),
                yztdata: new Array(2)
            }
        };
        return service;
    }]);
jimp.controller('select_op', ['$scope', function ($scope, $location) {
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
            dims[0] = img.width;
            dims[1] = img.height;
            imgCtx.putImageData(imgdata, 0, 0);


        };

        img.src = "images/1.jpg";
        get_img_mat("images/1.jpg");
        $scope.selected = '';
        $scope.operations = [{
                name: "gray_img",
                label: "生成灰度图",
                filterClass: "filter-blur",
                controlId: "黑白变换"
            }, {
                name: "bitplane",
                label: "取位平面",
                filterClass: "filter-blur",
                controlId: "黑白变换"
            }, {
                name: "yuzhitu",
                label: "阈值二值图",
                filterClass: "filter-blur",
                controlId: "黑白变换"
            }, {
                name: "gray_line_change",
                label: "线性变换",
                filterClass: "filter-blur",
                controlId: "黑白变换"
            }, {
                name: "not_line_change",
                label: "非线性变换",
                filterClass: "filter-blur",
                controlId: "黑白变换"
            }, {
                name: "fly_bh",
                label: "傅立叶变换",
                filterClass: "filter-edges",
                controlId: "黑白变换"
           
            }, {
                name: "blur",
                label: "平滑",
                filterClass: "filter-blur",
                controlId: "彩色变换"
            }, {
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
            }, {
                name: "mosaic",
                label: "马赛克",
                filterClass: "filter-mosaic",
                controlId: "彩色变换"
            }, {
                name: "noise",
                label: "噪声",
                filterClass: "filter-noise",
                controlId: "彩色变换"
            }, {
                name: "sharpen",
                label: "锐化",
                filterClass: "filter-sharpen",
                controlId: "彩色变换"
            }
        ];
        $scope.not_line_change = function (value) {
            var vv = parseInt(value) || 1;
            var dstMat = noline_change1(gray_matrix, vv);
            mat2imgshow(dstMat, imgCanvas, imgCtx);
            var zdtdata = get_zft_data2(dstMat);
            sczft(zdtdata.data1, zdtdata.data2);
        };
        $scope.gray_img_change = function (gray_value) {
            var value = parseInt(gray_value);
            var dstMat = color2gray(init_matrix, value);
            mat2imgshow(dstMat, imgCanvas, imgCtx);
            var zdtdata = get_zft_data256(dstMat);
            sczft(zdtdata.data1, zdtdata.data2);
        };
        $scope.bitplane_change = function (bit_value) {
            var value = parseInt(bit_value);
            var dstMat = gray2bitplane(gray_matrix, value);
            mat2imgshow(dstMat, imgCanvas, imgCtx);
            var zdtdata = get_zft_data2(dstMat);
            sczft(zdtdata.data1, zdtdata.data2);
        };

        $scope.yuzhi_change = function (yuzhi_value) {
            var value = parseInt(yuzhi_value);
            var dstMat = gray2yuzhitu(gray_matrix, value);
            mat2imgshow(dstMat, imgCanvas, imgCtx);
            var zdtdata = get_zft_data2(dstMat);
            sczft(zdtdata.data1, zdtdata.data2);
        };

        $scope.line_change = function (line_a, line_b) {
            var aa = parseFloat(line_a) || 1;
            var bb = parseFloat(line_b) || 0;
            var dstMat = gray2line_change(gray_matrix, aa, bb);
            mat2imgshow(dstMat, imgCanvas, imgCtx);
            var zdtdata = get_zft_data256(dstMat);
            sczft(zdtdata.data1, zdtdata.data2);
        };
        $scope.pinghua_change=function(type_value){
            if(type_value==1){
            var dstMat = junzhi_blur(init_matrix, 3, 3,CV_BORDER_CONSTANT);
            mat2imgshow(dstMat, imgCanvas, imgCtx);
            var zdtdata = get_zft_data256(dstMat);
            sczft(zdtdata.data1, zdtdata.data2);
        }
        else if(type_value==2){
            var dstMat = GaussianBlur(init_matrix, 3, 3,0,0,CV_BORDER_CONSTANT);
            mat2imgshow(dstMat, imgCanvas, imgCtx);
            var zdtdata = get_zft_data256(dstMat);
            sczft(zdtdata.data1, zdtdata.data2);
        }
        else if(type_value==3){
            var dstMat = medianBlur(init_matrix, 3, 3,CV_BORDER_CONSTANT);
            mat2imgshow(dstMat, imgCanvas, imgCtx);
            var zdtdata = get_zft_data256(dstMat);
            sczft(zdtdata.data1, zdtdata.data2);
        }
        
        };
        $scope.fly_bh = function (a, b, value) {
            var pra = parseInt(a);
            var prb = parseInt(b);
            if (value == 1)
                init1(imgCanvas, init_img_src);
            if (value == 2)
                init2(pra, prb);
            if (value == 3)
                init3();
            if (value == 4)
                init4();
            //   var aa = parseFloat(line_a) || 1;
            // var bb = parseFloat(line_b) || 0;
            //  var dstMat = gray2line_change(gray_matrix, aa, bb);
            //  mat2imgshow(dstMat, imgCanvas, imgCtx);
            //  var zdtdata = get_zft_data256(dstMat);
            //  sczft(zdtdata.data1, zdtdata.data2);
        };

    }]);



jimp.controller('select_img', function ($scope, $location) {
    $scope.imgsrc_data = [{
            name: "lighthouse",
            class: "thumb",
            src: "images/500/lighthouse.jpg",
            selected: "false"
        }, {
            name: "staples",
            class: "thumb",
            src: "images/500/staples.jpg",
            selected: "false"
        }, {
            name: "bee",
            class: "thumb",
            src: "images/500/bee.jpg",
            selected: "false"
        }, {
            name: "leaves",
            class: "thumb",
            src: "images/500/leaves.jpg",
            selected: "false"
        }, {
            name: "louvre",
            class: "thumb",
            src: "images/500/louvre.jpg",
            selected: "false"
        }, {
            name: "sign",
            class: "thumb",
            src: "images/500/sign.jpg",
            selected: "false"
        }, {
            name: "road",
            class: "thumb",
            src: "images/500/road.jpg",
            selected: "false"
        }, {
            name: "jordan",
            class: "thumb",
            src: "images/500/jordan.jpg",
            selected: "false"
        }, {
            name: "stones",
            src: "images/500/stones.jpg",
            selected: "false",
            class: "thumb"
        }, {
            name: "meinv",
            src: "images/1.jpg",
            selected: "false",
            class: "thumb"
        }
        , {
            name: "CS",
            src: "images/cs.png",
            selected: "false",
            class: "thumb"
        }
        , {
            name: "circle",
            src: "images/circle.png",
            selected: "false",
            class: "thumb"
        }
        , {
            name: "grace",
            src: "images/grace.png",
            selected: "false",
            class: "thumb"
        }
    ];

    $scope.img_selected = function (m) {
        m.class = "thumb current";
        var img = new Image();
        img.onload = function () {
            imgCanvas.height = img.height;
            imgCanvas.width = img.width;
            dims[0] = img.width;
            dims[1] = img.height;
            imgCtx.drawImage(img, 0, 0);
            var imgdata = imgCtx.getImageData(0, 0, imgCanvas.width, imgCanvas.height);
            var data = imgdata.data;
            imgCtx.putImageData(imgdata, 0, 0);
            get_img_mat(m.src);
        };
        img.src = m.src;
        init_img_src = m.src;
    };
});