var init_matrix = null;
var gray_matrix = null;
/**********
 * config */
var $h=null;
var dims = [-1, -1]; //will be set later
var cc = 9e-3; //contrast constant

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


function get_img_mat(imgsrc) {
    var img = new Image();
    img.onload = function() {
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
        if (bb > 0) {
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
        if (aa > value) {
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

function get_zft_data256(__src) {
    var res = {
        data1: null,
        data2: null
    };
    if (__src.type && __src.type === "CV_RGBA") {
        var row = __src.row,
            col = __src.col;
        var data2 = __src.data;
        var pix1, pix2, pix = __src.row * __src.col * 4;
    } else if (__src.type && __src.type === "CV_GRAY") {
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
            gray_data[aa] ++;
        }
    }

    var tmpdata = new Array(256);
    var i = 0;
    for (i = 0; i < 256; i++) {
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

function noline_change1(gray_matrix, vv) {
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
        var Y = 0;
        if (vv == 1)
            Y = X + 0.8 * X * (255 - X) / 255;
        else if (vv == 2)
            Y = X * X / 255;
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

function get_zft_data2(__src) {
    var res = {
        data1: null,
        data2: null
    };
    if (__src.type && __src.type === "CV_RGBA") {
        var row = __src.row,
            col = __src.col;
        var data2 = __src.data;
        var pix1, pix2, pix = __src.row * __src.col * 4;
    } else if (__src.type && __src.type === "CV_GRAY") {
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
            gray_data[aa] ++;
        }
    }

    var tmpdata1 = new Array();
    var tmpdata2 = new Array();
    var i = 0;
    for (i = 0; i < 256; i++) {
        if (gray_data[i] > 0) {
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
        function(ec) {
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
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        magicType: {
                            show: true,
                            type: ['line', 'bar']
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                calculable: true,
                xAxis: [{
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
                }],
                yAxis: [{
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
                }],
                series: [{
                    name: '像素个数',
                    type: 'bar',
                    data: data2,
                    markPoint: {
                        data: [{
                            type: 'max',
                            name: '最大值'
                        }, {
                            type: 'min',
                            name: '最小值'
                        }]
                    },
                    markLine: {
                        data: [{
                            type: 'average',
                            name: '平均值'
                        }]
                    }
                }]
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


//灰度矩阵转数组
function mat2array(__src) {
    if (__src == null)
        __src = color2gray(init_matrix, 256);
    var res = {
        data: null,
        width: 0,
        height: 0,
        type: 2
    };

    res.height = __src.row;
    res.width = __src.col;
    res.data = [];
    var data2 = __src.data;
    var count = __src.row * __src.col * 4;
    var pix = 0;

    while (pix < count) {

        var aa = data2[pix];
        res.data.push(aa);
        pix += 4;
    }
    return res;
}


function mat2flyarray(__src) {
    if (__src == null)
        __src = color2gray(init_matrix, 256);
    var width=__src.col;
    var height=__src.row;
    var r = 1;
    var i = 1;
    while(i*2 < width) {
        i *= 2;
        r++;
    }
    var width2 = 1<<r;
    var r = 1;
    var i = 1;
    while(i*2 < height) {
        i *= 2;
        r++;
    }
    var data2 = __src.data;
    var height2 = 1<<r;
    var dataArrayTemp = [];
    for(var i=0; i<height2; i++) {
        for(var j=0; j<width2; j++) {
            if(i>=height || j>=width) {
                dataArrayTemp.push(0);
            }
            else {
                dataArrayTemp.push(data2[i*width+j]);
            }
        }
    }
    return dataArrayTemp;
}

function array2mat(arraydata, width, height) {
    var tempMat = new Mat(height, width, imageData.data);
    var tmpdata = new ArrayBuffer(width * height * 4);

    for (var i = 0; i < arraydata.data.length; i++) {
        tmpdata[i * 4 + 0] = arraydata[i];
        tmpdata[i * 4 + 1] = arraydata[i];
        tmpdata[i * 4 + 2] = arraydata[i];
        tmpdata[i * 4 + 3] = 255;
    }

    var data = new Uint8ClampedArray(buffer);

    tempMat.data = data;
    tempMat.type = "CV_GRAY";
    return tempMat;
}


function FFT(out, sig) {
    rec_FFT(out, 0, sig, 0, sig.length, 1);
}

function rec_FFT(out, start, sig, offset, N, s) {
    if (N === 1) {
        out[start] = new Complex(sig[offset], 0); //array
    } else {
        rec_FFT(out, start, sig, offset, N / 2, 2 * s);
        rec_FFT(out, start + N / 2, sig, offset + s, N / 2, 2 * s);
        for (var k = 0; k < N / 2; k++) {
            var twiddle = cisExp(-2 * Math.PI * k / N);
            var t = out[start + k];
            out[start + k] = t.plus(twiddle.times(out[start + k + N / 2]));
            out[start + k + N / 2] = t.minus(twiddle.times(out[start + k + N / 2]));
        }
    }
}

function invFFT(sig, transform) {
    rec_invFFT(sig, 0, transform, 0, transform.length, 1);
    for (var ai = 0; ai < sig.length; ai++) {
        sig[ai] = sig[ai].real / sig.length;
    }
}

function rec_invFFT(sig, start, transform, offset, N, s) {
    if (N === 1) {
        sig[start] = transform[offset];
    } else {
        rec_invFFT(sig, start, transform, offset, N / 2, 2 * s);
        rec_invFFT(sig, start + N / 2, transform, offset + s, N / 2, 2 * s);
        for (var k = 0; k < N / 2; k++) {
            var twiddle = cisExp(2 * Math.PI * k / N);
            var t = sig[start + k];
            sig[start + k] = t.plus(twiddle.times(sig[start + k + N / 2]));
            sig[start + k + N / 2] = t.minus(twiddle.times(sig[start + k + N / 2]));
        }
    }
}

function shiftFFT(transform) {
    return flipRightHalf(
        halfShiftFFT(
            halfShiftFFT(transform)
        )
    );
}

function unshiftFFT(transform) {
    return halfShiftFFT(
        halfShiftFFT(
            flipRightHalf(transform)
        )
    );
}

function halfShiftFFT(transform) {
    var ret = [];
    var N = dims[1];
    var M = dims[0];
    for (var n = 0, vOff = N / 2; n < N; n++) {
        for (var m = 0; m < M / 2; m++) {
            var idx = vOff * dims[0] + m;
            ret.push(transform[idx]);
        }
        vOff += vOff >= N / 2 ? -N / 2 : (N / 2) + 1;
    }
    for (var n = 0, vOff = N / 2; n < N; n++) {
        for (var m = M / 2; m < M; m++) {
            var idx = vOff * dims[0] + m;
            ret.push(transform[idx]);
        }
        vOff += vOff >= N / 2 ? -N / 2 : (N / 2) + 1;
    }
    return ret;
}

function flipRightHalf(transform) {
    var ret = [];

    //flip the right half of the image across the x axis
    var N = dims[1];
    var M = dims[0];
    for (var n = 0; n < N; n++) {
        for (var m = 0; m < M; m++) {
            var $n = m < M / 2 ? n : (N - 1) - n;
            var idx = $n * dims[0] + m;
            ret.push(transform[idx]);
        }
    }

    return ret;
}

/********************
 * helper functions */
function cisExp(x) { //e^ix = cos x + i*sin x
    return new Complex(Math.cos(x), Math.sin(x));
}

//returns array of pixel colors in the image
function getPixelsFromImage(location, callback) {
    var startedGettingPixels = new Date().getTime();
    var img = new Image(); //make a new image
    img.onload = function() { //when it is finished loading
        var canvas = document.createElement('canvas'); //make a canvas element
        canvas.width = img.width; //with this width
        //and this height (keep it the same as the image)
        canvas.height = img.height;
        canvas.style.display = 'none'; //hide it from the user
        document.body.appendChild(canvas); //then add it to the body
        var ctx = canvas.getContext('2d'); //now get the context
        //so that you can draw the image
        ctx.drawImage(img, 0, 0, img.width, img.height);
        //and grab its pixels
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        document.body.removeChild(canvas); //all done, so get rid of it

        //...all so you can send the pixels, width, and the time taken to get
        //   them back through the callback
        var ret = [];
        for (var ai = 0; ai < imageData.data.length; ai++) {
            //annoying copy so the array can be edited
            ret.push(imageData.data[ai]);
        }
        callback(ret, img.width, new Date().getTime() - startedGettingPixels);
    };

    img.src = location; //load the image
}

function getCoolColor(n, range) {
    if (n === range[0] && range[0] === range[1]) {
        return getCoolColor(2 * n, [n - 1, 2 * n + 1]);
    }

    var raw = [1.0, 1.0, 1.0]; //white

    if (n < range[0]) n = range[0];
    if (n > range[1]) n = range[1];
    var dn = range[1] - range[0];

    if (n < (range[0] + 0.25 * dn)) {
        raw[0] = 0;
        raw[1] = 4 * (n - range[0]) / dn;
    } else if (n < (range[0] + 0.5 * dn)) {
        raw[0] = 0;
        raw[2] = 1 + 4 * (range[0] + 0.25 * dn - n) / dn;
    } else if (n < (range[0] + 0.75 * dn)) {
        raw[0] = 4 * (n - range[0] - 0.5 * dn) / dn;
        raw[2] = 0;
    } else {
        raw[1] = 1 + 4 * (range[0] + 0.75 * dn - n) / dn;
        raw[2] = 0;
    }

    var color = [
        tightMap(raw[0], 0, 1, 0, 255),
        tightMap(raw[1], 0, 1, 0, 255),
        tightMap(raw[2], 0, 1, 0, 255)
    ];
    return color;
}

function disableButtons(callback) {
    $s('#draw-cs-btn').disabled = true;
    $s('#draw-circle-btn').disabled = true;
    $s('#draw-grace-btn').disabled = true;
    $s('#transform-btn').disabled = true;
    $s('#reconstruct-btn').disabled = true;
    $s('#difference-btn').disabled = true;

    setTimeout(callback, 6); //6ms for the UI to update
}

function enableButtons() {
    $s('#draw-cs-btn').disabled = false;
    $s('#draw-circle-btn').disabled = false;
    $s('#draw-grace-btn').disabled = false;
    $s('#transform-btn').disabled = false;
    $s('#reconstruct-btn').disabled = false;
    $s('#difference-btn').disabled = false;
}

function $s(id) { //for convenience
    if (id.charAt(0) !== '#') return false;
    return document.getElementById(id.substring(1));
}

function getRandInt(low, high) { //output is in [low, high)
    return Math.floor(low + Math.random() * (high - low));
}

function round(n, places) {
    var mult = Math.pow(10, places);
    return Math.round(mult * n) / mult;
}

function tightMap(n, d1, d2, r1, r2) { //enforces boundaries
    var raw = map(n, d1, d2, r1, r2);
    if (raw < r1) return r1;
    else if (raw > r2) return r2;
    else return raw;
}

//given an n in [d1, d2], return a linearly related number in [r1, r2]
function map(n, d1, d2, r1, r2) {
    var Rd = d2 - d1;
    var Rr = r2 - r1;
    return (Rr / Rd) * (n - d1) + r1;
}

/***********
 * objects */
function Complex(re, im) {
    this.real = re;
    this.imag = im;
}
Complex.prototype.magnitude2 = function() {
    return this.real * this.real + this.imag * this.imag;
};
Complex.prototype.magnitude = function() {
    return Math.sqrt(this.magnitude2());
};
Complex.prototype.plus = function(z) {
    return new Complex(this.real + z.real, this.imag + z.imag);
};
Complex.prototype.minus = function(z) {
    return new Complex(this.real - z.real, this.imag - z.imag);
};
Complex.prototype.times = function(z) {
    if (typeof z === 'object') { //complex multiplication
        var rePart = this.real * z.real - this.imag * z.imag;
        var imPart = this.real * z.imag + this.imag * z.real;
        return new Complex(rePart, imPart);
    } else { //scalar multiplication
        return new Complex(z * this.real, z * this.imag);
    }
};


function sct() {
    var h_hats = [];
    FFT(h_hats, gray_array);
    h_hats = shiftFFT(h_hats);
    var maxMagnitude = 0;
    for (var ai = 0; ai < h_hats.length; ai++) {
        var mag = h_hats[ai].magnitude();
        if (mag > maxMagnitude) {
            maxMagnitude = mag;
        }
    }

    var lpr = parseInt($s('#low-freq-radius').value); //low pass radius
    var hpr = parseInt($s('#high-freq-radius').value); //high " "
    var N = dims[1],
        M = dims[0];
    for (var k = 0; k < N; k++) {
        for (var l = 0; l < M; l++) {
            var idx = k * M + l;
            var dist = Math.pow(k - M / 2, 2) + Math.pow(l - N / 2, 2);
            if (dist > lpr * lpr && isNaN(hpr) ||
                dist < hpr * hpr && isNaN(lpr) ||
                dist < lpr * lpr && !isNaN(lpr) && !isNaN(hpr) ||
                dist > hpr * hpr && !isNaN(lpr) && !isNaN(hpr)) {
                h_hats[idx] = new Complex(0, 0);
            }
        }
    }
    var $h = function(k, l) {
        if (arguments.length === 0) return h_hats;

        var idx = k * dims[0] + l;
        return h_hats[idx];
    };


}