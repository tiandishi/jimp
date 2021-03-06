'use strict';

var jimp = angular.module('jimp', ['ui.bootstrap', 'ngRoute']);

jimp.service('imgdata', ['$rootScope', function ($rootScope) {
        var service = {
            data:
                    {img_mat: null, gray_mat: null, grayCanvas: null, grayCtx: null, zftdata: new Array(256), yztdata: new Array(2)}
            ,
            img_load: function () {
                $rootScope.$broadcast('data.update');
            },
            Mat: function (__row, __col, __data, __buffer) {
                this.row = __row || 0;
                this.col = __col || 0;
                this.channel = 4;
                this.buffer = __buffer || new ArrayBuffer(__row * __col * 4);
                this.data = new Uint8ClampedArray(this.buffer);
                __data && this.data.set(__data);
                this.bytes = 1;
                this.type = "CV_RGBA";
            },
            imread: function (__image) {
                var width = __image.width,
                        height = __image.height;
                service.iResize(width, height);

                service.data.grayCtx.drawImage(__image, 0, 0);
                var imageData = service.data.grayCtx.getImageData(0, 0, width, height),
                        tempMat = new service.Mat(height, width, imageData.data);
                imageData = null;
                service.data.grayCtx.clearRect(0, 0, width, height);
                service.data.img_mat = tempMat;
                return tempMat;
            },
//  调用以上方法可以得到图形矩阵

            iResize: function (__width, __height) {
                service.data.grayCanvas.width = __width;
                service.data.grayCanvas.height = __height;
            },
            RGBA2ImageData: function (__imgMat) {
                var width = __imgMat.col,
                        height = __imgMat.row,
                        imageData = service.data.grayCtx.createImageData(width, height);
                imageData.data.set(__imgMat.data);
                return imageData;
            },
            cvtColor: function (__src) {
                if (__src.type && __src.type === "CV_RGBA") {
                    var row = __src.row,
                            col = __src.col;
                    var dst = new service.Mat(row, col);
                    var data = dst.data,
                            data2 = __src.data;
                    var pix1, pix2, pix = __src.row * __src.col * 4;
                    while (pix) {
                        data[pix -= 4] = data[pix1 = pix + 1] = data[pix2 = pix + 2] = (data2[pix] * 299 + data2[pix1] * 587 + data2[pix2] * 114) / 1000;
                        data[pix + 3] = data2[pix + 3];
                    }
                } else {
                    return src;
                }
                service.data.gray_mat = dst;
                return dst;
            },
            init_img: function () {
                service.data.grayCanvas = document.getElementById("grayImage");
                service.data.grayCtx = service.data.grayCanvas.getContext("2d");

                var img = new Image();
                img.onload = function () {
                    var myMat = service.imread(img);
                    var dstMat = service.cvtColor(myMat);
                    var immgg = service.RGBA2ImageData(dstMat);
                    service.data.grayCtx.putImageData(immgg, 0, 0);
                };
                img.src = "images/1.jpg";
            },
            //改变灰阶
            changehuijie: function (max) {
                var i = 0;
                for (; i < 256; i++)
                {
                    service.data.zftdata[i] = 0;
                }
                var row = service.data.gray_mat.row,
                        col = service.data.gray_mat.col;
                var dst = new service.Mat(row, col);
                var data = dst.data,
                        data2 = service.data.gray_mat.data;
                var pix1, pix2, pix = service.data.gray_mat.row * service.data.gray_mat.col * 4;
                while (pix) {
                    pix -= 4, pix1 = pix + 1, pix2 = pix + 2;
                    var aa = data2[pix];
                    var bb = Math.round(aa / max);
                    bb = bb * max;
                    data[pix] = data[pix1] = data[pix2] = bb;
                    data[pix + 3] = data2[pix + 3];
                    service.data.zftdata[bb]++;
                }
                return dst;
            },
            //获取位平面二值图矩阵
            get_bit_mat: function (i) {
                var row = service.data.gray_mat.row,
                        col = service.data.gray_mat.col;
                var dst = new service.Mat(row, col);
                var data = dst.data,
                        data2 = service.data.gray_mat.data;
                var pix1, pix2, pix = service.data.gray_mat.row * service.data.gray_mat.col * 4;
                while (pix) {
                    pix -= 4, pix1 = pix + 1, pix2 = pix + 2;
                    var aa = data2[pix];
                    var tmp = 1 << i;
                    var bb = aa & tmp;
                    if (bb > 0)
                    {
                        bb = 255;
                    }
                    data[pix] = data[pix1] = data[pix2] = bb;
                    data[pix + 3] = data2[pix + 3];
                }
                return dst;
            },
            line_change_mat: function (a, b) {
                var num_a = parseFloat(a);
                var num_b = parseFloat(b);
                var row = service.data.gray_mat.row,
                        col = service.data.gray_mat.col;
                var dst = new service.Mat(row, col);
                var data = dst.data,
                        data2 = service.data.gray_mat.data;
                var pix1, pix2, pix = service.data.gray_mat.row * service.data.gray_mat.col * 4;
                while (pix) {
                    pix -= 4, pix1 = pix + 1, pix2 = pix + 2;
                    var aa = data2[pix];
                    var bb = aa * num_a + num_b;
                    if (bb > 255)
                    {
                        bb = 255;
                    }
                    if (bb < 0)
                    {
                        bb = 0;
                    }
                    data[pix] = data[pix1] = data[pix2] = bb;
                    data[pix + 3] = data2[pix + 3];
                }
                return dst;
            },
            get_zft_data:function(srcMat){
                var row = srcMat.row,
                        col = srcMat.col;
                var dst = new Array(256);
                var i=0;
                for(i=0;i<256;i++)
                {
                    dst[i]=0;
                }
                var data2 = srcMat.data;
                var pix = row * col * 4;
                while (pix) {
                    pix -= 4;
                    var aa = data2[pix];
                    dst[aa]++;
                }
                return dst;
            },
            get_yuzhi_mat: function (i) {
                var row = service.data.gray_mat.row,
                        col = service.data.gray_mat.col;
                var dst = new service.Mat(row, col);
                service.data.yztdata[0] = service.data.yztdata[1] = 0;
                var data = dst.data,
                        data2 = service.data.gray_mat.data;
                var pix1, pix2, pix = service.data.gray_mat.row * service.data.gray_mat.col * 4;
                while (pix) {
                    pix -= 4, pix1 = pix + 1, pix2 = pix + 2;
                    var aa = data2[pix];
                    var bb = 0;
                    if (aa > i)
                    {
                        bb = 255;
                        service.data.yztdata[1]++;
                    }
                    else {
                        bb = 0;
                        service.data.yztdata[0]++;
                    }
                    data[pix] = data[pix1] = data[pix2] = bb;
                    data[pix + 3] = data2[pix + 3];

                }
                return dst;
            }
        }
        return service;
    }]);

jimp.config(['$routeProvider', '$locationProvider', '$sceProvider', function ($routeProvider, $locationProvider, $sceProvider) {
        $routeProvider

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
        //alert("asdfasd");
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

jimp.controller('gray_img_ctl', ['$scope', 'imgdata', function ($scope, imgdata) {
        //  alert("1asdf");
        $scope.img_to_gray = function () {
            imgdata.init_img();
        };
    }]);

jimp.controller('huijiechange', ['$scope', 'imgdata', function ($scope, imgdata) {
        $scope.gbhj = function () {
            var tmphj = $scope.huijie;
            var dstMat = imgdata.changehuijie(tmphj);
            var immgg = imgdata.RGBA2ImageData(dstMat);
            imgdata.data.grayCtx.putImageData(immgg, 0, 0);
            sczft();
        }
        function sczft() {
            //alert("hbb");
            require.config({
                paths: {
                    echarts: 'js'
                }
            });
            $scope.linedata = 0;

            var tmpdata = imgdata.data.zftdata;
            var data1 = new Array();
            var data2 = new Array();

            var i = 0;
            for (i = 0; i < 256; i++) {
                data1.push(i);
                data2.push(tmpdata[i]);
            }
// Step:4 require echarts and use it in the callback.
// Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
            require(
                    [
                        'echarts',
                        'echarts/chart/bar',
                        'echarts/chart/line'
                    ],
                    function (ec) {
                        //--- 折柱 ---
                        var myChart = ec.init(document.getElementById('main'));
                        myChart.setOption({
                            title: {
                                text: '灰度直方图',
                                subtext: '图片'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['像素个数']
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    mark: {show: true},
                                    dataView: {show: true, readOnly: false},
                                    magicType: {show: true, type: ['line', 'bar']},
                                    restore: {show: true},
                                    saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    type: 'category',
                                    data: data1
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value'
                                }
                            ],
                            series: [
                                {
                                    name: '像素个数',
                                    type: 'bar',
                                    data: data2,
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    }
                                }
                            ]
                        });
                    }
            );
        }
        ;
    }]);

jimp.controller('erzhitu', ['$scope', 'imgdata', function ($scope, imgdata) {
        var ezCanvas = document.getElementById("bitImage");
        var ezCtx = ezCanvas.getContext("2d");
        $scope.scezt = function () {
            var bitvalue = $scope.bitvalue;
            var dstMat = imgdata.get_bit_mat(bitvalue - 1);
            var immgg = imgdata.RGBA2ImageData(dstMat);
            ezCtx.putImageData(immgg, 0, 0);
        }
    }]);


jimp.controller('yuzhihua', ['$scope', 'imgdata', function ($scope, imgdata) {
        var yzCanvas = document.getElementById("yuzhi_img");
        var yzCtx = yzCanvas.getContext("2d");
        $scope.scyzt = function () {
            //     alert("sdsd");
            var yzvalue = $scope.yuzhi;
            var dstMat = imgdata.get_yuzhi_mat(yzvalue);
            var immgg = imgdata.RGBA2ImageData(dstMat);
            yzCtx.putImageData(immgg, 0, 0);
            scyzzft();
        };
        function scyzzft() {

            require.config({
                paths: {
                    echarts: 'js'
                }
            });
            $scope.linedata = 0;

            var tmpdata = imgdata.data.yztdata;
            var data1 = new Array();
            var data2 = new Array();

            var i = 0;
            for (i = 0; i < 2; i++) {
                data1.push(i);
                data2.push(tmpdata[i]);
            }
// Step:4 require echarts and use it in the callback.
// Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
            require(
                    [
                        'echarts',
                        'echarts/chart/bar',
                        'echarts/chart/line'
                    ],
                    function (ec) {
                        //--- 折柱 ---
                        var myChart = ec.init(document.getElementById('yzhzft'));
                        myChart.setOption({
                            title: {
                                text: '域值直方图',
                                subtext: '图片'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['像素个数']
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    mark: {show: true},
                                    dataView: {show: true, readOnly: false},
                                    magicType: {show: true, type: ['line', 'bar']},
                                    restore: {show: true},
                                    saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    type: 'category',
                                    data: data1
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value'
                                }
                            ],
                            series: [
                                {
                                    name: '像素个数',
                                    type: 'bar',
                                    data: data2,
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    }
                                }
                            ]
                        });
                    }
            );

        }
    }]);
jimp.controller('line_change', ['$scope', 'imgdata', function ($scope, imgdata) {
        var line_changeimg = document.getElementById('line_change1');
        var line_changeimg_ctx = line_changeimg.getContext("2d");
        $scope.line_a = 1;
        $scope.line_b = 0;
        $scope.linechange = function () {
            var aa = $scope.line_a;
            var bb = $scope.line_b;
            var dstMat = imgdata.line_change_mat(aa, bb);
            var zftdata=imgdata.get_zft_data(dstMat);
            var immgg = imgdata.RGBA2ImageData(dstMat);
            line_changeimg_ctx.putImageData(immgg, 0, 0);

            line_zft(zftdata);
        };

        function line_zft(zftdata) {
            require.config({
                paths: {
                    echarts: 'js'
                }
            });
            $scope.linedata = 0;

            var tmpdata = imgdata.data.yztdata;
            var data1 = new Array();
            var data2 = zftdata;

            var i = 0;
            for (i = 0; i < 256; i++) {
                data1.push(i);
            }
// Step:4 require echarts and use it in the callback.
// Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
            require(
                    [
                        'echarts',
                        'echarts/chart/bar',
                        'echarts/chart/line'
                    ],
                    function (ec) {
                        //--- 折柱 ---
                        var myChart = ec.init(document.getElementById('line_zft'));
                        myChart.setOption({
                            title: {
                                text: '变换后直方图',
                                subtext: '图片'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['像素个数']
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    mark: {show: true},
                                    dataView: {show: true, readOnly: false},
                                    magicType: {show: true, type: ['line', 'bar']},
                                    restore: {show: true},
                                    saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    type: 'category',
                                    data: data1
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value'
                                }
                            ],
                            series: [
                                {
                                    name: '像素个数',
                                    type: 'bar',
                                    data: data2,
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    }
                                }
                            ]
                        });
                    }
            );
        }
    }]);