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
        init_img_show("images/1.jpg");

        var myFile = document.getElementById('file');
        myFile.onchange = function (event) {
            var selectedFile = event.target.files[0];
            var reader = new FileReader();
            reader.onload = putImage2Canvas;
            reader.readAsDataURL(selectedFile);
        };


        function putImage2Canvas(event) {
            var img_read = event.target.result;
            init_img_show(img_read);
        }
        ;



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
            }, {
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
            },{
                name: "hough",
                label: "霍夫变换",
                filterClass: "filter-hough",
                controlId: "其他变换"
            }];
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
        $scope.blur_change = function (type_value) {
            if (type_value == 1) {
                var dstMat = junzhi_blur(init_matrix, 3, 3, CV_BORDER_CONSTANT);
                mat2imgshow(dstMat, imgCanvas, imgCtx);
            } else if (type_value == 2) {
                var dstMat = GaussianBlur(init_matrix, 3, 3, 0, 0, CV_BORDER_CONSTANT);
                mat2imgshow(dstMat, imgCanvas, imgCtx);
            } else if (type_value == 3) {
                var dstMat = medianBlur(init_matrix, 3, 3, CV_BORDER_CONSTANT);
                mat2imgshow(dstMat, imgCanvas, imgCtx);
            }

        };
        $scope.sharpen_change = function (type_value) {
            if (type_value == 'sobel') {
                var dstMat = sharpen_sobel(init_matrix);
                mat2imgshow(dstMat, imgCanvas, imgCtx);
            } else if (type_value == 'roberts') {
                var matrix = new Array(-1,0,1,-2,0,2,-1,0,1);
                var dstMat = sharpen_roberts(init_matrix);
                mat2imgshow(dstMat, imgCanvas, imgCtx);
            } else if (type_value == 'laplace') {
                var matrix = new Array(1,1,1,1,-8,1,1,1,1);
                var dstMat = applyMatrix(init_matrix,matrix);
                mat2imgshow(dstMat, imgCanvas, imgCtx);
            }
            else if (type_value == 'marr') {
                var matrix = new Array(0,0,-1,0,0,0,-1,-2,-1,0,-1,-2,16,-2,-1,0,-1,-2,-1,0,0,0,-1,0,0);
                var dstMat = applyMatrix(init_matrix,matrix);
                mat2imgshow(dstMat, imgCanvas, imgCtx);
            }
            else if(type_value == "canny")
            {
                var dstMat=canny_edge(gray_matrix,0.80, 0.55);
                mat2imgshow(dstMat, imgCanvas, imgCtx);
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
        };
        $scope.hough_detecte = function(type){
            alert(type);
        }
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
        }, {
            name: "CS",
            src: "images/cs.png",
            selected: "false",
            class: "thumb"
        }, {
            name: "circle",
            src: "images/circle.png",
            selected: "false",
            class: "thumb"
        }, {
            name: "grace",
            src: "images/grace.png",
            selected: "false",
            class: "thumb"
        }];

    $scope.img_selected = function (m) {
        m.class = "thumb current";
        init_img_show(m.src);
    };
});