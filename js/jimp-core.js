var init_matrix = null;
var grey_matrix = null;
var buffer = document.createElement("canvas");
// get the canvas context
var c = buffer.getContext('2d');

function Mat(__row, __col, __data, __buffer) {
    this.row = __row || 0;
    this.col = __col || 0;
    this.channel = 4;
    this.buffer = __buffer || new ArrayBuffer(__row * __col * 4);
    this.data = new Uint8ClampedArray(this.buffer);
    __data && this.data.set(__data);
    this.bytes = 1;
    this.type = "CV_RGBA";
}
function imread(__image) {
    var width = __image.width,
            height = __image.height;
    iResize(buffer, width, height);

    c.drawImage(__image, 0, 0);
    var imageData = c.getImageData(0, 0, width, height),
            tempMat = new Mat(height, width, imageData.data);
    imageData = null;
    c.clearRect(0, 0, width, height);
    return tempMat;
}
//  调用以上方法可以得到图形矩阵

function iResize(Canvas, __width, __height) {
    Canvas.width = __width;
    Canvas.height = __height;
}

//彩图转灰白  src->dst
function cvtColor(_src, max) {
    if (_src.type && _src.type === "CV_RGBA") {
        var row = _src.row,
                col = _src.col;
        var dst = new Mat(row, col);
        data = dst.data,
                data2 = _src.data;
        var pix1, pix2, pix = _src.row * _src.col * 4;
        while (pix) {
            pix -= 4, pix1 = pix + 1, pix2 = pix + 2;

            var aa = (data2[pix] * 299 + data2[pix1] * 587 + data2[pix2] * 114) / 1000;
            var bb = Math.round(aa / max);
            bb = bb * max;
            data[pix] = data[pix1] = data[pix2] = bb;
            data[pix + 3] = data2[pix + 3];
        }
    } else {
        return src;
    }
    return dst;
}

function amt_to_gray(img_mat) {
    var newImage = cvtColor(img_mat);

    var width = newImage.col,
            height = newImage.row,
            imageData = this.iCtx.createImageData(width, height);
    imageData.data.set(newImage.data);
    this.iCtx.putImageData(imageData, 0, 0);
}


function get_img_mat(mat)
{
    var img = new Image();
    img.onload = function () {
        var myMat = imread(img);
        init_matrix = myMat;
    };
    img.src = "images/1.jpg";
}


//彩色转成灰阶
function color2grey(__src, max) {
    var aa = 257 - max;
    if (__src.type && __src.type === "CV_RGBA") {
        var row = __src.row,
                col = __src.col;
        var dst = new Mat(row, col);
        var data = dst.data,
                data2 = __src.data;
        var pix1, pix2, pix = __src.row * __src.col * 4;
        while (pix) {
            pix -= 4;
            pix1 = pix + 1;
            pix2 = pix + 2;
            var bb = (data2[pix] * 299 + data2[pix1] * 587 + data2[pix2] * 114) / 1000;
            bb = bb / aa;
            bb = Math.round(bb);
            bb = bb * aa;
            data[pix] = data[pix1] = data[pix2] = bb;
            data[pix + 3] = data2[pix + 3];
        }
    } else {
        return src;
    }
    dst.type = "CV_GRAY"
    grey_matrix = dst;
    return dst;
}

function mat2imgshow(__imgMat, canvas, ctx) {
    var width = __imgMat.col,
            height = __imgMat.row;
    canvas.width = width;
    canvas.height = height;
    var imageData = ctx.createImageData(width, height);
    imageData.data.set(__imgMat.data);
    ctx.putImageData(imageData, 0, 0);
}

function get_zft_data(__src)
{
    if (__src.type && __src.type === "CV_RGBA") {
        var row = __src.row,
                col = __src.col;
        var data2 = __src.data;
        var pix1, pix2, pix = __src.row * __src.col * 4;
    }
    else if (__src.type && __src.type === "CV_GRAY") {
        var gray_data = Array(256);
        var i = 0;
        for (i = 0; i < 256; i++)
            gray_data[i] = 0;
        var row = __src.row,
                col = __src.col;
        var data2 = __src.data;
        var pix = __src.row * __src.col * 4;

        while (pix) {
            pix -= 4;
            var aa = data2[pix];
            gray_data[aa]++;
        }
    }
    return gray_data;
}

function sczft(data) {
    var data1 = new Array();
    var data2 = data;
    var i = 0;
    for (i = 0; i < 256; i++) {
        data1.push(i);
    }
    require.config({
        paths: {
            echarts: 'js'
        }
    });
    require(
            [
                'echarts',
                'echarts/chart/bar',
                'echarts/chart/line'
            ],
            function (ec) {
                //--- 折柱 ---
                var myChart = ec.init(document.getElementById('zhifangtu'));
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
