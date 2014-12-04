(function () {
//  获取自定义的图像矩阵
    function Mat(_row, _col, _data, _buffer) {
        this.row = _row || 0;
        this.col = _col || 0;
        this.channel = 4;
        this.buffer = _buffer || new ArrayBuffer(_row * _col * 4);
        this.data = new Uint8ClampedArray(this.buffer);
        _data && this.data.set(_data);
        this.bytes = 1;
        this.type = "CV_RGBA";
    }


//彩图转灰白  src->dst
    function cvtColor(_src,max) {
        if (_src.type && _src.type === "CV_RGBA") {
            var row = _src.row,
                    col = _src.col;
            var dst = new Mat(row, col);
            data = dst.data,
                    data2 = _src.data;
            var pix1, pix2, pix = _src.row * _src.col * 4;
            while (pix) {
                pix -= 4,pix1 = pix + 1,pix2 = pix + 2;
                
                var aa=(data2[pix] * 299 + data2[pix1] * 587 + data2[pix2] * 114) /1000;
                var bb=Math.round(aa/max);
                bb=bb*max;
                data[pix] = data[pix1] = data[pix2] = bb;
                data[pix + 3] = data2[pix + 3];
            }
        } else {
            return src;
        }
        return dst;
    }

    function test_it() {
        alert("shishi");
    }

    function amt_to_gray(img_mat) {
        var newImage = cvtColor(img_mat);

        var width = newImage.col,
                height = newImage.row,
                imageData = this.iCtx.createImageData(width, height);
        imageData.data.set(newImage.data);
        this.iCtx.putImageData(imageData, 0, 0);
    }


    function get_img_mat(iCanvas, url)
    {
        this.canvas = iCanvas;
        this.iCtx = this.canvas.getContext("2d");
        this.url = url;
    }
    get_img_mat.prototype = {
        imread: function (_image) {
            var width = _image.width,
                    height = _image.height;
            this.iResize(width, height);
            this.iCtx.drawImage(_image, 0, 0);
            var imageData = this.iCtx.getImageData(0, 0, width, height),
                    tempMat = new Mat(height, width, imageData.data);
            imageData = null;
            this.iCtx.clearRect(0, 0, width, height);
            return tempMat;
        },
        iResize: function (_width, _height) {
            this.canvas.width = _width;
            this.canvas.height = _height;
        },
        RGBA2ImageData: function (_imgMat) {
            var width = _imgMat.col,
                    height = _imgMat.row,
                    imageData = this.iCtx.createImageData(width, height);
            imageData.data.set(_imgMat.data);
            return imageData;
        },
        get_mat: function () {
            var img = new Image();
            var _this = this;
            img.onload = function () {
                var myMat = _this.imread(img);
                //return myMat;
                 var newImage = cvtColor(myMat);
                 var newIamgeData = _this.RGBA2ImageData(newImage);
                 _this.iCtx.putImageData(newIamgeData, 0, 0);
            };
            img.src = this.url;
        },
        
        img_to_gray_in_max: function (max) {
            var img = new Image();
            var _this = this;
            img.onload = function () {
                var myMat = _this.imread(img);
                //return myMat;
                var aa=256/max;
                 var newImage = cvtColor(myMat,aa);
                 var newIamgeData = _this.RGBA2ImageData(newImage);
                 _this.iCtx.putImageData(newIamgeData, 0, 0);
            };
            img.src = this.url;
        }
        
    };
    window.test_it = test_it;
    window.get_img_mat = get_img_mat;
    window.amt_to_gray=amt_to_gray;
})();
