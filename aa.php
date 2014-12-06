<!DOCTYPE html>
<html lang="zh-cn">
    <head>
        <meta charset="utf-8">
        <title>jimp</title>
        <meta name="description" content="js图形处理">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="css/main.css">
    </head>
    <body ng-app="jimp">
        <div class="container">
            <div class="row">
                <nav class="navbar navbar-default" role="navigation">
                    <div class="navbar-header">
                        <a class="navbar-brand" href="index.html">jimp</a>
                    </div>
                    <div class="collapse navbar-collapse navbar-ex1-collapse">
                        <ul class="nav navbar-nav">
                            <li class="dropdown" ng-controller="file_manage_ctl">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">文件<b class="caret"></b></a>
                                <ul class="dropdown-menu menu-top">
                                    <li><a ng-click="file_open()">打开文件</a></li>
                                    <li><a href="/dropdown/label2">保存文件</a></li>
                                    <li class="divider"></li>
                                    <li><a href="/dropdown/label4">清除屏幕</a></li>
                                    <li class="divider"></li>
                                    <li><a href="/dropdown/label5">其他</a></li>
                                </ul>
                            </li>
                            <li class="dropdown" ng-controller="gray_img_ctl">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">灰度处理<b class="caret"></b></a>

                                <ul class="dropdown-menu menu-top">
                                    <li ng-click="img_to_gray()"><a>生成灰度图</a></li>
                                    <li ng-click="test_ll()"><a>生成直方图</a></li>

                                    <li class="divider"></li>
                                    <li><a href="/dropdown/label4">直方图统计</a></li>
                                    <li class="divider"></li>
                                    <li><a href="/dropdown/label5">其他</a></li>
                                </ul>
                            </li>
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">Multi Level <b class="caret"></b></a>
                                <ul class="dropdown-menu menu-top">
                                    <li><a href="#">Level 1</a></li>
                                    <li class="dropdown-submenu"> <a tabindex="-1" href="#">More options</a>
                                        <ul class="dropdown-menu">
                                            <li><a tabindex="-1" href="#">Level 2</a>
                                            </li>
                                            <li class="dropdown-submenu"> <a href="#">More..</a>
                                                <ul class="dropdown-menu">
                                                    <li><a href="#">Level 3</a>
                                                    </li>
                                                    <li><a href="#">Level 3</a>
                                                    </li>
                                                    <li class="dropdown-submenu"> <a href="#">More..</a>
                                                        <ul class="dropdown-menu">
                                                            <li><a href="#">Level 4</a>
                                                            </li>
                                                            <li><a href="#">Level 4</a>
                                                            </li>
                                                            <li class="dropdown-submenu"> <a href="#">More..</a>
                                                                <ul class="dropdown-menu">
                                                                    <li><a href="#">Level 5</a>
                                                                    </li>
                                                                    <li><a href="#">Level 5</a>
                                                                    </li>
                                                                </ul>
                                                            </li>

                                                        </ul>
                                                    </li>

                                                </ul>
                                            </li>
                                            <li><a href="#">Level 2</a>
                                            </li>
                                            <li><a href="#">Level 2</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li><a href="#">Level 1</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <img id="imageSource" src="images/1.jpg" alt="" />
                </div>

                <div class="col-md-6">
                    <div class="col-md-5">
                        <canvas id="grayImage"></canvas>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                </div>
                <div class="col-md-6" style="background-color: #00b3ee" ng-controller="huijiechange">
                    <input type=range min=1 max=255 value=1 ng-model="huijie" ng-change="gbhj()"  >
                    {{huijie||1}}
                </div>
            </div>
        </div>
        <?php 
        echo '是否支持php';
        ?>
        <!--Step:1 Prepare a dom for ECharts which (must) has size (width & hight)-->
        <!--Step:1 为ECharts准备一个具备大小（宽高）的Dom-->
        <div id="main" style="height:500px;border:1px solid #ccc;padding:10px;"></div>
       
        <!--Step:2 Import echarts.js-->
        <!--Step:2 引入echarts.js-->
        <script src="js/echarts.js"></script>

        <script type="text/javascript">
                        // Step:3 conifg ECharts's path, link to echarts.js from current page.
                        // Step:3 为模块加载器配置echarts的路径，从当前页面链接到echarts.js，定义所需图表路径
                        require.config({
                            paths: {
                                echarts: './js'
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
                                                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                                            }
                                        ]
                                    });              
                                }
                        );
        </script>
        <script src="bower_components/jquery/dist/jquery.min.js"></script>
        <script src="bower_components/angular/angular.min.js"></script>
        <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
        <script src="bower_components/angular-route/angular-route.min.js"></script>
        <script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
        <script src="js/jimp.js"></script>
        <script src="js/jimp-core.js"></script>

    </body>
</html>
