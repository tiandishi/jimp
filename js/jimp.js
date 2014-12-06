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

jimp.controller('gray_img_ctl', function ($scope, $location) {

    $scope.img_to_gray = function () {
        var iCanvas = document.getElementById("grayImage");
        var imgMat1 = new get_img_mat(iCanvas, "images/1.jpg");
        imgMat1.img_to_gray_in_max(16);
        // amt_to_gray(imgMat);
    };
    $scope.test_ll = function () {
        test_it();
    };
});
jimp.controller('img_to_gray', function () {
});


jimp.controller('huijiechange', function ($scope, $location) {
    $scope.gbhj = function () {
        //alert("sdfsd");
        var aa = $scope.huijie;
        var iCanvas = document.getElementById("grayImage");
        var imgMat1 = new get_img_mat(iCanvas, "images/1.jpg");
        imgMat1.img_to_gray_in_max(aa);
    }
});

jimp.controller('hualine', function ($scope, $location) {
    $scope.linedata=0;
    require.config({
        paths: {
            echarts: 'js'
        }
    });

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
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['蒸发量']
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
                            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            splitArea: {show: true}
                        }
                    ],
                    series: [
                        {
                            name: '蒸发量',
                            type: 'bar',
                            data: [3, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                        }
                    ]
                });
            }
    );
});