var init_matrix = null;
var gray_matrix = null;
var buffer = document.createElement("canvas");
// get the canvas context
var c = buffer.getContext('2d');
var imgCanvas = document.getElementById("img_canvas");
var imgCtx = imgCanvas.getContext("2d");
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


function amt_to_gray(img_mat) {
    var newImage = cvtColor(img_mat);

    var width = newImage.col,
            height = newImage.row,
            imageData = this.iCtx.createImageData(width, height);
    imageData.data.set(newImage.data);
    this.iCtx.putImageData(imageData, 0, 0);
}


function get_img_mat(imgsrc)
{
    var img = new Image();
    img.onload = function () {
        var myMat = imread(img);
        init_matrix = myMat;
        gray_matrix = null;
    };
    img.src = imgsrc;

}


//彩色转成灰阶
function color2gray(__src, max) {
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
    dst.type = "CV_GRAY";
    if (max == 256)
        gray_matrix = dst;
    return dst;
}
//得到二值图矩阵

function gray2bitplane(gray_matrix, value) {
    if (gray_matrix == null)
        gray_matrix = color2gray(init_matrix, 256);

    value = value - 1;
    var row = gray_matrix.row,
            col = gray_matrix.col;
    var dst = new Mat(row, col);
    var data = dst.data,
            data2 = gray_matrix.data;
    var pix1, pix2, pix = gray_matrix.row * gray_matrix.col * 4;
    while (pix) {
        pix -= 4, pix1 = pix + 1, pix2 = pix + 2;
        var aa = data2[pix];
        var tmp = 1 << value;
        var bb = aa & tmp;
        if (bb > 0)
        {
            bb = 255;
        }
        data[pix] = data[pix1] = data[pix2] = bb;
        data[pix + 3] = data2[pix + 3];
    }
    dst.type = "CV_GRAY";
    return dst;
}
function gray2yuzhitu(__src, value) {
    if (gray_matrix == null)
        gray_matrix = color2gray(init_matrix, 256);

    var row = gray_matrix.row,
            col = gray_matrix.col;
    var dst = new Mat(row, col);
    var data = dst.data,
            data2 = gray_matrix.data;
    var pix1, pix2, pix = gray_matrix.row * gray_matrix.col * 4;
    while (pix) {
        pix -= 4, pix1 = pix + 1, pix2 = pix + 2;
        var aa = data2[pix];
        var bb = 0;
        if (aa > value)
        {
            bb = 255;
        }
        data[pix] = data[pix1] = data[pix2] = bb;
        data[pix + 3] = data2[pix + 3];
    }
    dst.type = "CV_GRAY";
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

function get_zft_data256(__src)
{
    var res = {
        data1: null,
        data2: null
    };
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

    var tmpdata = new Array(256);
    var i = 0;
    for (i = 0; i < 256; i++)
    {
        tmpdata[i] = i;
    }
    res.data1 = tmpdata;
    res.data2 = gray_data;
    return res;
}

function gray2line_change(gray_matrix, aa, bb) {
    if (gray_matrix == null)
        gray_matrix = color2gray(init_matrix, 256);
    var row = gray_matrix.row,
            col = gray_matrix.col;
    var dst = new Mat(row, col);
    var data = dst.data,
            data2 = gray_matrix.data;
    var pix1, pix2, pix = gray_matrix.row * gray_matrix.col * 4;
    while (pix) {
        pix -= 4, pix1 = pix + 1, pix2 = pix + 2;
        var X = data2[pix];
        var Y = aa * X + bb;
        Y = check(Y);
        data[pix] = data[pix1] = data[pix2] = Y;
        data[pix + 3] = data2[pix + 3];
    }
    dst.type = "CV_GRAY";
    return dst;
}
function noline_change1(gray_matrix,vv){
    if (gray_matrix == null)
        gray_matrix = color2gray(init_matrix, 256);
    var row = gray_matrix.row,
            col = gray_matrix.col;
    var dst = new Mat(row, col);
    var data = dst.data,
            data2 = gray_matrix.data;
    var pix1, pix2, pix = gray_matrix.row * gray_matrix.col * 4;
    while (pix) {
        pix -= 4, pix1 = pix + 1, pix2 = pix + 2;
        var X = data2[pix];
        var Y=0;
        if(vv==1)
         Y =  X + 0.8*X*(255-X)/255;
        else if(vv==2)
            Y=X*X/255;
        Y = check(Y);
        data[pix] = data[pix1] = data[pix2] = Y;
        data[pix + 3] = data2[pix + 3];
    }
    dst.type = "CV_GRAY";
    return dst;
}
function check(x) {
    if (x > 255)
        return 255;
    else if (x < 0)
        return 0;
    else
        return x;
}
function get_zft_data2(__src)
{
    var res = {
        data1: null,
        data2: null
    };
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

    var tmpdata1 = new Array();
    var tmpdata2 = new Array();
    var i = 0;
    for (i = 0; i < 256; i++)
    {
        if (gray_data[i] > 0)
        {
            tmpdata1.push(i);
            tmpdata2.push(gray_data[i]);
        }
    }
    res.data1 = tmpdata1;
    res.data2 = tmpdata2;
    return res;
}


function sczft(data1, data2) {
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
                            data: data1,
                            axisLabel: {
                                show: true,
                                 rotate: 45,
                                interval: 'auto', // {number}
                                textStyle: {
                                    color: 'white',
                                    
                                    fontFamily: 'sans-serif',
                                    fontSize: 10
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                show: true,
                                interval: 'auto', // {number}
                                textStyle: {
                                    color: 'white',
                                    fontFamily: 'sans-serif',
                                    fontSize: 10
                                }
                            }
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


function applyMatrix(__src, matrix) {
    if (__src == null)
        __src = color2gray(init_matrix, 256);
    var row = __src.row,
            col = __src.col;
    var matrixSize = Math.sqrt(matrix.length);
    for (var i = 1; i < col - 1; i++) {
        for (var j = 1; j < row - 1; j++) {

            // temporary holders for matrix results
            var sumR = sumG = sumB = 0;

            // loop through the matrix itself
            for (var h = 0; h < matrixSize; h++) {
                for (var w = 0; w < matrixSize; w++) {

                    // get a refence to a pixel position in the matrix
                    var r = convertCoordinates(i + h - 1, j + w - 1, imgWidth) << 2;

                    // find RGB values for that pixel
                    var currentPixel = {
                        r: bufferedData[r],
                        g: bufferedData[r + 1],
                        b: bufferedData[r + 2]
                    };

                    // apply the value from the current matrix position
                    sumR += currentPixel.r * matrix[w + h * matrixSize];
                    sumG += currentPixel.g * matrix[w + h * matrixSize];
                    sumB += currentPixel.b * matrix[w + h * matrixSize];
                }
            }

            // get a reference for the final pixel
            var ref = convertCoordinates(i, j, imgWidth) << 2;
            var thisPixel = {
                r: data[ref],
                g: data[ref + 1],
                b: data[ref + 2]
            };

            // finally, apply the adjusted values
            data = setRGB(data, ref,
                    findColorDifference(amount, sumR, thisPixel.r),
                    findColorDifference(amount, sumG, thisPixel.g),
                    findColorDifference(amount, sumB, thisPixel.b));
        }
    }
}

function convertCoordinates(x, y, w) {
    return x + (y * w);
}